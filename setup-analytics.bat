@echo off
REM AttributeAI Analytics Setup Script (Windows)
REM This script helps you set up comprehensive user tracking

echo 🚀 Setting up AttributeAI Analytics ^& User Tracking
echo =================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the AttributeAI project root directory
    pause
    exit /b 1
)

echo ✅ Found AttributeAI project

REM Step 1: Backup current index.html
echo 📁 Backing up current index.html...
copy "public\index.html" "public\index.html.backup" >nul
echo ✅ Backup created: public\index.html.backup

REM Step 2: Check if enhanced files exist
if exist "public\index-enhanced.html" (
    echo 📋 Enhanced index.html found. Would you like to use it? ^(y/n^)
    set /p use_enhanced=
    if /i "!use_enhanced!"=="y" (
        copy "public\index-enhanced.html" "public\index.html" >nul
        echo ✅ Enhanced index.html is now active
    )
) else (
    echo ⚠️  Enhanced index.html not found. Please create it first.
)

REM Step 3: Hotjar Setup Instructions
echo.
echo 🎯 HOTJAR SETUP REQUIRED
echo ========================
echo 1. Go to https://www.hotjar.com/pricing
echo 2. Sign up for the Observe plan ^($32/month^) or start free trial
echo 3. Create a new site for: attributeai.app
echo 4. Copy your Hotjar Site ID
echo 5. Replace '5234567' in index.html with your actual Site ID
echo.
echo Your Hotjar tracking code location:
echo File: public\index.html
echo Line: ~13 ^(hjid:5234567^)
echo.

REM Step 4: Test current setup
echo 🧪 Testing current analytics setup...

REM Check if GA4 is configured
findstr /c:"G-BDZZKFKYDV" "public\index.html" >nul
if %errorlevel%==0 (
    echo ✅ Google Analytics 4 configured
) else (
    echo ⚠️  GA4 not found in index.html
)

REM Check if Hotjar placeholder exists
findstr /c:"hjid:" "public\index.html" >nul
if %errorlevel%==0 (
    echo ✅ Hotjar tracking code template ready
    echo ⚠️  Remember to replace placeholder Site ID
) else (
    echo ❌ Hotjar tracking code not found
)

REM Step 5: Check dependencies
echo.
echo 📦 Checking React dependencies...

REM Check if hooks directory exists
if not exist "src\hooks" (
    mkdir "src\hooks"
    echo ✅ Created src\hooks directory
)

echo.
echo 🎉 SETUP CHECKLIST
echo ===================
echo □ 1. Get Hotjar Site ID and update index.html
echo □ 2. Test tracking on localhost:3000
echo □ 3. Integrate tracking hooks in components
echo □ 4. Deploy and verify tracking works
echo.
echo 📊 WHAT YOU'LL GET:
echo - Session recordings showing user behavior
echo - Heatmaps of clicks and scrolls
echo - Funnel analysis showing drop-off points
echo - Real-time user feedback
echo - Enhanced GA4 events
echo.
echo 💰 Expected ROI:
echo - Find 1 conversion blocker = 25%+ signup improvement
echo - $32/month cost vs potential $1000+ monthly revenue gain
echo.
echo 🚀 Ready to launch enhanced tracking!
echo Run 'npm start' to test on localhost
echo.
pause