@echo off
echo 🔍 DIAGNOSING OAUTH REDIRECT ISSUE
echo =================================
echo.
echo 📊 Current Status: Still redirecting to localhost
echo 🎯 Expected: Should redirect to production domain
echo.
echo 🔧 Let's check multiple configuration points...
echo.
echo 📋 STEP 1: Check Supabase Auth Settings
echo =======================================
echo.
echo Opening Supabase Auth Providers page...
start https://xpyfoutwwjslivrmbflm.supabase.co/project/xpyfoutwwjslivrmbflm/auth/providers
echo.
echo 🔍 What to check in Supabase:
echo 1. Google OAuth is ENABLED (toggle is ON)
echo 2. Your Google Client ID is correctly entered
echo 3. Site URL is set to: https://leafy-biscotti-c87e93.netlify.app
echo 4. Redirect URLs include your production domain
echo.
pause
echo.
echo 📋 STEP 2: Check Supabase URL Configuration
echo ==========================================
echo.
echo Opening Supabase URL Configuration...
start https://xpyfoutwwjslivrmbflm.supabase.co/project/xpyfoutwwjslivrmbflm/auth/url-configuration
echo.
echo 🔍 What to check:
echo 1. Site URL: https://leafy-biscotti-c87e93.netlify.app
echo 2. Redirect URLs should include:
echo    - https://leafy-biscotti-c87e93.netlify.app/**
echo    - https://attributeai.app/**
echo.
pause
echo.
echo 📋 STEP 3: Check Environment Variables
echo ====================================
echo.
echo Let's verify your production environment...
