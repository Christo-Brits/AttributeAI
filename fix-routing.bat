@echo off
cd /d "C:\Users\chris\Projects\AttributeAI"
echo Current directory: %CD%
echo.
echo Adding redirect fixes...
git add public/_redirects
git add netlify.toml
git status
echo.
echo Committing fixes...
git commit -m "🔧 Fix React Router 404 errors on Netlify

- Added _redirects file to public folder for SPA routing
- Simplified netlify.toml redirects for React Router compatibility  
- Removed conflicting custom domain redirects that may cause issues
- Configured proper /* to /index.html 200 redirect for client-side routing

This should resolve the 'Page not found' errors on direct URL access."
echo.
echo Pushing to main...
git push origin main
echo.
echo Netlify should now rebuild and fix the 404 errors!
pause
