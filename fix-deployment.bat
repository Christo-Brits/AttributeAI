@echo off
echo 🔧 AttributeAI Production Fix - Deploy Real App
echo ===============================================
echo.

echo ✅ Fixed index.js to use real App instead of test app
echo ✅ Now deploying the actual AttributeAI application
echo.

echo 🚀 Committing Fix and Deploying
echo ===============================

rem Navigate to project directory
cd /d "C:\Users\chris\Projects\AttributeAI"

rem Add the fix
git add src/index.js

rem Commit the fix
git commit -m "🔧 Fix deployment - Use real App instead of test app

- Changed index.js to import App instead of AppTestSocial
- Now deploying the actual AttributeAI application
- Fixes test page being shown on production
- Restores proper landing page and authentication flow"

echo ✅ Committed fix to use real app
echo.

echo 🌐 Pushing to GitHub (triggers deployment)
git push origin main

echo.
echo ⏰ DEPLOYMENT STATUS:
echo ====================
echo 🔄 Deployment will take 2-3 minutes
echo 🌐 Site: https://leafy-biscotti-c87e93.netlify.app (current)
echo 🎯 Target: https://attributeai.app (custom domain)
echo.

echo 📋 EXPECTED RESULTS AFTER DEPLOYMENT:
echo ====================================
echo ✅ Real AttributeAI app loads (not test page)
echo ✅ Proper landing page and navigation
echo ✅ Google OAuth buttons work
echo ✅ Professional user interface
echo.

echo 🔧 REMAINING ISSUES TO FIX:
echo ===========================
echo 1. Custom domain: attributeai.app may need DNS/domain setup
echo 2. Redirect issue: Still going to localhost:3000
echo    - Need to add https://attributeai.app/auth/callback to Google OAuth
echo    - Or use current Netlify domain for testing
echo.

echo 🧪 TESTING STEPS:
echo =================
echo 1. Wait 2-3 minutes for deployment
echo 2. Go to: https://leafy-biscotti-c87e93.netlify.app
echo 3. Should see real AttributeAI app (not test page)
echo 4. Test Google OAuth flow
echo.

echo 📋 Next step: Fix OAuth redirect URLs for production domain
echo.
pause
