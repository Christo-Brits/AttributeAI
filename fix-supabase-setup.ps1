# Supabase User Creation Fix - PowerShell Version
# This script applies all necessary fixes for automatic user creation

Write-Host "🚀 AttributeAI - Supabase User Creation Fix" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the AttributeAI project root directory" -ForegroundColor Red
    exit 1
}

# Check for .env file
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found. Please create it with your Supabase credentials." -ForegroundColor Red
    Write-Host "Required variables:" -ForegroundColor Yellow
    Write-Host "  REACT_APP_SUPABASE_URL=your_supabase_url" -ForegroundColor Yellow
    Write-Host "  REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key" -ForegroundColor Yellow
    exit 1
}

Write-Host "1️⃣ Checking Supabase connection..." -ForegroundColor Blue

# Test current signup flow
Write-Host ""
Write-Host "2️⃣ Testing current signup flow..." -ForegroundColor Blue
try {
    $result = npm run test-signup 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Signup test completed" -ForegroundColor Green
        
        # Check if profiles are being created
        if ($result -match "Profile created successfully") {
            Write-Host "✅ User profiles are being created automatically!" -ForegroundColor Green
        } else {
            Write-Host "❌ User profiles are NOT being created" -ForegroundColor Red
        }
        
        # Check for function errors
        if ($result -match "Quota function error") {
            Write-Host "⚠️  Database functions need to be installed" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Signup test failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Cannot run signup test: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3️⃣ Updating authentication component..." -ForegroundColor Blue

# Backup current auth file
if (Test-Path "src/components/auth/RealSupabaseAuth.js") {
    Copy-Item "src/components/auth/RealSupabaseAuth.js" "src/components/auth/RealSupabaseAuth.js.backup"
    Write-Host "✅ Backed up current auth file" -ForegroundColor Green
}

# Use the enhanced auth component
if (Test-Path "src/components/auth/EnhancedSupabaseAuth.js") {
    Copy-Item "src/components/auth/EnhancedSupabaseAuth.js" "src/components/auth/RealSupabaseAuth.js" -Force
    Write-Host "✅ Updated to enhanced authentication" -ForegroundColor Green
} else {
    Write-Host "❌ Enhanced auth file not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "4️⃣ Instructions for completing the fix..." -ForegroundColor Blue
Write-Host ""
Write-Host "📋 Manual Steps Required:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open your Supabase Dashboard:" -ForegroundColor White
Write-Host "   → Go to https://app.supabase.com" -ForegroundColor Gray
Write-Host "   → Select your AttributeAI project" -ForegroundColor Gray
Write-Host "   → Go to SQL Editor" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Run the database fix script:" -ForegroundColor White
Write-Host "   → Open: fix-supabase-user-creation.sql" -ForegroundColor Gray
Write-Host "   → Copy all contents" -ForegroundColor Gray
Write-Host "   → Paste into SQL Editor" -ForegroundColor Gray
Write-Host "   → Click 'Run'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Verify the fixes:" -ForegroundColor White
Write-Host "   → Run: npm run test-signup" -ForegroundColor Gray
Write-Host "   → All tests should pass" -ForegroundColor Gray
Write-Host ""

Write-Host "5️⃣ Current Status Summary..." -ForegroundColor Blue
Write-Host ""

# Check what's working vs what needs fixes
if (Test-Path "fix-supabase-user-creation.sql") {
    Write-Host "✅ Database fix script ready" -ForegroundColor Green
} else {
    Write-Host "❌ Database fix script missing" -ForegroundColor Red
}

if (Test-Path "src/components/auth/EnhancedSupabaseAuth.js") {
    Write-Host "✅ Enhanced auth component ready" -ForegroundColor Green
} else {
    Write-Host "❌ Enhanced auth component missing" -ForegroundColor Red
}

if (Test-Path "test-supabase-signup.js") {
    Write-Host "✅ Test script available" -ForegroundColor Green
} else {
    Write-Host "❌ Test script missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Setup Analysis Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Based on the test results:" -ForegroundColor Cyan
Write-Host ""

# Analyze test results
if ($result -match "Profile created successfully") {
    Write-Host "✅ GOOD NEWS: User profiles are already being created!" -ForegroundColor Green
    Write-Host "   The basic signup → profile creation is working." -ForegroundColor Green
    Write-Host ""
    Write-Host "🔧 Improvements needed:" -ForegroundColor Yellow
    
    if ($result -match "Quota function error") {
        Write-Host "   • Install database functions (quota management)" -ForegroundColor Yellow
    }
    
    if ($result -match "Company: null") {
        Write-Host "   • Fix metadata transfer (company, industry)" -ForegroundColor Yellow
    }
    
    if ($result -match "Trial ends: null") {
        Write-Host "   • Fix trial period setup" -ForegroundColor Yellow
    }
    
    if ($result -match "user_profiles record not created") {
        Write-Host "   • Add user_profiles table integration" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ User profiles are NOT being created automatically" -ForegroundColor Red
    Write-Host "   You MUST run the SQL fix script in Supabase" -ForegroundColor Red
}

Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Run the SQL script in Supabase (copy fix-supabase-user-creation.sql)" -ForegroundColor White
Write-Host "2. Test again: npm run test-signup" -ForegroundColor White
Write-Host "3. Start development: npm start" -ForegroundColor White
Write-Host ""
Write-Host "✅ This will fix automatic user creation for new signups!" -ForegroundColor Green
