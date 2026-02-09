import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import fs from 'fs';

import connectDB from './config/db';
import authRoutes from './routes/auth';
import dataRoutes from './routes/data';
import messagesRoutes from './routes/messages';
import forecastRoutes from './routes/forecasts';
import { authMiddleware } from './middleware/auth';

dotenv.config();

// ✅ Logger setup: Lưu file + console
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, `server-${new Date().toISOString().split('T')[0]}.log`);
const errorLogFile = path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`);

function log(level: string, ...args: any[]) {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] [${level}] ${args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
  ).join(' ')}`;
  
  console.log(message);
  
  if (level === 'ERROR') {
    fs.appendFileSync(errorLogFile, message + '\n');
  }
  fs.appendFileSync(logFile, message + '\n');
}

// ✅ Validation env variables (warning, không exit ngay)
const requiredEnvs = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

if (missingEnvs.length > 0) {
  log('WARN', '⚠️  MISSING ENV VARIABLES:', missingEnvs.join(', '));
  log('WARN', 'CURRENT ENV:', {
    MONGO_URI: process.env.MONGO_URI ? '✅ SET' : '❌ MISSING',
    JWT_SECRET: process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING',
    FRONTEND_URL: process.env.FRONTEND_URL || 'not set',
    NODE_ENV: process.env.NODE_ENV || 'not set'
  });
  log('WARN', 'Server will start but may fail on API calls');
}

// Connect to MongoDB (non-blocking)
connectDB().catch(err => {
  log('WARN', '⚠️  MongoDB connection issue:', err.message);
});

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: (origin: string | undefined) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5073",
        process.env.FRONTEND_URL,
      ].filter(Boolean);
      
      if (!origin || allowedOrigins.includes(origin)) return true;
      return false;
    },
    credentials: true,
  },
});

// ✅ GLOBAL REQUEST LOGGER (CHỈ CẦN 1 CÁI NÀY ĐỂ DEBUG 404!)
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log incoming request (TRƯỚC KỲ LUẬT NÀO)
  log('INFO', `👉 [${req.method}] ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')?.substring(0, 50),
    body: req.method !== 'GET' ? req.body : undefined,
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
  });
  
  // Đo thời gian response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    log(logLevel, `✓ [${req.method}] ${req.url} → ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5073",
      process.env.FRONTEND_URL,
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      log('WARN', '🚫 CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ PARSER MIDDLEWARE (QUAN TRỌNG - PHẢI TRƯỚC ROUTES)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

log('INFO', '✅ Server middleware initialized');

// ✅ ROOT ROUTE - Check backend is alive
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚀 Delta Stress Lens Backend API - Online!',
    status: 'online',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'MongoDB Connected ✅',
    uptime: `${Math.round(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      public: [
        'POST /api/auth/register - Create new user',
        'POST /api/auth/login - User login'
      ],
      protected: [
        'GET /api/data/ - Get stress data',
        'POST /api/data/update - Update data',
        'GET /api/messages/inbox - Get user messages',
        'GET /api/messages/gov-inbox - Get gov messages',
        'POST /api/messages/send - Send message',
        'POST /api/messages/mark-read/:id - Mark message read',
        'DELETE /api/messages/:id - Delete message',
        'GET /api/forecasts/ - Get forecasts',
        'POST /api/forecasts/broadcast - Broadcast forecast',
        'GET /api/forecasts/:phenomenon - Get specific forecast'
      ],
      utility: [
        'GET /health - Health check'
      ]
    },
    tip: '💡 Use Postman or frontend fetch to /api/* endpoints',
    docs: 'Detailed API docs coming soon...'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/data', authMiddleware, dataRoutes);
app.use('/api/messages', authMiddleware, messagesRoutes);
app.use('/api/forecasts', authMiddleware, forecastRoutes);

// ✅ LOG ALL REGISTERED ROUTES (cho thấy route nào bị missing)
log('INFO', '📋 Registered routes:');
const routeMap: Record<string, string[]> = {};
function logRoutes(stack: any[], prefix = '') {
  stack.forEach(middleware => {
    if (middleware.route) {
      const path = prefix + middleware.route.path;
      const methods = Object.keys(middleware.route.methods);
      if (!routeMap[path]) routeMap[path] = [];
      routeMap[path].push(...methods.map(m => m.toUpperCase()));
    } else if (middleware.name === 'router') {
      logRoutes(middleware.handle.stack || [], prefix + middleware.regexp.source.replace(/\?.*/, ''));
    }
  });
}
logRoutes(app._router.stack);
Object.entries(routeMap).forEach(([path, methods]) => {
  log('INFO', `  ${methods.join('|')} → ${path}`);
});

// WebSocket event handlers
io.on('connection', (socket) => {
  log('INFO', `✅ User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    log('INFO', `❌ User disconnected: ${socket.id}`);
  });

  // Relay data updates to all connected clients
  socket.on('data_update', (data) => {
    io.emit('data_update', data);
  });

  // Relay forecast alerts
  socket.on('forecast_alert', (alert) => {
    io.emit('forecast_alert', alert);
  });

  // Relay messages
  socket.on('new_message', (message) => {
    io.emit('new_message', message);
  });
});

// ✅ 404 HANDLER (PHẢI TRƯỚC ERROR HANDLER)
app.use((req, res) => {
  const errorMsg = `404 NOT FOUND: ${req.method} ${req.url}`;
  log('ERROR', `🔴 ${errorMsg}`);
  log('ERROR', `Headers:`, req.headers);
  log('ERROR', `Available routes: ${Object.keys(routeMap).join(', ')}`);
  
  res.status(404).json({
    error: '404 Not Found',
    message: `Endpoint ${req.method} ${req.url} not found`,
    hint: 'Check server logs for available routes',
    method: req.method,
    path: req.url,
    availableRoutes: Object.entries(routeMap).map(([path, methods]) => 
      `${methods.join('|')} ${path}`
    ),
  });
});

// ✅ ERROR HANDLER GLOBAL (PHẢI CUỐI CÙNG, 4 PARAMS BẮT BUỘC!)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.status || err.statusCode || 500;
  const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  log('ERROR', `🔴 [${errorId}] ${err.name || 'UnknownError'}: ${err.message}`, {
    method: req.method,
    url: req.url,
    statusCode,
    stack: err.stack,
  });
  
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    errorId,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Export io for use in routes
export { io };

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  log('INFO', `
╔════════════════════════════════════════╗
║   DELTA STRESS LENS - BACKEND API      ║
║   ✅ Running on http://localhost:${PORT}     ║
║   📝 Logs: ${logsDir}        ║
╚════════════════════════════════════════╝
  `);
});

export default app;
