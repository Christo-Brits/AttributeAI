@echo off
cd /d "C:\Users\chris\Projects\AttributeAI"
echo Ensuring _redirects file is proper...

echo /*    /index.html   200 > public\_redirects

echo.
echo Checking file content:
type public\_redirects

echo.
echo Adding to git with force...
git add -A
git status
git commit -m "🔧 Force add _redirects file for Netlify React Router support

- Created _redirects file with proper SPA redirect rule
- Ensures /* routes to /index.html with 200 status
- Should fix all 404 page not found errors on Netlify"
git push origin main

echo.
echo Complete! Netlify should rebuild now.
pause
