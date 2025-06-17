@echo off
cd /d "C:\Users\chris\Projects\AttributeAI"
echo Current directory: %CD%
git add package.json
git add netlify.toml
git add test-build-debug.bat
git status
git commit -m "🔧 Fix Netlify deployment issues

- Added missing concurrently dependency to devDependencies
- Updated Netlify build command to include npm install
- Fixed build script availability for production deployment
- Verified local build works successfully"
git push origin main
echo.
echo Deployment fix committed and pushed!
pause
