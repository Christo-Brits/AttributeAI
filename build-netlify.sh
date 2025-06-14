#!/bin/bash

# Netlify Build Script with Enhanced Error Handling
echo "🚀 Starting AttributeAI build process..."

# Clear npm cache to prevent 'matches' error
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

# Install dependencies with legacy peer deps
echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps --no-optional --no-audit --no-fund

# Check if install was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Dependency installation failed"
    exit 1
fi

# Build the project
echo "🏗️ Building AttributeAI..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
else
    echo "❌ Build failed"
    exit 1
fi

echo "🎉 AttributeAI deployment ready!"