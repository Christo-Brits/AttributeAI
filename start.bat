@echo off
echo 🚀 Starting AttributeAI Platform...

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0

echo.
echo 📦 Starting from directory: %SCRIPT_DIR%

REM Navigate to server directory
echo.
echo 🔧 Starting API proxy server...
cd /d "%SCRIPT_DIR%server"
start cmd /k "echo API Proxy Server && node api-proxy.js"

echo.
echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak > nul

REM Navigate back to project root
cd /d "%SCRIPT_DIR%"

echo.
echo 🌐 Starting React frontend...
start cmd /k "echo React Frontend && npm start"

echo.
echo ✅ AttributeAI Platform is starting up!
echo.
echo 🔗 Frontend: http://localhost:3000
echo 🔗 API Proxy: http://localhost:3001
echo.
echo 💡 If you see errors, make sure to run 'npm install' first
echo.
pause
