@echo off
echo 🔧 Regenerating package-lock.json for Netlify sync
echo ================================================

echo 🧹 Removing old lock file...
if exist package-lock.json del package-lock.json

echo 📦 Installing dependencies to generate new lock file...
npm install --legacy-peer-deps

echo 🏗️ Testing build process...
npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ Build successful! Ready for Netlify deployment
    echo 🚀 package.json and package-lock.json are now in sync
) else (
    echo.
    echo ❌ Build failed! Please check the error messages above
)

echo.
echo 🎯 Next: Commit and push the new package-lock.json
pause
