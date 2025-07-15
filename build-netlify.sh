#!/bin/bash

# Simplified Netlify Build Script - No Overrides
echo "🚀 Starting AttributeAI build process..."

# Clear npm cache to prevent conflicts
echo "🧹 Clearing npm cache..."
npm cache clean --force

# Remove node_modules if it exists
if [ -d "node_modules" ]; then
    echo "🗑️ Removing existing node_modules..."
    rm -rf node_modules
fi

# Remove package-lock.json to force fresh install
if [ -f "package-lock.json" ]; then
    echo "🗑️ Removing package-lock.json for fresh install..."
    rm package-lock.json
fi

# Install all dependencies with legacy peer deps (no pre-install to avoid conflicts)
echo "📦 Installing all dependencies with legacy peer deps..."
npm install --legacy-peer-deps --no-optional --no-audit --no-fund

# Check if install was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Dependency installation failed, trying with force..."
    npm install --force --legacy-peer-deps --no-optional
    
    if [ $? -ne 0 ]; then
        echo "❌ Force installation also failed"
        exit 1
    fi
fi

# Build the project with error handling
echo "🏗️ Building AttributeAI..."
export CI=false
export GENERATE_SOURCEMAP=false
export DISABLE_ESLINT_PLUGIN=true
export SKIP_PREFLIGHT_CHECK=true

npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
    
    # Verify build output
    if [ -d "build" ]; then
        echo "✅ Build directory created"
        echo "📊 Build size: $(du -sh build | cut -f1)"
    else
        echo "❌ Build directory not found"
        exit 1
    fi
else
    echo "❌ Build failed"
    exit 1
fi

echo "🎉 AttributeAI deployment ready!"
