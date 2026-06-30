@echo off
title AgriSense - Smart Weather & Crop Forecasting
echo ============================================================
echo   🌾 AgriSense - Smart Weather & Crop Forecasting
echo ============================================================
echo.
cd /d "%~dp0"
if not exist node_modules (
    echo [Info] node_modules folder not found. Installing dependencies...
    call npm install
)
echo.
echo [Info] Starting server...
echo [Info] Opening http://localhost:3000 in your browser...
start http://localhost:3000
call npm start
pause
