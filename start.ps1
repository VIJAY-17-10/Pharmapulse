# PharmaPulse Startup Script for PowerShell
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " PharmaPulse -- AI-Powered Pharmacy Spike Tracker (SIH Prototype)" -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$env:PATH = "C:\Users\ELCOT\nodejs;" + $env:PATH
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "Starting FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\backend'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "Starting Vite Frontend on http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH = 'C:\Users\ELCOT\nodejs;' + `$env:PATH; cd '$scriptDir\frontend'; npm run dev"

Start-Sleep -Seconds 3
Write-Host ""
Write-Host "Application is live!" -ForegroundColor Green
Write-Host "Frontend URL: http://localhost:5173/" -ForegroundColor Cyan
Write-Host "Backend Docs: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host ""
Start-Process "http://localhost:5173/"
