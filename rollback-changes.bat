@echo off
echo 🛡️ AttributeAI - Rollback Changes (Emergency)
echo ============================================
echo.
echo ⚠️  This will restore your project to the last committed state
echo.

echo 📊 Current Git Status:
git status --short

echo.
echo 🔍 This will:
echo ✅ Restore all modified files to last commit
echo ✅ Keep your original .env.local.backup
echo ✅ Remove testing scripts (they'll be regenerated)
echo ❌ LOSE any uncommitted changes
echo.

echo Are you sure you want to rollback? (y/n)
set /p confirm=

if /i "%confirm%"=="y" (
    echo.
    echo 🔄 Rolling back changes...
    
    rem Restore modified files
    git checkout -- .
    
    rem Remove untracked files (testing scripts)
    git clean -fd
    
    rem Restore backup if it exists
    if exist ".env.local.backup" (
        copy ".env.local.backup" ".env.local"
        echo ✅ Restored .env.local from backup
    )
    
    echo.
    echo ✅ ROLLBACK COMPLETE
    echo.
    echo 📊 Project restored to last committed state
    echo.
    echo 🎯 To try again:
    echo 1. Re-run the Supabase setup process
    echo 2. Test locally before committing
    echo 3. Use commit-working-changes.bat when ready
    echo.
    
) else (
    echo.
    echo ❌ Rollback cancelled
    echo.
    echo 🔧 If you're having issues, try:
    echo 1. test-local-before-commit.bat (comprehensive testing)
    echo 2. Fix any failing tests
    echo 3. commit-working-changes.bat (when tests pass)
)

echo.
pause
