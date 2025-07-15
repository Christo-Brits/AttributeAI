@echo off
echo 🔧 FIXING Google OAuth Redirect URL Issue
echo ========================================
echo.
echo 🔍 PROBLEM DIAGNOSED:
echo Your Google OAuth is redirecting to localhost instead of production domain
echo.
echo 🛠️ SOLUTION:
echo You need to update the redirect URLs in Google Cloud Console
echo.
echo 📋 STEPS TO FIX:
echo.
echo 1. Go to Google Cloud Console:
echo    https://console.cloud.google.com/apis/credentials
echo.
echo 2. Find your "AttributeAI Production" OAuth 2.0 Client ID
echo.
echo 3. Click on it to edit
echo.
echo 4. In "Authorized redirect URIs" section, make sure you have:
echo    ✅ https://xpyfoutwwjslivrmbflm.supabase.co/auth/v1/callback
echo    ✅ https://leafy-biscotti-c87e93.netlify.app/auth/callback
echo    ✅ http://localhost:3000/auth/callback (for development)
echo.
echo 5. REMOVE any old localhost-only entries
echo.
echo 6. Click "Save"
echo.
echo 🎯 The KEY redirect URL should be:
echo    https://xpyfoutwwjslivrmbflm.supabase.co/auth/v1/callback
echo.
echo 💡 This is the Supabase auth callback URL, not your app URL
echo.
echo 🚀 After saving:
echo 1. Clear browser cache and cookies
echo 2. Test Google sign-in on production site
echo 3. Should redirect properly to dashboard
echo.
pause
echo.
echo 🌐 Opening Google Cloud Console for you...
start https://console.cloud.google.com/apis/credentials
echo.
echo 🔧 Opening Supabase Auth Settings...  
start https://xpyfoutwwjslivrmbflm.supabase.co/project/xpyfoutwwjslivrmbflm/auth/providers
echo.
echo ✅ Fix complete when both tabs are updated and saved!
