#!/bin/bash

# 🔧 AttributeAI Build Verification Script
# This script checks for syntax errors before deployment

echo "🚀 AttributeAI Pre-Deployment Check"
echo "=================================="

# Navigate to project directory
cd "$(dirname "$0")"

echo "📂 Current directory: $(pwd)"
echo ""

# 1. Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed"
        exit 1
    fi
fi

echo "🔍 Running syntax and build checks..."
echo ""

# 2. Check package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

# 3. Run ESLint check (if available)
echo "🔎 Running ESLint check..."
if npm list eslint > /dev/null 2>&1; then
    npx eslint src/ --ext .js,.jsx,.ts,.tsx --max-warnings 50
    if [ $? -ne 0 ]; then
        echo "⚠️  ESLint found issues (but continuing...)"
    else
        echo "✅ ESLint check passed"
    fi
else
    echo "⚠️  ESLint not available, skipping..."
fi

echo ""

# 4. Run TypeScript check (if available)
if [ -f "tsconfig.json" ]; then
    echo "🔎 Running TypeScript check..."
    npx tsc --noEmit
    if [ $? -ne 0 ]; then
        echo "❌ TypeScript check failed"
        exit 1
    else
        echo "✅ TypeScript check passed"
    fi
fi

# 5. Run the actual build
echo "🏗️  Running build test..."
npm run build
BUILD_EXIT_CODE=$?

echo ""

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "✅ BUILD SUCCESSFUL! ✅"
    echo ""
    echo "📊 Build Statistics:"
    echo "==================="
    
    if [ -d "build" ]; then
        echo "📁 Build folder size: $(du -sh build | cut -f1)"
        echo "📄 JavaScript files: $(find build -name "*.js" | wc -l)"
        echo "🎨 CSS files: $(find build -name "*.css" | wc -l)"
        echo ""
    fi
    
    echo "🚀 Ready for deployment!"
    echo "💡 You can now safely deploy to Netlify"
    echo ""
    
    # Show git status
    echo "📋 Git Status:"
    git status --porcelain
    
    if [ -n "$(git status --porcelain)" ]; then
        echo ""
        echo "⚠️  Note: You have uncommitted changes"
        echo "🔄 Run: git add . && git commit -m 'message' && git push"
    else
        echo "✅ All changes committed and ready"
    fi
    
    exit 0
else
    echo "❌ BUILD FAILED! ❌"
    echo ""
    echo "🚨 Syntax errors detected!"
    echo "🔧 Fix the errors above before deploying"
    echo ""
    exit 1
fi