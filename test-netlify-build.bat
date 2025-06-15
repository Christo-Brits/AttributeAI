@echo off
echo ===================================
echo  Testing Netlify Build Locally
echo ===================================

echo.
echo Step 1: Cleaning old build...
if exist build rmdir /s /q build

echo.
echo Step 2: Installing dependencies...
call npm ci --legacy-peer-deps --no-optional

echo.
echo Step 3: Running build with CI=false...
set CI=false
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ❌ BUILD FAILED!
    echo Check the error messages above.
    pause
    exit /b 1
)

echo.
echo ✅ BUILD SUCCESSFUL!
echo Build folder created successfully.
echo.
echo Build contents:
dir build /w

echo.
echo Ready to deploy to Netlify!
pause
