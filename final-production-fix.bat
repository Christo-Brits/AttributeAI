@echo off
echo 🌐 Final Production Fix - Remove localhost:3000 Completely
echo ========================================================
echo.

echo ✅ Updated .env.production with Netlify domain
echo ✅ Removing all localhost:3000 references
echo.

echo 🔧 STEP 1: Update Google OAuth Redirect URIs
echo ============================================
echo Opening Google Cloud Console...
start https://console.cloud.google.com/apis/credentials
echo.
echo 📋 In Google Cloud Console:
echo 1. Click your OAuth client: 669005398506-s4s400hvq0c5oh5shs407tdtl9l7gnj7.apps.googleusercontent.com
echo 2. REPLACE all redirect URIs with these ONLY:
echo.
echo    ✅ https://xpyfoutwwjslivrmbflm.supabase.co/auth/v1/callback
echo    ✅ https://leafy-biscotti-c87e93.netlify.app/auth/callback
echo    ✅ http://localhost:3003/auth/callback (for local development only)
echo.
echo 3. REMOVE these old URLs:
echo    ❌ http://localhost:3000/auth/callback
echo    ❌ http://localhost:3001/auth/callback  
echo    ❌ http://localhost:3002/auth/callback
echo.
echo 4. Click "Save"
echo.

echo 🚀 STEP 2: Deploy Updated Configuration
echo =======================================
echo.

rem Navigate to project directory
cd /d "C:\Users\chris\Projects\AttributeAI"

rem Add the production environment fix
git add .env.production

rem Commit the fix
git commit -m "🌐 Final production fix - Remove localhost:3000 completely

✨ Production Configuration Updated:
- Updated .env.production to use Netlify domain exclusively
- Removed all localhost:3000 references
- OAuth now redirects to https://leafy-biscotti-c87e93.netlify.app
- Clean production environment setup

🔧 Google OAuth Configuration:
- Primary: https://leafy-biscotti-c87e93.netlify.app/auth/callback
- Supabase: https://xpyfoutwwjslivrmbflm.supabase.co/auth/v1/callback
- Development: http://localhost:3003/auth/callback (local only)

🎯 Expected Result:
- Google OAuth redirects to production domain
- No more localhost:3000 redirects
- Professional user experience
- Complete production setup"

echo ✅ Committed production configuration
echo.

echo 🌐 Pushing to GitHub (triggers final deployment)
git push origin main

echo.
echo ⏰ FINAL DEPLOYMENT STATUS:
echo ===========================
echo 🔄 Deployment will take 2-3 minutes
echo 🌐 Site: https://leafy-biscotti-c87e93.netlify.app
echo ✅ Production environment with correct redirects
echo.

echo 🎯 EXPECTED FINAL RESULTS:
echo ===========================
echo ✅ Google OAuth redirects to: https://leafy-biscotti-c87e93.netlify.app/dashboard
echo ✅ No more localhost:3000 redirects
echo ✅ Professional production experience
echo ✅ Complete OAuth flow working end-to-end
echo.

echo 🧪 FINAL TESTING STEPS:
echo =======================
echo 1. Update Google OAuth redirect URIs (remove localhost:3000)
echo 2. Wait 2-3 minutes for deployment
echo 3. Go to: https://leafy-biscotti-c87e93.netlify.app
echo 4. Click "Continue with Google"
echo 5. Should redirect to: https://leafy-biscotti-c87e93.netlify.app/dashboard
echo.

echo 🎉 This should complete your production setup!
echo.
pause
