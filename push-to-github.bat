@echo off
echo 🚀 AttributeAI GitHub Push Script
echo.
echo This script will push your AttributeAI project to GitHub
echo Repository: https://github.com/Christo-Brits/AttributeAI
echo.
echo Make sure you've created the repository first!
echo.
pause

echo.
echo 📝 Adding GitHub remote origin...
git remote add origin https://github.com/Christo-Brits/AttributeAI.git

echo.
echo 🔄 Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Complete! Your AttributeAI project is now on GitHub
echo 🔗 Visit: https://github.com/Christo-Brits/AttributeAI
echo.
pause