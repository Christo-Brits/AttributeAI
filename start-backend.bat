@echo off
echo ========================================
echo Starting AttributeAI Backend Server...
echo ========================================
echo.
cd server
echo Current directory: %cd%
echo.
echo Starting API server on port 3001...
node api-proxy.js
pause