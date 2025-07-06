@echo off
echo 🌐 AttributeAI Production Domain Fix
echo =================================
echo.
echo ✅ Created .env.production with https://attributeai.app domain
echo ✅ Updated .env.local for localhost:3003 development
echo.

echo 🔧 STEP 1: Update Google OAuth Redirect URIs
echo ============================================
echo Opening Google Cloud Console...
start https://console.cloud.google.com/apis/credentials
echo.
echo 📋 In Google Cloud Console:
echo 1. Click your OAuth client: 669005398506-s4s400hvq0c5oh5shs407tdtl9l7gnj7.apps.googleusercontent.com
echo 2. Add this NEW redirect URI:
echo    https://attributeai.app/auth/callback
echo.
echo 📄 Your complete redirect URIs should be:
echo    ✅ https://xpyfoutwwjslivrmbflm.supabase.co/auth/v1/callback
echo    ✅ https://attributeai.app/auth/callback
echo    ✅ http://localhost:3003/auth/callback
echo    ✅ http://localhost:3000/auth/callback
echo    ✅ http://localhost:3001/auth/callback
echo    ✅ http://localhost:3002/auth/callback
echo.
echo 3. Click "Save"
echo.

echo 🚀 STEP 2: Commit Changes
echo =========================
echo Committing production domain configuration...
echo.

rem Navigate to project directory
cd /d "C:\Users\chris\Projects\AttributeAI"

rem Add all changes
git add .

rem Commit with comprehensive message
git commit -m "🌐 Fix production domain redirects for attributeai.app

✨ Production Configuration Added:
- Created .env.production with correct attributeai.app URLs
- Fixed REACT_APP_REDIRECT_URL to use production domain
- Updated local .env.local for localhost:3003 development
- Separated development and production configurations

🔧 Google OAuth Updates Required:
- Add https://attributeai.app/auth/callback to Google OAuth redirect URIs
- Ensures users stay on production domain after Google login
- Eliminates localhost redirect issues on live site

🎯 Expected Result:
- Google OAuth on attributeai.app redirects to attributeai.app/dashboard
- No more localhost redirects on production
- Clean separation of dev/prod environments
- Professional user experience maintained"

echo.
echo ✅ Changes committed successfully!
echo.

echo 🌐 STEP 3: Deploy to Production
echo ==============================
echo Pushing to GitHub (triggers auto-deployment)...
git push origin main

echo.
echo 🎯 EXPECTED RESULTS:
echo ===================
echo ✅ Production site: https://attributeai.app
echo ✅ Google OAuth redirects to: https://attributeai.app/dashboard
echo ✅ No more localhost redirect issues
echo ✅ Professional user experience maintained
echo.

echo 🧪 TESTING STEPS:
echo =================
echo 1. Wait for deployment to complete (2-5 minutes)
echo 2. Go to: https://attributeai.app
echo 3. Click "Continue with Google"
echo 4. Complete Google login
echo 5. Should redirect to: https://attributeai.app/dashboard
echo.

echo 📋 Don't forget to add the redirect URI in Google Console!
echo.
pause
