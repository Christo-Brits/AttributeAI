@echo off
cd /d "C:\Users\chris\Projects\AttributeAI"
echo 🔧 Quick committing JSX fix...
git add .
git commit -m "Fix JSX syntax error in SEOContentStrategist.enhanced.js - removed extra closing tags causing adjacent elements error"
git push origin main
echo ✅ JSX fix committed and pushed to trigger Netlify rebuild
pause