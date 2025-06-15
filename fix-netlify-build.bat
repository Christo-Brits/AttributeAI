@echo off
echo Fixing Netlify build error - Adding styled-components dependency
cd "C:\Users\chris\Projects\AttributeAI"

echo Current directory:
cd

echo.
echo Adding styled-components to package.json...
echo (Already updated in VS Code)

echo.
echo Checking git status:
git status --porcelain

echo.
echo Adding changes...
git add package.json src/components/crm/DealPipeline.js

echo.
echo Committing fixes...
git commit -m "🔧 Fix Netlify build error - Add styled-components dependency

- Added styled-components to package.json dependencies
- Fixed Building component import in DealPipeline.js
- Resolved build configuration issue for Netlify deployment

Fixes:
- Missing styled-components dependency causing build failure
- Corrected lowercase <building> tag to <Building> component
- Updated package.json to include styled-components ^6.1.11

Ready for successful Netlify deployment!"

echo.
echo Pushing to GitHub to trigger Netlify build...
git push origin main

echo.
echo ✅ Build fixes committed and pushed!
echo 🚀 Netlify will automatically deploy with fixes!

pause