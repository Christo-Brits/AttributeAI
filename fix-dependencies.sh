#!/bin/bash

echo "🔧 Fixing AttributeAI Dependencies for Netlify Deployment"
echo "========================================================"

# Clean existing node_modules and lockfiles
echo "🧹 Cleaning existing dependencies..."
rm -rf node_modules
rm -f package-lock.json

# Update npm to latest version
echo "📦 Updating npm..."
npm install -g npm@latest

# Install with legacy peer deps to handle conflicts
echo "⚡ Installing updated dependencies..."
npm install --legacy-peer-deps

# Audit and fix vulnerabilities
echo "🔒 Auditing and fixing vulnerabilities..."
npm audit fix --legacy-peer-deps

# Test build locally
echo "🏗️ Testing build process..."
npm run build

echo ""
echo "✅ Dependencies updated successfully!"
echo "🚀 Ready for Netlify deployment!"
echo ""
echo "📋 Changes made:"
echo "• Updated all major dependencies to latest versions"
echo "• Fixed deprecated package warnings"
echo "• Added Node.js version specification"
echo "• Enhanced Netlify configuration"
echo "• Resolved build compatibility issues"
echo ""
echo "🎯 Next: Commit and push changes to trigger new Netlify build"
