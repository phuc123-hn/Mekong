@echo off
REM Start both backend and frontend servers

echo ====================================
echo Starting DELTA STRESS LENS Services
echo ====================================

REM Kill any existing node processes
taskkill /F /IM node.exe 2>nul

timeout /t 2 /nobreak

REM Start backend in new terminal
echo Starting Backend on port 3001...
start "DELTA STRESS - BACKEND" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak

REM Start frontend in new terminal
echo Starting Frontend on port 5073...
start "DELTA STRESS - FRONTEND" cmd /k "npm run dev"

echo.
echo ====================================
echo Services starting...
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5073
echo ====================================
