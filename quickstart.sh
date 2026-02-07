#!/bin/bash
# 🚀 Delta Stress Lens - Quick Start Script

echo "╔════════════════════════════════════════════╗"
echo "║  DELTA STRESS LENS - QUICK START           ║"
echo "╚════════════════════════════════════════════╝"

# Check if PostgreSQL is running
echo ""
echo "🔍 Checking prerequisites..."

if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL not found. Please install PostgreSQL first."
    echo "   Download: https://www.postgresql.org/download/"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    echo "   Download: https://nodejs.org/"
    exit 1
fi

echo "✅ Prerequisites OK"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "  Creating .env file..."
    cp .env.example .env
    echo "  ⚠️  Please edit backend/.env with your database URL"
fi

echo "✅ Backend setup complete"

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ..

if [ ! -d "node_modules" ]; then
    echo "  Installing dependencies..."
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo "  Creating .env.local file..."
    cp .env.local.example .env.local
    echo "  ⚠️  Please edit .env.local with your Mapbox token"
fi

echo "✅ Frontend setup complete"

# Start Backend
echo ""
echo "🚀 Starting Backend Server..."
echo "   Command: cd backend && npm run dev"
echo "   Server: http://localhost:3001"
echo ""

# Start Frontend
echo ""
echo "🚀 Starting Frontend Server..."
echo "   Command: npm run dev"
echo "   URL: http://localhost:3000"
echo ""

echo "╔════════════════════════════════════════════╗"
echo "║  ✅ Setup complete!                        ║"
echo "║                                            ║"
echo "║  📝 TODO:                                  ║"
echo "║  1. Edit backend/.env with DATABASE_URL   ║"
echo "║  2. Edit .env.local with Mapbox token     ║"
echo "║  3. Run: cd backend && npm run db:setup   ║"
echo "║  4. Run: cd backend && npm run dev        ║"
echo "║  5. In new terminal: npm run dev          ║"
echo "║                                            ║"
echo "║  🌐 Login: http://localhost:3000/auth     ║"
echo "╚════════════════════════════════════════════╝"
