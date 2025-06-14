#!/bin/bash

# Netlify Build Script with Enhanced Error Handling and Dependency Resolution
echo "🚀 Starting AttributeAI build process..."

# Set Node.js version and npm configuration
export NODE_VERSION="18.20.3"
export NPM_VERSION="9.6.7"

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

# Install core dependencies first to resolve conflicts
echo "📦 Installing core dependencies..."
npm install ajv@^8.12.0 ajv-keywords@^5.1.0 react-bootstrap@^2.10.4 bootstrap@^5.3.3 --legacy-peer-deps --no-optional

# Install all dependencies with legacy peer deps
echo "📦 Installing all dependencies with legacy peer deps..."
npm install --legacy-peer-deps --no-optional --no-audit --no-fund

# Check if install was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Dependency installation failed"
    
    # Fallback: try with different npm settings
    echo "🔄 Trying fallback installation..."
    npm install --force --legacy-peer-deps
    
    if [ $? -ne 0 ]; then
        echo "❌ Fallback installation also failed"
        exit 1
    fi
fi

# Verify critical dependencies and install if missing
echo "🔍 Verifying critical dependencies..."
REQUIRED_DEPS=("ajv" "react-scripts" "react" "react-dom" "react-bootstrap" "bootstrap")

for dep in "${REQUIRED_DEPS[@]}"; do
    if [ ! -d "node_modules/$dep" ]; then
        echo "⚠️ $dep not found, installing manually..."
        case $dep in
            "ajv")
                npm install ajv@^8.12.0 --force
                ;;
            "react-bootstrap")
                npm install react-bootstrap@^2.10.4 --force
                ;;
            "bootstrap")
                npm install bootstrap@^5.3.3 --force
                ;;
            "react-scripts")
                npm install react-scripts@^5.0.1 --force
                ;;
            *)
                npm install $dep --force
                ;;
        esac
    fi
done

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
    
    # Try alternative build approach
    echo "🔄 Attempting build with CI=true..."
    export CI=true
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Alternative build also failed"
        exit 1
    fi
fi

echo "🎉 AttributeAI deployment ready!"
