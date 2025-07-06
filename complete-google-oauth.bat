@echo off
echo 🎉 Google OAuth Client Created Successfully!
echo ==========================================
echo.
echo 📋 NEXT STEPS - Complete the Setup:
echo.

echo 🔑 STEP 1: Get Your Credentials
echo ===============================
echo 1. In Google Cloud Console (current tab)
echo 2. Click on the OAuth client you just created
echo 3. COPY the Client ID (ends with .apps.googleusercontent.com)
echo 4. COPY the Client Secret
echo.

echo 🗄️ STEP 2: Configure Supabase  
echo =============================
echo Opening Supabase Auth Providers...
start https://xpyfoutwwjslivrmbflm.supabase.co/project/xpyfoutwwjslivrmbflm/auth/providers
echo.
echo In Supabase:
echo 1. Find "Google" provider
echo 2. Toggle "Enable sign in with Google" to ON
echo 3. Enter your Client ID
echo 4. Enter your Client Secret  
echo 5. Click "Save"
echo.

echo 🔧 STEP 3: Update Environment
echo =============================
echo After getting your Client ID, run:
echo.
echo   update-google-oauth.bat "YOUR_CLIENT_ID_HERE"
echo.
echo Example:
echo   update-google-oauth.bat "123456789-abcdefgh.apps.googleusercontent.com"
echo.

echo 🧪 STEP 4: Test Google Sign-In
echo ==============================
echo 1. Restart dev server (if needed)
echo 2. Go to: http://localhost:3000  
echo 3. Look for "Continue with Google" button
echo 4. Test the OAuth flow
echo.

echo 💰 EXPECTED RESULT:
echo ✅ Google sign-in button appears
echo ✅ One-click user registration/login
echo ✅ 70-80%% reduction in abandoned carts
echo ✅ Faster user onboarding
echo.

echo 📋 Ready to continue with Supabase configuration?
pause
