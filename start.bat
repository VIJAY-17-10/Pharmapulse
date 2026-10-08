@echo off
title PharmaPulse - AI-Powered Pharmacy Spike Tracker
echo =====================================================================
echo  PharmaPulse -- AI-Powered Pharmacy Spike Tracker (SIH Prototype)
echo =====================================================================
echo.
echo Starting FastAPI Backend and Vite Frontend...
echo.

set PATH=C:\Users\ELCOT\nodejs;%PATH%

:: Start Backend
start "PharmaPulse Backend (FastAPI)" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

:: Start Frontend
start "PharmaPulse Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Backend URL : http://127.0.0.1:8000/docs
echo Frontend URL: http://localhost:5173/
echo.
echo Application is starting! Press any key to open browser...
pause > nul
start http://localhost:5173/
