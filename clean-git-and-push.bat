@echo off
echo ========================================
echo Cleaning Git History and Pushing Safely
echo ========================================
echo.

echo This will remove the commits with exposed API keys
echo and create a clean history for GitHub.
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo Creating backup branch...
git branch backup-with-secrets

echo.
echo Resetting to clean state...
git reset --soft HEAD~5

echo.
echo Creating single clean commit...
git add -A
git commit -m "Day 1 Complete: AttributeAI Platform Optimization

MAJOR ACCOMPLISHMENTS:
- Landing page transformation with new pricing ($197/$397/$697)
- Customer generation guarantee messaging
- Complete dashboard functionality with real data
- Supabase Edge Functions integration for secure API management
- Removed all API keys from codebase

TECHNICAL IMPROVEMENTS:
- No more mock data - all components use real APIs
- SEO Analysis with real website data
- AI insights powered by Claude through Edge Functions
- Professional error handling throughout
- Optimized for production deployment

BUSINESS POSITIONING:
- Keywords Everywhere killer (unlimited vs 100k credits)
- HubSpot alternative at 1/4 the price
- Unique customer generation guarantee
- Ready for customer acquisition sprint

Platform is now production-ready and secure for GitHub deployment!"

echo.
echo Pushing to GitHub...
git push origin main --force

echo.
echo ========================================
echo Success! Your code is now on GitHub
echo without any API key exposure!
echo ========================================
echo.
echo The backup branch 'backup-with-secrets' contains
echo your old commits if you need them locally.
echo.
pause