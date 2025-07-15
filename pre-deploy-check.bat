@echo off
REM 🔧 AttributeAI Build Verification Script (Windows)
REM This script checks for syntax errors before deployment

echo 🚀 AttributeAI Pre-Deployment Check
echo ==================================

cd /d "%~dp0"

echo 📂 Current directory: %cd%
echo.

REM 1. Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ npm install failed
        pause
        exit /b 1
    )
)

echo 🔍 Running syntax and build checks...
echo.

REM 2. Check package.json exists
if not exist "package.json" (
    echo ❌ package.json not found
    pause
    exit /b 1
)

REM 3. Run the actual build
echo 🏗️  Running build test...
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo ✅ BUILD SUCCESSFUL! ✅
    echo.
    echo 📊 Build Statistics:
    echo ===================
    
    if exist "build" (
        echo 📁 Build folder created successfully
        dir build /s /-c | find "File(s)"
        echo.
    )
    
    echo 🚀 Ready for deployment!
    echo 💡 You can now safely deploy to Netlify
    echo.
    
    REM Show git status
    echo 📋 Git Status:
    git status --porcelain
    
    git status --porcelain | find /v "" >nul
    if not errorlevel 1 (
        echo.
        echo ⚠️  Note: You have uncommitted changes
        echo 🔄 Run: git add . ^&^& git commit -m "message" ^&^& git push
    ) else (
        echo ✅ All changes committed and ready
    )
    
    echo.
    echo Press any key to continue...
    pause >nul
    exit /b 0
) else (
    echo.
    echo ❌ BUILD FAILED! ❌
    echo.
    echo 🚨 Syntax errors detected!
    echo 🔧 Fix the errors above before deploying
    echo.
    pause
    exit /b 1
)