@echo off
echo 🧪 AttributeAI Local Testing Suite - Pre-Commit Verification
echo ==========================================================
echo.
echo 📊 This will test all changes locally before committing to Git
echo.

echo 🔍 TESTING PHASE 1: Environment Configuration
echo ===============================================
echo.

rem Check if real Supabase credentials are configured
findstr "xpyfoutwwjslivrmbflm" .env.local >nul
if %errorlevel%==0 (
    echo ✅ 1.1 Real Supabase URL configured
) else (
    echo ❌ 1.1 Supabase URL not configured
    echo    Fix: Real credentials should be in .env.local
)

rem Check if Supabase anon key is real (not placeholder)
findstr "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" .env.local >nul
if %errorlevel%==0 (
    echo ✅ 1.2 Real Supabase anon key configured
) else (
    echo ❌ 1.2 Supabase anon key not configured
)

rem Check Google OAuth status
findstr "demo_google_client_id" .env.local >nul
if %errorlevel%==0 (
    echo ⚠️  1.3 Google OAuth still in demo mode
    echo    Action: Configure real Google Client ID after testing
) else (
    echo ✅ 1.3 Real Google Client ID configured
)

echo.
echo 🗄️ TESTING PHASE 2: Database Connection
echo =======================================
echo.
echo 📋 Opening Supabase project to verify database schema...
start https://xpyfoutwwjslivrmbflm.supabase.co/project/xpyfoutwwjslivrmbflm/editor/table
echo.
echo 🧪 Manual Verification Steps:
echo 1. Check that 'users' table exists with correct columns:
echo    - id, email, first_name, last_name
echo    - monthly_keyword_quota, keywords_used_this_month
echo    - subscription_tier, created_at
echo.
echo 2. Verify user sync: Should have 5 users (matching completed auth users)
echo.
echo 3. Check that other tables exist:
echo    - keyword_analyses (for storing keyword research)
echo    - related_keywords, content_opportunities
echo    - user_activity, keyword_performance
echo.

echo 🚀 TESTING PHASE 3: Application Startup
echo =========================================
echo.
echo Starting development servers...
echo.

rem Start API server in background
echo 🔧 Starting API server (port 3001)...
start /min cmd /c "cd server && node api-proxy.js"
timeout /t 3 /nobreak >nul

rem Start React frontend
echo 🌐 Starting React frontend (port 3000)...
start cmd /k "cd /d %cd% && npm start"

echo.
echo ⏰ Waiting for servers to start (30 seconds)...
timeout /t 5 /nobreak >nul

echo.
echo 🧪 TESTING PHASE 4: Frontend Verification
echo =========================================
echo.
echo 🎯 Manual Testing Checklist:
echo.
echo 📱 1. APPLICATION STARTUP (2 minutes)
echo    ✅ Navigate to: http://localhost:3000
echo    ✅ Page loads without errors
echo    ✅ No console errors in browser dev tools (F12)
echo.
echo 🔐 2. AUTHENTICATION STATUS (1 minute)
echo    ✅ Look for green "Production DB" badge in header
echo    ✅ "Demo Mode" banner should NOT appear
echo    ✅ Social login buttons visible
echo.
echo 🔍 3. KEYWORD INTELLIGENCE TEST (3 minutes)
echo    ✅ Click "Keyword Intelligence" tab
echo    ✅ Interface loads without errors
echo    ✅ Enter test keyword: "digital marketing"
echo    ✅ Click "Analyze with AI"
echo    ✅ Analysis completes and shows results
echo    ✅ Data shows "📊 Stored in DB" indicator
echo.
echo 🧪 4. DATA PERSISTENCE TEST (2 minutes)
echo    ✅ Refresh the page (Ctrl+R)
echo    ✅ Previous analysis should still be visible
echo    ✅ User quota should increment (1/1000 → 2/1000)
echo.
echo 🔐 5. AUTHENTICATION TEST (if Google OAuth configured)
echo    ✅ Click "Continue with Google"
echo    ✅ Should redirect to Google login
echo    ✅ After login, returns to AttributeAI
echo    ✅ User profile appears in app
echo.

echo 📊 TESTING PHASE 5: Database Verification
echo ==========================================
echo.
echo 🗄️ After testing keyword analysis:
echo 1. Go back to Supabase Table Editor
echo 2. Check 'keyword_analyses' table
echo 3. Should see your "digital marketing" analysis
echo 4. Check 'users' table
echo 5. Should see quota incremented for your user
echo.

echo 🎯 SUCCESS CRITERIA
echo ==================
echo.
echo ✅ ALL TESTS PASS = Ready to commit changes
echo ❌ ANY TEST FAILS = Fix before committing
echo.
echo 🔧 Common Issues ^& Fixes:
echo - "Demo Mode" showing = Database credentials not updated
echo - Google button doesn't work = OAuth not configured (expected for now)
echo - Keyword analysis fails = API server not running
echo - Data doesn't persist = Database trigger not set up
echo.

echo 📋 When all tests pass, run:
echo    commit-working-changes.bat
echo.

echo 🚀 READY TO START TESTING?
echo =========================
echo.
echo The application should be starting now.
echo Navigate to http://localhost:3000 and follow the checklist above.
echo.
echo Press any key when testing is complete...
pause

rem After testing, ask for results
echo.
echo 📊 TEST RESULTS
echo ==============
echo.
echo Did all tests pass? (y/n)
set /p tests_passed=

if /i "%tests_passed%"=="y" (
    echo.
    echo 🎉 EXCELLENT! Ready to commit changes.
    echo.
    echo 📋 Next steps:
    echo 1. Configure Google OAuth (if not done)
    echo 2. Run: commit-working-changes.bat
    echo 3. Deploy to production
    echo.
) else (
    echo.
    echo 🔧 ISSUES FOUND - Don't commit yet
    echo.
    echo 📋 Troubleshooting:
    echo 1. Check browser console for errors
    echo 2. Verify database schema is applied
    echo 3. Ensure API server is running
    echo 4. Check Supabase connection status
    echo.
    echo Re-run this test after fixing issues.
)

echo.
pause
