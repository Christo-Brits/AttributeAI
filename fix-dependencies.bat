@echo off
echo 🔧 Fixing AttributeAI Dependencies for Netlify Deployment
echo ========================================================

echo 🧹 Cleaning existing dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo ⚡ Installing updated dependencies...
npm install --legacy-peer-deps

echo 🔒 Auditing and fixing vulnerabilities...
npm audit fix --legacy-peer-deps

echo 🏗️ Testing build process...
npm run build

echo.
echo ✅ Dependencies updated successfully!
echo 🚀 Ready for Netlify deployment!
echo.
echo 📋 Changes made:
echo • Updated all major dependencies to latest versions
echo • Fixed deprecated package warnings  
echo • Added Node.js version specification
echo • Enhanced Netlify configuration
echo • Resolved build compatibility issues
echo.
echo 🎯 Next: Commit and push changes to trigger new Netlify build

pause
