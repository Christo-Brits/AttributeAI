#!/bin/bash

echo "🔍 AttributeAI Build Troubleshooting Script"
echo "==========================================="

# Check Node and npm versions
echo "📦 Environment Check:"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Check if all required files exist
echo "📁 File Structure Check:"
files_to_check=(
    "package.json"
    "src/index.js"
    "src/App.js"
    "public/index.html"
    "src/components/EnhancedContentGenerator.js"
    "src/components/KeywordIntelligenceEngine.js"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "🧹 Cleaning previous builds..."
rm -rf node_modules package-lock.json build

echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --no-optional

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Dependency installation failed"
    exit 1
fi

echo ""
echo "🏗️ Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Build successful!"
    echo "📊 Build size:"
    if [ -d "build" ]; then
        du -sh build/
        echo ""
        echo "📁 Build contents:"
        ls -la build/
    fi
    echo ""
    echo "✅ Ready for Netlify deployment!"
else
    echo ""
    echo "❌ Build failed!"
    echo "💡 Check the error messages above for details"
    echo ""
    echo "🔧 Common fixes:"
    echo "1. Ensure all dependencies are listed in package.json"
    echo "2. Check for typos in import statements"
    echo "3. Verify all referenced files exist"
    echo "4. Try: npm install --legacy-peer-deps --force"
fi

echo ""
echo "🎯 For Netlify deployment:"
echo "1. Commit all changes: git add . && git commit -m 'Fix dependencies'"
echo "2. Push to GitHub: git push origin main"
echo "3. Netlify will auto-deploy with the updated configuration"
