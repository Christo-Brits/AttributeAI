@echo off
echo 🚀 AttributeAI Conversion Recovery - Quick Setup
echo.

echo 📁 Moving conversion components to src/components/...
if exist "conversion-recovery-components.js" (
    copy "conversion-recovery-components.js" "src\components\" >nul
    echo ✅ Conversion components copied
) else (
    echo ❌ conversion-recovery-components.js not found in current directory
)

echo.
echo 🧪 Testing database connection...
if exist "test-database-fix.js" (
    node test-database-fix.js
) else (
    echo ❌ test-database-fix.js not found
)

echo.
echo 📋 NEXT STEPS:
echo 1. Open Supabase Dashboard → SQL Editor
echo 2. Copy contents of supabase-signup-fix.sql and run it
echo 3. Add conversion components to your React components
echo 4. See CONVERSION_RECOVERY_GUIDE.md for details
echo.
echo 🎯 Goal: Convert your 63 anonymous users to registered accounts!
echo.
pause
