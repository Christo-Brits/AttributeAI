@echo off
echo Committing missing files for Netlify build...

cd C:\Users\chris\Projects\AttributeAI

REM Add critical missing files
git add src/components/ErrorBoundary.js
git add src/components/MobileNavigation.js
git add src/components/MobileOptimizations.js
git add src/components/MobileUnifiedDashboard.js
git add src/components/ui/LoadingComponents.js
git add src/hooks/useViewport.js
git add src/components/auth/EnhancedLogin.js
git add src/components/auth/EnhancedSignup.js
git add src/components/auth/EnhancedSupabaseAuthContext.js
git add src/services/SocialAuthService.js
git add src/styles/mobile.css
git add .github/instructions/

REM Also add the modified files that are needed
git add src/App.css
git add src/index.js
git add src/lib/supabase.js
git add src/components/auth/AuthContext.js
git add src/components/auth/LoginPage.js

REM Commit all the missing files
git commit -m "Add missing files for Netlify build - ErrorBoundary and mobile components

- Added ErrorBoundary.js component
- Added all mobile optimization components
- Added enhanced auth components
- Added SocialAuthService
- Updated core files for OAuth support
- This fixes the Netlify build error"

REM Push to GitHub
git push origin main

echo.
echo ✅ Missing files committed and pushed!
echo.
echo Netlify should now rebuild automatically.
echo Check: https://app.netlify.com/sites/leafy-biscotti-c87e93/deploys
echo.
pause
