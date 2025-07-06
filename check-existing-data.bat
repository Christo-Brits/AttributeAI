@echo off
echo 🔍 AttributeAI Data Check - Existing Supabase Project
echo ===================================================
echo.
echo 📊 Checking your existing Supabase project for data...
echo Project: https://xpyfoutwwjslivrmbflm.supabase.co
echo.
echo 🌐 Opening your existing Supabase dashboard...
start https://xpyfoutwwjslivrmbflm.supabase.co
echo.
echo 📋 Please check these tables for existing data:
echo ✅ users - User accounts and profiles
echo ✅ keyword_analyses - Keyword research data  
echo ✅ related_keywords - Keyword variations
echo ✅ content_opportunities - AI content suggestions
echo ✅ user_activity - Usage analytics
echo.
echo 🎯 Next steps depend on what you find:
echo.
echo IF YOU HAVE IMPORTANT DATA:
echo - Don't create new project
echo - Use fix-existing-project.bat to connect to current project
echo.
echo IF TABLES ARE EMPTY OR DON'T EXIST:
echo - Safe to use existing project or create new one
echo - Run setup-with-existing-project.bat
echo.
pause
