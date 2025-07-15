@echo off
echo 🚀 FIXING GOOGLE OAUTH REDIRECT - LIVE ASSISTANCE
echo ================================================
echo.
echo 🎯 We're going to fix this together right now!
echo.
echo 📋 STEP 1: Opening Google Cloud Console
echo ======================================
echo Opening your OAuth credentials page...
start https://console.cloud.google.com/apis/credentials
echo.
echo 🔍 Look for: "AttributeAI Production" or your OAuth 2.0 Client ID
echo 📝 Client ID should end with: .apps.googleusercontent.com
echo.
pause
echo.
echo 📋 STEP 2: What you should see and do
echo ====================================
echo.
echo 1. Find your OAuth 2.0 Client ID in the list
echo 2. Click on it (or click the pencil/edit icon)
echo 3. Scroll down to "Authorized redirect URIs"
echo.
echo 🎯 CURRENT PROBLEM: You probably see something like:
echo    ❌ http://localhost:3000/auth/callback
echo.
echo 🛠️ WHAT TO ADD: Click "+ ADD URI" and add these EXACT URLs:
echo    ✅ https://xpyfoutwwjslivrmbflm.supabase.co/auth/v1/callback
echo    ✅ https://leafy-biscotti-c87e93.netlify.app/auth/callback
echo.
echo 💡 KEEP the localhost one for development:
echo    ✅ http://localhost:3000/auth/callback
echo.
echo ⚠️ IMPORTANT: Copy these URLs EXACTLY (no typos!)
echo.
pause
echo.
echo 📋 STEP 3: Save and verify
echo =========================
echo.
echo 1. Click "SAVE" at the bottom
echo 2. Wait for "Credentials saved" confirmation
echo 3. You should now see all 3 redirect URIs listed
echo.
echo ✅ Success indicators:
echo - All 3 URIs are listed
echo - No error messages
echo - "Credentials saved" appears
echo.
pause
echo.
echo 📋 STEP 4: Test immediately
echo ==========================
echo.
echo Now let's test this fix!
echo.
echo 🌐 Opening your production site...
start https://leafy-biscotti-c87e93.netlify.app
echo.
echo 🧪 TEST STEPS:
echo 1. Go to login page
echo 2. Click "Continue with Google"
echo 3. Complete Google sign-in
echo 4. Should redirect to YOUR dashboard (not localhost!)
echo.
echo 🎉 SUCCESS = You end up at: https://leafy-biscotti-c87e93.netlify.app/dashboard
echo ❌ FAIL = You end up at: localhost:3000 or get an error
echo.
pause
echo.
echo 📊 TESTING RESULT:
set /p result="Did the Google sign-in work correctly? (y/n): "
if /i "%result%"=="y" (
    echo.
    echo 🎉 EXCELLENT! OAuth redirect issue FIXED!
    echo ✅ Users can now sign in with Google successfully
    echo ✅ No more localhost redirect problems
    echo ✅ Production authentication working perfectly
    echo.
    echo 🚀 Your AttributeAI platform is now ready for users!
) else (
    echo.
    echo 🔧 Let's troubleshoot...
    echo.
    echo ❓ What happened when you clicked "Continue with Google"?
    echo 1. Nothing happened (button didn't work)
    echo 2. Went to Google but got an error
    echo 3. Still redirected to localhost
    echo 4. Other issue
    echo.
    set /p issue="Enter number (1-4): "
    echo.
    if "%issue%"=="1" (
        echo 🔍 DIAGNOSIS: Environment variables not updated
        echo 🛠️ SOLUTION: Need to update .env files with correct Google Client ID
    ) else if "%issue%"=="2" (
        echo 🔍 DIAGNOSIS: Redirect URI mismatch in Google Console
        echo 🛠️ SOLUTION: Double-check the redirect URIs are EXACTLY correct
    ) else if "%issue%"=="3" (
        echo 🔍 DIAGNOSIS: Browser cache or old redirect still cached
        echo 🛠️ SOLUTION: Clear browser cache completely and try again
    ) else (
        echo 🔍 DIAGNOSIS: Other configuration issue
        echo 🛠️ SOLUTION: Let's check Supabase auth settings next
    )
)
echo.
echo 📞 Need more help? The issue is now clearly identified!
pause
