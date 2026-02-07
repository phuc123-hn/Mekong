import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import connectDB from './config/db';
import authRoutes from './routes/auth';
import dataRoutes from './routes/data';
import messagesRoutes from './routes/messages';
import forecastRoutes from './routes/forecasts';
import { authMiddleware } from './middleware/auth';

dotenv.config();

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', process.env.FRONTEND_URL || '*'],
    credentials: true,
  },
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
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ PARSER MIDDLEWARE (QUAN TRỌNG)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// WebSocket event handlers
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
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

// Export io for use in routes
export { io };

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   DELTA STRESS LENS - BACKEND API      ║
║   ✅ Running on http://localhost:${PORT}   ║
╚════════════════════════════════════════╝
  `);
});

export default app;
