@echo off
echo 🚀 Starting AttributeAI Platform...

echo.
echo 📦 Installing server dependencies...
cd server
if not exist node_modules (
    npm install
)

echo.
echo 🔧 Starting API proxy server...
start cmd /k "echo API Proxy Server && node api-proxy.js"

echo.
echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak > nul

echo.
echo 🌐 Starting React frontend...
cd ..
start cmd /k "echo React Frontend && npm start"

echo.
echo ✅ AttributeAI Platform is starting up!
echo.
echo 🔗 Frontend: http://localhost:3000
echo 🔗 API Proxy: http://localhost:3001
echo.
echo 💡 Configure your API keys in server\.env file
echo.
pause