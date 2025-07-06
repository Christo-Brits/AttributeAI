@echo off
echo 🔐 Google OAuth Configuration Check
echo ===================================
echo.

echo 📊 Checking current Google OAuth status...
echo.

rem Check if Google Client ID is configured
findstr "demo_google_client_id" .env.local >nul
if %errorlevel%==0 (
    echo ❌ Google OAuth: Still in demo mode
    echo 💡 Action: Run update-google-oauth.bat with your real Client ID
    echo.
    echo 📋 Get Client ID from: https://console.cloud.google.com/apis/credentials
    echo 📋 Configure in Supabase: https://xpyfoutwwjslivrmbflm.supabase.co/project/xpyfoutwwjslivrmbflm/auth/providers
    echo.
) else (
    echo ✅ Google OAuth: Real Client ID configured
    
    rem Show the configured Client ID (first few characters for verification)
    for /f "tokens=2 delims==" %%a in ('findstr "REACT_APP_GOOGLE_CLIENT_ID" .env.local') do (
        set "client_id=%%a"
        setlocal enabledelayedexpansion
        echo 🔑 Client ID: !client_id:~0,20!...
        endlocal
    )
)

echo.
echo 🌐 Server Status:
tasklist /FI "IMAGENAME eq node.exe" | find "node.exe" >nul
if %errorlevel%==0 (
    echo ✅ Development server is running
    echo 🎯 Test at: http://localhost:3000
) else (
    echo ❌ Development server not running
    echo 💡 Start with: npm start
)

echo.
echo 🧪 Manual Verification Steps:
echo =============================
echo 1. Navigate to: http://localhost:3000
echo 2. Look for "Continue with Google" button
echo 3. Click the button - should redirect to Google
echo 4. Complete Google login
echo 5. Should redirect back to AttributeAI dashboard
echo.

echo 🎯 Expected Result After Setup:
echo ================================
echo ✅ Google sign-in button appears on login page
echo ✅ Clicking redirects to actual Google login
echo ✅ After Google auth, user lands in AttributeAI dashboard
echo ✅ User profile data automatically populated
echo ✅ Eliminated abandoned cart friction
echo.

echo 📋 Quick Setup Guide: GOOGLE_OAUTH_QUICK_SETUP.txt
echo.

echo Ready to test Google OAuth? (y/n)
set /p test_oauth=

if /i "%test_oauth%"=="y" (
    echo Opening AttributeAI for testing...
    start http://localhost:3000
    echo.
    echo 🧪 Test the "Continue with Google" button now!
)

pause
