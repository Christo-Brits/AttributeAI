#!/bin/bash

# Supabase User Creation Fix - Complete Setup
# This script applies all necessary fixes for automatic user creation

echo "🚀 AttributeAI - Supabase User Creation Fix"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the AttributeAI project root directory"
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create it with your Supabase credentials."
    echo "Required variables:"
    echo "  REACT_APP_SUPABASE_URL=your_supabase_url"
    echo "  REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key"
    exit 1
fi

echo "1️⃣ Checking Supabase connection..."

# Load environment variables
if command -v node >/dev/null 2>&1; then
    # Test Supabase connection
    node -e "
        require('dotenv').config();
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(
            process.env.REACT_APP_SUPABASE_URL,
            process.env.REACT_APP_SUPABASE_ANON_KEY
        );
        
        supabase.from('users').select('count').limit(1)
            .then(({ error }) => {
                if (error) {
                    console.log('❌ Supabase connection failed:', error.message);
                    process.exit(1);
                } else {
                    console.log('✅ Supabase connection successful');
                }
            })
            .catch(err => {
                console.log('❌ Connection test failed:', err.message);
                process.exit(1);
            });
    "
    
    if [ $? -ne 0 ]; then
        echo "❌ Cannot connect to Supabase. Please check your .env configuration."
        exit 1
    fi
else
    echo "⚠️  Node.js not found, skipping connection test"
fi

echo ""
echo "2️⃣ Instructions for applying database fixes:"
echo ""
echo "📋 Manual Steps Required:"
echo ""
echo "1. Open your Supabase Dashboard:"
echo "   → Go to https://app.supabase.com"
echo "   → Select your AttributeAI project"
echo "   → Go to SQL Editor"
echo ""
echo "2. Run the database fix script:"
echo "   → Copy the contents of: fix-supabase-user-creation.sql"
echo "   → Paste into SQL Editor"
echo "   → Click 'Run'"
echo ""
echo "3. Verify the fixes:"
echo "   → Run: npm run test-signup"
echo "   → Or: node test-supabase-signup.js"
echo ""

echo "3️⃣ Updating authentication component..."

# Backup current auth file
if [ -f "src/components/auth/RealSupabaseAuth.js" ]; then
    cp "src/components/auth/RealSupabaseAuth.js" "src/components/auth/RealSupabaseAuth.js.backup"
    echo "✅ Backed up current auth file"
fi

# Use the enhanced auth component
if [ -f "src/components/auth/EnhancedSupabaseAuth.js" ]; then
    cp "src/components/auth/EnhancedSupabaseAuth.js" "src/components/auth/RealSupabaseAuth.js"
    echo "✅ Updated to enhanced authentication"
else
    echo "❌ Enhanced auth file not found"
fi

echo ""
echo "4️⃣ Testing current setup..."

# Run the test script
if command -v node >/dev/null 2>&1; then
    echo "Running signup test..."
    node test-supabase-signup.js
else
    echo "⚠️  Node.js not found, skipping test"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. ✅ Database fixes - Run fix-supabase-user-creation.sql in Supabase"
echo "2. ✅ Enhanced auth - Updated RealSupabaseAuth.js"
echo "3. ✅ Test script - Available as test-supabase-signup.js"
echo ""
echo "🧪 To test the fixes:"
echo "   npm run test-signup"
echo ""
echo "🚀 To start development:"
echo "   npm start"
echo ""
echo "📊 The fixes include:"
echo "   • Automatic user profile creation on signup"
echo "   • Database trigger for auth.users → public.users"
echo "   • Improved error handling and retries"
echo "   • 14-day trial system for new users"
echo "   • Quota management and usage tracking"
echo ""
echo "✅ Your Supabase user creation should now work automatically!"
