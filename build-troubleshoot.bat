@echo off
echo 🔍 AttributeAI Build Troubleshooting Script
echo ===========================================

echo 📦 Environment Check:
node --version
npm --version
echo.

echo 📁 File Structure Check:
if exist package.json (echo ✅ package.json exists) else (echo ❌ package.json missing)
if exist src\index.js (echo ✅ src\index.js exists) else (echo ❌ src\index.js missing)
if exist src\App.js (echo ✅ src\App.js exists) else (echo ❌ src\App.js missing)
if exist public\index.html (echo ✅ public\index.html exists) else (echo ❌ public\index.html missing)
if exist src\components\EnhancedContentGenerator.js (echo ✅ EnhancedContentGenerator.js exists) else (echo ❌ EnhancedContentGenerator.js missing)

echo.
echo 🧹 Cleaning previous builds...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist build rmdir /s /q build

echo 📦 Installing dependencies...
npm install --legacy-peer-deps --no-optional

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully
) else (
    echo ❌ Dependency installation failed
    pause
    exit /b 1
)

echo.
echo 🏗️ Testing build process...
npm run build

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Build successful!
    echo 📊 Build size:
    if exist build dir build
    echo.
    echo ✅ Ready for Netlify deployment!
) else (
    echo.
    echo ❌ Build failed!
    echo 💡 Check the error messages above for details
    echo.
    echo 🔧 Common fixes:
    echo 1. Ensure all dependencies are listed in package.json
    echo 2. Check for typos in import statements
    echo 3. Verify all referenced files exist
    echo 4. Try: npm install --legacy-peer-deps --force
)

echo.
echo 🎯 For Netlify deployment:
echo 1. Commit all changes: git add . ^&^& git commit -m "Fix dependencies"
echo 2. Push to GitHub: git push origin main
echo 3. Netlify will auto-deploy with the updated configuration

pause
