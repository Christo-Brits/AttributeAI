@echo off
echo Fixing Netlify react-scripts dependency issue
cd "C:\Users\chris\Projects\AttributeAI"

echo Current directory:
cd

echo.
echo Removing package-lock.json to force fresh install...
del package-lock.json

echo.
echo Installing dependencies with clean install...
npm install

echo.
echo Checking git status:
git status --porcelain

echo.
echo Adding all dependency fixes...
git add package.json netlify.toml .npmrc package-lock.json

echo.
echo Committing dependency fixes...
git commit -m "Fix Netlify react-scripts dependency issue

Fixes:
- Pinned react-scripts to exact version 5.0.1
- Updated Netlify build command to use npm ci for clean installs
- Added .npmrc for consistent package installation
- Regenerated package-lock.json for dependency resolution

Build configuration:
- Changed from 'npm install' to 'npm ci' for deterministic builds
- Added npm configuration flags for consistent behavior
- Ensured react-scripts is properly available for build command

This resolves the 'Command react-scripts build not found' error
by ensuring all dependencies are properly installed before build."

echo.
echo Pushing to GitHub to trigger new Netlify build...
git push origin main

echo.
echo Dependency fixes committed and pushed!
echo Netlify will automatically rebuild with fixed dependencies!

pause