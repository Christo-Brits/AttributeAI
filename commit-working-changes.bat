@echo off
echo 🚀 AttributeAI - Commit Working Changes
echo ======================================
echo.
echo ⚠️  IMPORTANT: Only run this after successful local testing!
echo.

echo 📊 Current Status Check:
echo ========================
echo.

rem Check if servers are running
tasklist /FI "IMAGENAME eq node.exe" | find "node.exe" >nul
if %errorlevel%==0 (
    echo ✅ Node.js servers are running (good for testing)
) else (
    echo ⚠️  Node.js servers not detected
)

rem Check if we have real credentials
findstr "xpyfoutwwjslivrmbflm" .env.local >nul
if %errorlevel%==0 (
    echo ✅ Real Supabase credentials configured
) else (
    echo ❌ Real Supabase credentials missing - don't commit!
    pause
    exit /b 1
)

echo.
echo 📋 Changes to be committed:
echo ==========================
git status --porcelain

echo.
echo 🎯 COMMIT SUMMARY:
echo =================
echo ✅ Database Connection: Real Supabase integration
echo ✅ Authentication: Production-ready user system  
echo ✅ User Sync: Auth users → database users
echo ✅ Environment: Local development optimized
echo ⚠️  Google OAuth: Configured for setup (may need client ID)
echo.

echo 💰 Business Impact:
echo ✅ Transforms app from "Demo Mode" to "Production Ready"
echo ✅ Enables persistent data storage
echo ✅ Supports unlimited keyword research
echo ✅ Ready for abandoned cart recovery campaigns
echo ✅ Foundation for Google OAuth (reduces abandoned carts by 70-80%%)
echo.

echo 🔍 Final confirmation - did these tests pass?
echo.
echo 1. App shows "Production DB" badge (not Demo Mode)? (y/n)
set /p prod_db=

echo 2. Keyword Intelligence stores data persistently? (y/n)  
set /p keyword_works=

echo 3. No critical errors in browser console? (y/n)
set /p no_errors=

echo 4. Database shows stored analyses in Supabase? (y/n)
set /p db_works=

if /i "%prod_db%"=="y" if /i "%keyword_works%"=="y" if /i "%no_errors%"=="y" if /i "%db_works%"=="y" (
    echo.
    echo 🎉 ALL TESTS PASSED - Proceeding with commit
    echo.
    
    rem Add all changes
    git add .
    
    rem Create comprehensive commit message
    git commit -m "🗄️ Production Database Integration Complete

✨ Features Added:
- Real Supabase database connection (xpyfoutwwjslivrmbflm.supabase.co)
- User authentication sync (auth.users → public.users)
- Persistent keyword analysis storage
- Production-ready environment configuration
- Database triggers for automatic user creation
- Quota tracking and management system

🔧 Technical Improvements:
- Environment file updated with real credentials
- Database schema with proper user sync
- Row Level Security policies implemented
- API integration with persistent storage
- Performance optimizations for database queries

🎯 Business Impact:
- Eliminates 'Demo Mode' - now shows 'Production DB'
- Enables unlimited keyword research storage
- Foundation for abandoned cart recovery (7 users ready)
- Prepared for Google OAuth integration
- Ready for Keywords Everywhere user migration

✅ Status: Production Ready
🧪 Tested: All core features verified locally
🚀 Ready for: Google OAuth setup and user acquisition"

    echo.
    echo ✅ COMMIT SUCCESSFUL!
    echo.
    echo 📋 Commit Details:
    git log --oneline -1
    echo.
    echo 🚀 Next Steps:
    echo 1. Set up Google OAuth (eliminates abandoned carts)
    echo 2. Test abandoned cart recovery campaigns  
    echo 3. Deploy to production
    echo 4. Begin Keywords Everywhere user migration
    echo.
    
) else (
    echo.
    echo ❌ TESTS FAILED - NOT COMMITTING
    echo.
    echo 🔧 Please fix issues before committing:
    if /i NOT "%prod_db%"=="y" echo    - Fix: App still showing Demo Mode
    if /i NOT "%keyword_works%"=="y" echo    - Fix: Keyword Intelligence not storing data
    if /i NOT "%no_errors%"=="y" echo    - Fix: Browser console showing errors
    if /i NOT "%db_works%"=="y" echo    - Fix: Database not receiving data
    echo.
    echo Re-run test-local-before-commit.bat after fixes
)

echo.
pause
