// Test script for founder account functionality
// Run this in browser console to test

console.log('🧪 Testing Founder Account Setup...');

// Test 1: Check founder email detection
const testEmails = [
  'infinitebuildsolutions2024@gmail.com', // Should be founder
  'test@example.com', // Should not be founder
  'chris@attributeai.app', // Should be founder
  'random@user.com' // Should not be founder
];

console.group('📧 Email Detection Test');
testEmails.forEach(email => {
  // Simulate the founder check (since we can't import in browser console)
  const founderEmails = [
    'infinitebuildsolutions2024@gmail.com',
    'chris@attributeai.app',
    'christo@attributeai.app'
  ];
  const isFounder = founderEmails.includes(email.toLowerCase());
  console.log(`${email}: ${isFounder ? '👑 FOUNDER' : '👤 Regular User'}`);
});
console.groupEnd();

// Test 2: Check localStorage profile
console.group('💾 Profile Storage Test');
const profile = JSON.parse(localStorage.getItem('attributeai_user_profile') || '{}');
console.log('Current Profile:', profile);

if (profile.subscription_tier === 'founder' || profile.is_founder) {
  console.log('✅ Founder account detected in localStorage');
  console.log('🚀 Usage Limits:', profile.usage_limits);
} else {
  console.log('👤 Regular user account');
}
console.groupEnd();

// Test 3: Simulate founder account creation
console.group('🎭 Founder Account Simulation');
const mockFounderProfile = {
  id: 'test-founder-123',
  email: 'infinitebuildsolutions2024@gmail.com',
  full_name: 'Chris (Founder)',
  subscription_tier: 'founder',
  is_founder: true,
  usage_limits: {
    keywords_per_month: 999999,
    content_pieces_per_month: 999999,
    attribution_queries_per_month: 999999,
    ai_requests_per_day: 999999,
    export_downloads_per_month: 999999,
    api_calls_per_hour: 999999
  },
  features: [
    'unlimited_everything',
    'admin_panel_access',
    'usage_analytics_view',
    'export_all_data',
    'priority_support',
    'beta_features',
    'white_label_access',
    'api_access',
    'team_management'
  ],
  monthly_usage: {
    keywords_analyzed: 0,
    content_generated: 0,
    attribution_queries: 0
  }
};

localStorage.setItem('attributeai_user_profile', JSON.stringify(mockFounderProfile));
console.log('✅ Mock founder profile created in localStorage');
console.log('🎉 You now have unlimited access!');
console.groupEnd();

// Test 4: Usage limit check simulation
console.group('🔍 Usage Limit Check Test');
const checkUsageLimit = (type) => {
  const profile = JSON.parse(localStorage.getItem('attributeai_user_profile') || '{}');
  
  if (profile.is_founder || profile.subscription_tier === 'founder') {
    return {
      current: 0,
      limit: 999999,
      exceeded: false,
      remaining: 999999,
      unlimited: true,
      isFounder: true
    };
  }
  
  // Regular user logic would go here
  return { exceeded: true, remaining: 0 };
};

const usageTypes = ['keywords_analyzed', 'content_generated', 'attribution_queries'];
usageTypes.forEach(type => {
  const result = checkUsageLimit(type);
  console.log(`${type}: ${result.unlimited ? '♾️ UNLIMITED' : `${result.remaining} remaining`}`);
});
console.groupEnd();

console.log('🎯 Founder Account Test Complete!');
console.log('💡 Refresh the page to see founder badges and unlimited access');
