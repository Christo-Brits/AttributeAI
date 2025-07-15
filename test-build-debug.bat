@echo off
cd /d "C:\Users\chris\Projects\AttributeAI"
echo Current directory: %CD%
echo.
echo Testing build...
npm run build
echo.
echo Build test completed!
pause
