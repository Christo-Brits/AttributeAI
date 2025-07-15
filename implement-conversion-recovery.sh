#!/bin/bash
# Quick Implementation Script for Conversion Recovery
# Run this from your AttributeAI project root

echo "🚀 Starting AttributeAI Conversion Recovery Implementation..."

# Step 1: Copy conversion components to the right location
echo "📁 Setting up conversion recovery components..."
cp conversion-recovery-components.js src/components/

# Step 2: Create a simple integration patch
echo "⚡ Creating integration patches..."

# Create a simple UnifiedDashboard patch
cat > src/components/dashboard-conversion-patch.js << 'EOF'
// Add this to your UnifiedDashboard.js

import React from 'react';
import { ConversionBanner } from './conversion-recovery-components';

// Add this component at the top of your dashboard
const ConversionSection = ({ onSignup }) => {
  // Don't show if user is already registered
  if (localStorage.getItem('attributeai_user')) return null;
  
  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">🎉 Account Creation Fixed!</h3>
            <p className="text-green-100 mb-3">Save your research + get unlimited keyword analysis</p>
            <div className="flex space-x-4 text-sm text-green-100">
              <span>✅ Unlimited research</span>
              <span>✅ Save all analyses</span>
              <span>✅ Beat Keywords Everywhere</span>
            </div>
          </div>
          <button
            onClick={onSignup}
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Get Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

// Add this to the top of your UnifiedDashboard return statement:
// <ConversionSection onSignup={handleSignup} />

export { ConversionSection };
EOF

# Create keyword intelligence integration patch
cat > src/components/keyword-conversion-patch.js << 'EOF'
// Add this to your KeywordIntelligenceEngine.js

import React from 'react';
import { ProgressSavePrompt } from './conversion-recovery-components';

// Add this after your keyword analysis results
const KeywordResultsWithConversion = ({ results, onSignup }) => {
  return (
    <div>
      {/* Your existing keyword results */}
      <div className="keyword-results">
        {results && results.map(result => (
          <div key={result.keyword} className="result-card">
            {/* Your existing result display */}
          </div>
        ))}
      </div>
      
      {/* Add conversion prompt after results */}
      {results && results.length > 0 && (
        <ProgressSavePrompt 
          onSignup={onSignup}
          toolName="keyword analysis"
        />
      )}
    </div>
  );
};

export { KeywordResultsWithConversion };
EOF

# Create a simple test for the database fix
cat > test-database-fix.js << 'EOF'
// Test if the database trigger is working
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function testDatabaseFix() {
  console.log('🧪 Testing database trigger...');
  
  const testEmail = `trigger-test-${Date.now()}@example.com`;
  
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        data: {
          first_name: 'Trigger',
          last_name: 'Test'
        }
      }
    });

    if (authError) {
      console.error('❌ Auth creation failed:', authError.message);
      return;
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Check if public user was auto-created
    setTimeout(async () => {
      const { data: publicUser, error: publicError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (publicError) {
        console.error('❌ Public user not found - trigger may not be working');
        console.log('Action needed: Apply the database fix in Supabase SQL Editor');
      } else {
        console.log('✅ Database trigger working! Public user created automatically');
        console.log('User details:', {
          id: publicUser.id,
          email: publicUser.email,
          name: `${publicUser.first_name} ${publicUser.last_name}`,
          tier: publicUser.subscription_tier
        });
      }
    }, 2000);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDatabaseFix();
EOF

echo "✅ Conversion recovery components ready!"
echo ""
echo "📋 Next Steps:"
echo "1. Apply database fix in Supabase (copy supabase-signup-fix.sql to SQL Editor)"
echo "2. Test database fix: node test-database-fix.js"
echo "3. Add conversion components to your main components"
echo "4. See CONVERSION_RECOVERY_GUIDE.md for detailed instructions"
echo ""
echo "🎯 Expected Result: 15-25 new signups from your 63 anonymous users!"
