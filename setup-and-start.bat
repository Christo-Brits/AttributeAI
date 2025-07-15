@echo off
echo 🚀 Setting up and Starting AttributeAI...
echo.

REM Ensure we're in the right directory
cd /d "C:\Users\chris\Projects\AttributeAI"

REM Check if node_modules exists for frontend
echo 📦 Checking frontend dependencies...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo ✅ Frontend dependencies already installed
)

REM Check server dependencies
echo.
echo 📦 Checking server dependencies...
cd server
if not exist "node_modules" (
    echo Installing server dependencies...
    call npm install
) else (
    echo ✅ Server dependencies already installed
)

REM Start the servers
echo.
echo 🔧 Starting API proxy server...
start cmd /k "cd /d C:\Users\chris\Projects\AttributeAI\server && node api-proxy.js"

echo.
echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak > nul

echo.
echo 🌐 Starting React frontend...
cd ..
start cmd /k "cd /d C:\Users\chris\Projects\AttributeAI && npm start"

echo.
echo ✅ AttributeAI Platform is starting up!
echo.
echo 🔗 Frontend: http://localhost:3000
echo 🔗 API Proxy: http://localhost:3001
echo.
echo 📝 Note: The browser should open automatically
echo    If not, manually navigate to http://localhost:3000
echo.
pause
