@echo off
cd /d "C:\Users\chris\Projects\AttributeAI"

git add .
git commit -m "Fix Netlify build: react-scripts dependency resolution"
git push origin main

echo Build configuration fixes pushed to GitHub!
pause