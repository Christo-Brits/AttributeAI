# 🔧 AttributeAI Development Tools

This directory contains scripts to help catch syntax errors before deployment.

## 🚀 Pre-Deployment Check Scripts

### Windows: `pre-deploy-check.bat`
```batch
.\pre-deploy-check.bat
```

### Linux/Mac: `pre-deploy-check.sh`
```bash
chmod +x pre-deploy-check.sh
./pre-deploy-check.sh
```

## What These Scripts Do

1. **📦 Dependency Check** - Ensures `node_modules` is installed
2. **🔍 Syntax Check** - Runs ESLint if available
3. **🏗️ Build Test** - Runs `npm run build` to catch compilation errors
4. **📊 Build Stats** - Shows build folder information
5. **📋 Git Status** - Shows uncommitted changes

## 🎯 Benefits

- **Catch syntax errors locally** before they hit Netlify
- **Faster development cycle** - no more deployment failures
- **Build verification** - ensures your code compiles successfully
- **Git status awareness** - shows what needs to be committed

## ⚡ Quick Usage

**Before every deployment:**
```bash
# Run this command first
npm run pre-check

# If it passes, then deploy
git add .
git commit -m "Your message"
git push
```

## 🔧 Integration Options

### Option 1: Add to package.json scripts
```json
{
  "scripts": {
    "pre-check": "node pre-deploy-check.bat",
    "deploy": "npm run pre-check && git push"
  }
}
```

### Option 2: Git Pre-commit Hook
The script can be integrated as a git pre-commit hook to automatically run before commits.

### Option 3: GitHub Actions
Can be adapted for CI/CD pipeline to run on every push.

## 🚨 Error Types Caught

- **JSX Syntax Errors** - Missing closing tags, malformed elements
- **JavaScript Syntax Errors** - Missing semicolons, brackets, etc.
- **Import/Export Errors** - Missing modules, circular dependencies
- **TypeScript Errors** - Type mismatches (if using TypeScript)
- **Build Configuration Issues** - webpack, babel problems

## 📈 Success Indicators

✅ **Build Successful** - Ready for deployment
⚠️ **ESLint Warnings** - Code will build but has style issues
❌ **Build Failed** - Syntax errors must be fixed

## 🎉 Result

No more surprise syntax errors on Netlify! 
Catch issues locally and deploy with confidence.