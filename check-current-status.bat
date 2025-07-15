@echo off
echo 📊 AttributeAI Current Status - Pre-Commit Check
echo ===============================================
echo.

echo 🔍 GIT STATUS:
echo ==============
git status --short
echo.

echo 🔧 ENVIRONMENT STATUS:
echo ======================
if exist ".env.local" (
    echo ✅ .env.local exists
    
    findstr "xpyfoutwwjslivrmbflm" .env.local >nul
    if %errorlevel%==0 (
        echo ✅ Real Supabase URL configured
    ) else (
        echo ❌ Supabase URL not configured
    )
    
    findstr "demo_google_client_id" .env.local >nul
    if %errorlevel%==0 (
        echo ⚠️  Google OAuth in demo mode (expected until setup)
    ) else (
        echo ✅ Real Google Client ID configured
    )
) else (
    echo ❌ .env.local missing
)

if exist ".env.local.backup" (
    echo ✅ Backup file exists (.env.local.backup)
) else (
    echo ⚠️  No backup file found
)

echo.
echo 🗄️ DATABASE STATUS:
echo ==================
echo 📋 Supabase Project: xpyfoutwwjslivrmbflm.supabase.co
echo 🔗 Quick Links:
echo    Table Editor: https://xpyfoutwwjslivrmbflm.supabase.co/project/xpyfoutwwjslivrmbflm/editor/table
echo    Auth Users:   https://xpyfoutwwjslivrmbflm.supabase.co/project/xpyfoutwwjslivrmbflm/auth/users
echo    SQL Editor:   https://xpyfoutwwjslivrmbflm.supabase.co/project/xpyfoutwwjslivrmbflm/editor/sql
echo.

echo 🚀 SERVER STATUS:
echo =================
tasklist /FI "IMAGENAME eq node.exe" | find "node.exe" >nul
if %errorlevel%==0 (
    echo ✅ Node.js servers running
    echo 🌐 Frontend: http://localhost:3000
    echo 🔧 API: http://localhost:3001
) else (
    echo ❌ No Node.js servers detected
    echo 💡 Run: npm start (to test)
)

echo.
echo 📋 TESTING SCRIPTS AVAILABLE:
echo =============================
if exist "test-local-before-commit.bat" echo ✅ test-local-before-commit.bat
if exist "commit-working-changes.bat" echo ✅ commit-working-changes.bat  
if exist "rollback-changes.bat" echo ✅ rollback-changes.bat
if exist "setup-google-oauth.bat" echo ✅ setup-google-oauth.bat
if exist "complete-schema-fix.sql" echo ✅ complete-schema-fix.sql

echo.
echo 🎯 RECOMMENDED NEXT STEPS:
echo ==========================
echo.

findstr "xpyfoutwwjslivrmbflm" .env.local >nul
if %errorlevel%==0 (
    echo ✅ 1. Environment is configured
    echo 🧪 2. Run: test-local-before-commit.bat
    echo 📊 3. Verify all tests pass
    echo 🚀 4. Run: commit-working-changes.bat
    echo 🔐 5. Set up Google OAuth
) else (
    echo ❌ 1. Environment needs configuration
    echo 🔧 2. Run: fix-existing-project.bat
    echo 🧪 3. Then: test-local-before-commit.bat
)

echo.
echo 🛡️ SAFETY NET:
echo If anything goes wrong: rollback-changes.bat
echo.

pause
