@echo off
echo 🚀 AttributeAI Supabase Setup Script
echo =====================================
echo.
echo This script will help you configure your Supabase credentials.
echo.
echo 📋 Instructions:
echo 1. Go to https://supabase.com (already opened for you)
echo 2. Create account or sign in
echo 3. Click "New Project"
echo 4. Name: "AttributeAI Production"
echo 5. Choose region: "US East"
echo 6. Generate strong password
echo 7. Wait 2-3 minutes for setup
echo.
echo 📊 After project is created:
echo 1. Go to Settings ^> API
echo 2. Copy Project URL
echo 3. Copy anon public key
echo 4. Run this script again with your credentials
echo.

if "%1"=="" (
    echo 💡 Usage: %0 "project_url" "anon_key"
    echo Example: %0 "https://abcdefgh.supabase.co" "eyJhbGciOiJIUzI1NiIs..."
    echo.
    echo 🌐 Opening Supabase website now...
    start https://supabase.com
    pause
    exit /b
)

set "SUPABASE_URL=%~1"
set "SUPABASE_KEY=%~2"

echo 🔧 Updating .env.local with your credentials...
echo.

rem Create new .env.local with real credentials
(
echo # Local environment with real Supabase credentials
echo # Updated automatically by setup script
echo.
echo REACT_APP_SUPABASE_URL=%SUPABASE_URL%
echo REACT_APP_SUPABASE_ANON_KEY=%SUPABASE_KEY%
echo.
echo # Keep existing OAuth config
echo REACT_APP_GOOGLE_CLIENT_ID=demo_google_client_id
echo REACT_APP_AUTH_CALLBACK_URL=http://localhost:3000/auth/callback
echo REACT_APP_REDIRECT_URL=http://localhost:3000/dashboard
echo REACT_APP_SITE_URL=https://leafy-biscotti-c87e93.netlify.app
) > .env.local

echo ✅ Credentials updated successfully!
echo.
echo 📊 Next steps:
echo 1. Run database schema (script will do this)
echo 2. Test the connection
echo 3. Restart your dev server
echo.

echo 🗄️ Setting up database schema...
echo Opening Supabase SQL Editor...
start "%SUPABASE_URL%/editor/sql"

echo.
echo 📋 Copy and run this SQL in the editor:
echo.
type supabase\schema.sql | findstr /n "^" | more
echo.
echo 🚀 After running the schema, restart your dev server:
echo npm start
echo.
echo ✅ Setup complete! Your authentication should now work.
pause
