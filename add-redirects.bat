@echo off
cd /d "C:\Users\chris\Projects\AttributeAI"
echo Adding _redirects file...
git add public/_redirects
git commit -m "➕ Add _redirects file for React Router SPA support

- Added /* /index.html 200 redirect rule to public/_redirects
- This ensures all routes are handled by React Router
- Fixes direct URL access and page refresh 404 errors"
git push origin main
echo.
echo _redirects file added and pushed!
pause
