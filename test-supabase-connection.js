// Test Supabase Connection
// Run this file to verify your Supabase Edge Functions are working

import EdgeFunctionsService from './src/services/EdgeFunctionsService.js';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  console.log('Project URL: https://xpyfoutwwjslivrmbflm.supabase.co');
  console.log('Using Anon Key: ' + process.env.REACT_APP_SUPABASE_ANON_KEY?.substring(0, 20) + '...\n');

  // Test 1: Health Check
  console.log('1. Testing Edge Function availability...');
  try {
    const health = await EdgeFunctionsService.healthCheck();
    if (health.available) {
      console.log('✅ Edge Functions are available!');
    } else {
      console.log('❌ Edge Functions not available:', health.error);
      console.log('   This is normal if you haven\'t deployed the functions yet.');
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 2: Website Analysis (if deployed)
  console.log('\n2. Testing Website Analysis...');
  try {
    const result = await EdgeFunctionsService.analyzeWebsite('https://example.com');
    if (result.success) {
      console.log('✅ Website analysis working!');
      console.log('   SEO Score:', result.analysis?.seoScore);
    } else {
      console.log('❌ Website analysis failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Website analysis error:', error.message);
    console.log('   Deploy the analyze-website function first.');
  }

  // Test 3: Claude AI (if deployed)
  console.log('\n3. Testing Claude AI...');
  try {
    const result = await EdgeFunctionsService.callClaude('Hello, are you working?');
    if (result.success) {
      console.log('✅ Claude AI is working!');
      console.log('   Response:', result.response?.substring(0, 100) + '...');
    } else {
      console.log('❌ Claude AI failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Claude AI error:', error.message);
    console.log('   Deploy the claude-chat function and set ANTHROPIC_API_KEY secret.');
  }

  console.log('\n========================================');
  console.log('Test Complete!');
  console.log('\nIf functions are not working:');
  console.log('1. Run: deploy-supabase-functions.bat');
  console.log('2. Set your API keys as secrets');
  console.log('3. Try this test again');
  console.log('========================================\n');
}

// Run the test
testSupabaseConnection().catch(console.error);