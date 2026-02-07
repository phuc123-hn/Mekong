@echo off
REM 🚀 Delta Stress Lens - Quick Start Script (Windows)

echo.
echo ╔════════════════════════════════════════════╗
echo ║  DELTA STRESS LENS - QUICK START (Windows) ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    echo    Download: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found

REM Setup Backend
echo.
echo 📦 Setting up Backend...
cd backend

if not exist "node_modules" (
    echo   Installing dependencies...
    call npm install
)

if not exist ".env" (
    echo   Creating .env file...
    copy .env.example .env
    echo   ⚠️  Please edit backend\.env with your database URL
)

echo ✅ Backend setup complete

REM Setup Frontend
echo.
echo 📦 Setting up Frontend...
cd ..

if not exist "node_modules" (
    echo   Installing dependencies...
    call npm install
)

if not exist ".env.local" (
    echo   Creating .env.local file...
    copy .env.local.example .env.local
    echo   ⚠️  Please edit .env.local with your Mapbox token
)

echo ✅ Frontend setup complete

REM Display instructions
echo.
echo ╔════════════════════════════════════════════╗
echo ║  ✅ Setup complete!                        ║
echo ║                                            ║
echo ║  📝 NEXT STEPS:                            ║
echo ║  1. Edit backend\.env with DATABASE_URL   ║
echo ║  2. Edit .env.local with Mapbox token     ║
echo ║  3. Open terminal in backend folder       ║
echo ║  4. Run: npm run db:setup                 ║
echo ║  5. Run: npm run dev                      ║
echo ║                                            ║
echo ║  In new terminal in root folder:          ║
echo ║  6. Run: npm run dev                      ║
echo ║                                            ║
echo ║  🌐 Login: http://localhost:3000/auth     ║
echo ╚════════════════════════════════════════════╝
echo.
pause
