@echo off
echo Testing AttributeAI build for Netlify deployment...
cd "C:\Users\chris\Projects\AttributeAI"

echo.
echo Installing styled-components dependency...
npm install styled-components

echo.
echo Testing build...
npm run build

echo.
echo Build test complete!
pause