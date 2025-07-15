@echo off
echo ========================================
echo Deploying Edge Functions to Supabase
echo Project: xpyfoutwwjslivrmbflm
echo ========================================
echo.

echo Installing Supabase CLI (if not already installed)...
call npm list -g supabase >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Supabase CLI...
    npm install -g supabase
) else (
    echo Supabase CLI already installed.
)

echo.
echo Linking to your Supabase project...
call supabase link --project-ref xpyfoutwwjslivrmbflm

echo.
echo Setting up API key secrets...
echo You'll need to enter your API keys when prompted:
echo.

echo Setting Anthropic API Key...
call supabase secrets set ANTHROPIC_API_KEY

echo.
echo Setting OpenAI API Key (optional)...
call supabase secrets set OPENAI_API_KEY

echo.
echo Setting Google Gemini API Key (optional)...
call supabase secrets set GOOGLE_GEMINI_API_KEY

echo.
echo Deploying Edge Functions...
echo.

echo Deploying claude-chat function...
call supabase functions deploy claude-chat

echo.
echo Deploying analyze-website function...
call supabase functions deploy analyze-website

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your Edge Functions are now live at:
echo - https://xpyfoutwwjslivrmbflm.supabase.co/functions/v1/claude-chat
echo - https://xpyfoutwwjslivrmbflm.supabase.co/functions/v1/analyze-website
echo.
echo Next steps:
echo 1. Update your components to use EdgeFunctionsService
echo 2. Test the integration
echo 3. Remove all API keys from your codebase
echo 4. Push to GitHub safely!
echo.
pause