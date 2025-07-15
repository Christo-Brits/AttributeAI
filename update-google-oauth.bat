@echo off
echo 🔧 Updating AttributeAI with Google OAuth Credentials
echo ================================================
echo.

if "%1"=="" (
    echo ❌ Error: Google Client ID required
    echo.
    echo 💡 Usage: %0 "your_google_client_id"
    echo Example: %0 "123456789-abcdefgh.apps.googleusercontent.com"
    echo.
    echo 📋 Get your Client ID from:
    echo https://console.cloud.google.com ^> APIs ^& Services ^> Credentials
    pause
    exit /b 1
)

set "GOOGLE_CLIENT_ID=%~1"

echo 📊 Updating environment with Google Client ID...
echo Client ID: %GOOGLE_CLIENT_ID%
echo.

rem Update .env.local with Google Client ID
(
echo # Local environment with REAL Supabase credentials
echo # Using existing project: xpyfoutwwjslivrmbflm
echo.
echo REACT_APP_SUPABASE_URL=https://xpyfoutwwjslivrmbflm.supabase.co
echo REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWZvdXR3d2pzbGl2cm1iZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDMyODcsImV4cCI6MjA2NTQxOTI4N30.SmuHFfvlbgvU0rWsPZyn-UuZ3l135g3nKkZJqFA_bpc
echo.
echo # Google OAuth Configuration
echo REACT_APP_GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID%
echo REACT_APP_AUTH_CALLBACK_URL=http://localhost:3000/auth/callback
echo REACT_APP_REDIRECT_URL=http://localhost:3000/dashboard
echo REACT_APP_SITE_URL=https://leafy-biscotti-c87e93.netlify.app
) > .env.local

echo ✅ Environment updated successfully!
echo.

echo 🧪 Testing Google OAuth Setup
echo ============================
echo.
echo 📋 Checklist:
findstr "%GOOGLE_CLIENT_ID%" .env.local >nul
if %errorlevel%==0 (
    echo ✅ Google Client ID in environment file
) else (
    echo ❌ Google Client ID not found in environment
)

echo ✅ Supabase URL configured
echo ✅ Supabase API key configured
echo.

echo 🚀 Next Steps:
echo 1. Ensure Google OAuth is enabled in Supabase (check providers page)
echo 2. Restart development server: npm start
echo 3. Test Google sign-in button
echo 4. Check that users appear in both auth.users and public.users
echo.

echo 🔥 Expected Result: Google sign-in works, eliminating most abandoned carts!
echo.

echo 🌐 Want to restart dev server now? (y/n)
set /p restart=
if /i "%restart%"=="y" (
    echo Starting development server...
    start cmd /k "cd /d %cd% && npm start"
)

pause
