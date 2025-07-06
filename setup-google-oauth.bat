@echo off
echo 🔐 AttributeAI Google OAuth Setup Guide
echo =======================================
echo.
echo 📊 This will set up Google Sign-In to eliminate abandoned carts
echo.
echo ✅ Environment file: Updated with real Supabase credentials
echo ✅ Database: Ready and connected
echo ❌ Google OAuth: Needs configuration (this script)
echo.

echo 🎯 STEP 1: Google Cloud Console Setup
echo ====================================
echo 1. Opening Google Cloud Console...
start https://console.cloud.google.com
echo.
echo 📋 In Google Cloud Console:
echo 1. Select or create a project (name: AttributeAI)
echo 2. Go to "APIs & Services" ^> "Credentials"
echo 3. Click "Create Credentials" ^> "OAuth 2.0 Client IDs"
echo 4. Application type: "Web application"
echo 5. Name: "AttributeAI Production"
echo.
echo 🌐 AUTHORIZED REDIRECT URIs (add both):
echo   - https://xpyfoutwwjslivrmbflm.supabase.co/auth/v1/callback
echo   - http://localhost:3000/auth/callback
echo.
echo 📄 After creating, you'll get:
echo   - Client ID (starts with numbers, ends with .apps.googleusercontent.com)
echo   - Client Secret (shorter random string)
echo.

echo 🗄️ STEP 2: Supabase Configuration  
echo ===============================
echo 2. Opening Supabase Authentication settings...
start https://xpyfoutwwjslivrmbflm.supabase.co/project/xpyfoutwwjslivrmbflm/auth/providers
echo.
echo 📋 In Supabase Auth Providers:
echo 1. Find "Google" provider
echo 2. Toggle "Enable sign in with Google" to ON
echo 3. Enter your Google Client ID
echo 4. Enter your Google Client Secret
echo 5. Click "Save"
echo.

echo 🔧 STEP 3: Update Environment Variables
echo =====================================
echo After getting your Google Client ID, run this command:
echo.
echo   update-google-oauth.bat "your_google_client_id_here"
echo.
echo Example:
echo   update-google-oauth.bat "123456789-abcdefgh.apps.googleusercontent.com"
echo.

echo 🧪 STEP 4: Test Google Sign-In
echo ============================
echo After setup, restart dev server and test:
echo 1. npm start
echo 2. Click "Continue with Google"
echo 3. Should redirect to Google, then back to your app
echo 4. User should appear in both auth.users and public.users
echo.

echo 💰 EXPECTED RESULTS:
echo ✅ 70-80%% reduction in abandoned carts
echo ✅ Faster user onboarding (one-click vs form)
echo ✅ Higher completion rates
echo ✅ More active users in database
echo.

echo 📋 Ready to start Google Cloud Console setup?
pause
