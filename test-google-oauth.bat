@echo off
echo 🧪 Google OAuth Test - AttributeAI
echo ================================
echo.

echo 📊 Testing Google OAuth configuration...
echo.

rem Check environment file
echo 🔍 Environment Check:
findstr "REACT_APP_GOOGLE_CLIENT_ID=demo_google_client_id" .env.local >nul
if %errorlevel%==0 (
    echo ❌ Still using demo Google Client ID
    echo   Run: update-google-oauth.bat "your_real_client_id"
) else (
    echo ✅ Real Google Client ID configured
)

findstr "xpyfoutwwjslivrmbflm" .env.local >nul
if %errorlevel%==0 (
    echo ✅ Real Supabase credentials configured
) else (
    echo ❌ Supabase credentials missing
)

echo.
echo 🌐 Manual Test Steps:
echo 1. Open: http://localhost:3000
echo 2. Look for "Production DB" badge (not "Demo Mode")
echo 3. Click "Continue with Google"
echo 4. Should redirect to Google login
echo 5. After Google auth, should return to AttributeAI dashboard
echo 6. Check that user appears in Supabase users table
echo.

echo 🎯 Success Indicators:
echo ✅ Google button redirects to actual Google login
echo ✅ After login, redirects back to your app
echo ✅ User profile shows in app
echo ✅ User record created in Supabase database
echo ✅ No "Demo Mode" banner
echo.

echo ❌ Common Issues:
echo 1. "Demo Mode" still showing = Environment not updated
echo 2. Google button does nothing = Client ID not configured
echo 3. Redirect loop = Callback URLs don't match
echo 4. User not in database = Trigger not working
echo.

echo 📋 Troubleshooting Commands:
echo - Fix environment: update-google-oauth.bat "your_client_id"
echo - Fix database: Run complete-schema-fix.sql in Supabase
echo - Fix callbacks: Check Google Cloud Console redirect URIs
echo.

echo 🚀 Start development server for testing? (y/n)
set /p start=
if /i "%start%"=="y" (
    echo Starting server...
    start cmd /k "cd /d %cd% && npm start"
    echo.
    echo 🌐 Navigate to: http://localhost:3000
    echo 🧪 Click "Continue with Google" to test
)

echo.
pause
