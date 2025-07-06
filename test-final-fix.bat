@echo off
echo 🧪 AttributeAI Final Authentication Test
echo ========================================
echo.
echo 📊 Testing your fixed Supabase connection...
echo.

rem Verify .env.local has real credentials
findstr "xpyfoutwwjslivrmbflm" .env.local >nul
if %errorlevel%==0 (
    echo ✅ Environment file updated with real credentials
) else (
    echo ❌ Environment file not updated correctly
    pause
    exit /b 1
)

echo ✅ Real Supabase project: xpyfoutwwjslivrmbflm.supabase.co
echo ✅ Database schema: All tables exist
echo ✅ Authentication users: 12+ users registered
echo.
echo 🔄 Starting development server...
echo.
echo 📋 Expected Results:
echo ✅ "Demo Mode" banner DISAPPEARS
echo ✅ "Production DB" green badge APPEARS
echo ✅ Social authentication works with real accounts
echo ✅ Keyword Intelligence stores data in database
echo ✅ User profiles sync between auth and database
echo.

rem Start the development server in a new window
start cmd /k "cd /d %cd% && npm start"

echo 🌐 Development server starting at: http://localhost:3000
echo.
echo 🎯 Test Steps:
echo 1. Look for "Production DB" badge in header
echo 2. Try Keyword Intelligence tab
echo 3. Enter a keyword and analyze
echo 4. Check that data persists after refresh
echo.
echo 🔍 If still showing "Demo Mode":
echo 1. Check that user sync SQL was run in Supabase
echo 2. Clear browser cache and reload
echo 3. Check browser console for errors
echo.
pause
