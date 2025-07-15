@echo off
echo 🔧 Fix Existing Supabase Project Connection
echo ==========================================
echo.
echo 📊 Using your existing Supabase project:
echo Project: https://xpyfoutwwjslivrmbflm.supabase.co
echo.
echo 🔄 Updating .env.local to use real credentials...

rem Create .env.local with real credentials from .env
(
echo # Local environment with REAL Supabase credentials
echo # Using existing project: xpyfoutwwjslivrmbflm
echo.
echo REACT_APP_SUPABASE_URL=https://xpyfoutwwjslivrmbflm.supabase.co
echo REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhweWZvdXR3d2pzbGl2cm1iZmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDMyODcsImV4cCI6MjA2NTQxOTI4N30.SmuHFfvlbgvU0rWsPZyn-UuZ3l135g3nKkZJqFA_bpc
echo.
echo # Keep existing OAuth config
echo REACT_APP_GOOGLE_CLIENT_ID=demo_google_client_id
echo REACT_APP_AUTH_CALLBACK_URL=http://localhost:3000/auth/callback
echo REACT_APP_REDIRECT_URL=http://localhost:3000/dashboard
echo REACT_APP_SITE_URL=https://leafy-biscotti-c87e93.netlify.app
) > .env.local

echo ✅ .env.local updated with real credentials!
echo.
echo 🗄️ Checking if database schema needs setup...
echo Opening SQL Editor for your existing project...
start https://xpyfoutwwjslivrmbflm.supabase.co/project/xpyfoutwwjslivrmbflm/editor/sql
echo.
echo 📋 If tables don't exist, run this SQL:
echo (Check Table Editor first - if you see 'users', 'keyword_analyses' tables, you're good!)
echo.
echo 🚀 After confirming database is ready:
echo 1. Close this window
echo 2. Run: npm start
echo 3. Look for "Production DB" green badge
echo.
echo ✅ Your existing data will be preserved!
pause
