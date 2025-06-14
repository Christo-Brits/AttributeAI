#!/bin/bash

echo "🔍 Testing Frontend Build for Netlify Compatibility"
echo "=================================================="

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/
rm -rf node_modules/
rm -f package-lock.json

# Install only frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install --legacy-peer-deps --only=production

# Test the build process
echo "🏗️ Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "🚀 Frontend is ready for Netlify deployment"
    echo ""
    echo "📁 Build output:"
    ls -la build/
    echo ""
    echo "📊 Build size:"
    du -sh build/
else
    echo ""
    echo "❌ Build failed!"
    echo "🔧 Please check the error messages above"
fi

echo ""
echo "🎯 Next: Commit and push to trigger Netlify build"
