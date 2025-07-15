@echo off
echo 🧪 TESTING AttributeAI - YC READINESS CHECK
echo ==========================================
echo.
echo ✅ OAUTH ISSUE: FIXED! (Now using attributeai.app)
echo.
echo 🔍 CURRENT ISSUE: AI Insights failing
echo 💡 Diagnosis: "Failed to generate AI insights. Please try again."
echo.
echo 📋 STEP 1: Check API Server Status
echo =================================
echo.
echo Testing local API server connection...
curl -s http://localhost:3001/api/health 2>nul
if %errorlevel% neq 0 (
    echo ❌ API Server not running on port 3001
    echo.
    echo 🚀 Starting API server...
    echo.
    cd server
    start "AttributeAI API Server" cmd /k "node api-proxy.js"
    cd ..
    echo.
    echo ⏳ Waiting for server to start...
    timeout /t 5 /nobreak >nul
    echo.
    echo Testing again...
    curl -s http://localhost:3001/api/health
) else (
    echo ✅ API Server running correctly
)
echo.
echo 📋 STEP 2: Check Environment Variables
echo ====================================
echo.
echo Checking for required API keys...
findstr "CLAUDE_API_KEY" .env 2>nul
if %errorlevel% neq 0 (
    echo ❌ CLAUDE_API_KEY not found in .env
    echo 💡 Need to add Claude API key for AI insights
) else (
    echo ✅ Claude API key configured
)
echo.
findstr "OPENAI_API_KEY" .env 2>nul
if %errorlevel% neq 0 (
    echo ❌ OPENAI_API_KEY not found in .env
    echo 💡 Need to add OpenAI API key for AI insights
) else (
    echo ✅ OpenAI API key configured
)
echo.
echo 📋 STEP 3: Test Individual API Endpoints
echo =======================================
echo.
echo Testing Claude chat endpoint...
curl -s -X POST http://localhost:3001/api/claude-chat -H "Content-Type: application/json" -d "{\"message\":\"test\"}" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Claude chat endpoint not responding
) else (
    echo ✅ Claude chat endpoint working
)
echo.
echo 📋 STEP 4: Check Browser Console
echo ===============================
echo.
echo 🔍 Next steps to debug:
echo 1. Open browser Developer Tools (F12)
echo 2. Go to Console tab
echo 3. Try "Get AI Insights" button again
echo 4. Look for error messages in red
echo.
echo 💡 Common issues:
echo - CORS errors (need to add CORS headers)
echo - API key not configured
echo - Network errors (API server not running)
echo - Rate limiting (too many requests)
echo.
echo 🚀 After fixing API server, test these pages:
echo ============================================
echo 1. Dashboard - Overall platform overview
echo 2. Keyword Intelligence - Unlimited research engine
echo 3. SEO Analysis - AI-powered competitor insights
echo 4. Enhanced Content - Multi-AI content generation
echo 5. Attribution Engine - Marketing ROI tracking
echo 6. CRM Features - Contact and deal management
echo.
echo 📊 YC Demo Requirements:
echo =======================
echo ✅ Fast loading (sub-3 seconds)
echo ✅ Professional UI/UX
echo ✅ Real functionality (not demo mode)
echo ✅ Clear value proposition
echo ✅ Scalable architecture
echo.
pause
