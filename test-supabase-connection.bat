@echo off
echo 🧪 AttributeAI Supabase Connection Test
echo =======================================
echo.

rem Check if .env.local exists and has real credentials
if not exist ".env.local" (
    echo ❌ .env.local file not found
    echo Run setup-supabase-credentials.bat first
    pause
    exit /b 1
)

echo 📋 Checking environment configuration...
findstr "your_real_supabase_url_here" .env.local >nul
if %errorlevel%==0 (
    echo ❌ Still using placeholder credentials
    echo Run: setup-supabase-credentials.bat "your-url" "your-key"
    pause
    exit /b 1
)

echo ✅ Real credentials found in .env.local
echo.

echo 🗄️ Checking database schema file...
if not exist "supabase\schema.sql" (
    echo ❌ Database schema file missing
    pause
    exit /b 1
)

echo ✅ Database schema file found (should be 474 lines)
echo.

echo 🚀 Starting development server...
echo.
echo 📊 Expected results after server starts:
echo ✅ "Production DB" green badge in header
echo ✅ Keyword Intelligence tab works
echo ✅ Social authentication creates real accounts
echo ✅ Data persists across sessions
echo.
echo 🎯 If you see "Demo Mode" banner, database setup is incomplete
echo.

rem Start the development server
start cmd /k "cd /d %cd% && npm start"

echo 🌐 Development server starting...
echo Check browser at: http://localhost:3000
echo.
pause
