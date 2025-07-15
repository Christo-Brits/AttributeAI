@echo off
echo Committing OAuth callback fix...

cd C:\Users\chris\Projects\AttributeAI

REM Stage the changes
git add src/App.js
git add src/components/auth/AuthCallback.js
git add src/components/auth/AuthCallbackHandler.js

REM Commit the changes
git commit -m "Fix Google OAuth sign-in by adding auth callback route handling

- Added AuthCallback import to App.js
- Added OAuth callback route check in AppRouter
- OAuth providers already configured in Supabase
- This fixes the redirect issue after Google sign-in"

REM Push to GitHub
git push origin main

echo.
echo ✅ OAuth callback fix committed and pushed!
echo.
echo Next steps:
echo 1. Restart your development server (npm start)
echo 2. Test Google sign-in again
echo 3. Check browser console for any remaining errors
echo.
pause
