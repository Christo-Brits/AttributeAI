// User Account Query Script
// Check all user accounts across different systems

console.log('🔍 AttributeAI User Account Audit');
console.log('=======================================');

// Function to check all user data sources
const auditUserAccounts = () => {
  const results = {
    localStorage: [],
    sessionStorage: [],
    supabase: 'Not connected',
    googleAnalytics: 40, // From your current GA data
    total: 0
  };

  // Check localStorage for user data
  console.log('\n📁 Checking localStorage...');
  try {
    const currentUser = localStorage.getItem('attributeai_user');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      results.localStorage.push(userData);
      console.log('✅ Found localStorage user:', userData.email || 'No email');
    }

    const userSessions = localStorage.getItem('user_sessions');
    if (userSessions) {
      const sessions = JSON.parse(userSessions);
      results.localStorage.push(...sessions);
      console.log('✅ Found stored sessions:', sessions.length);
    }

    const sessionCount = localStorage.getItem('attributeai_sessions');
    if (sessionCount) {
      console.log('✅ Total sessions recorded:', sessionCount);
    }

    const firstVisit = localStorage.getItem('attributeai_first_visit');
    if (firstVisit) {
      const daysAgo = Math.floor((Date.now() - parseInt(firstVisit)) / (1000 * 60 * 60 * 24));
      console.log('✅ First visit was', daysAgo, 'days ago');
    }

  } catch (error) {
    console.log('❌ Error reading localStorage:', error);
  }

  // Check sessionStorage for current session data
  console.log('\n💾 Checking sessionStorage...');
  try {
    const toolsUsed = sessionStorage.getItem('tools_used');
    if (toolsUsed) {
      const tools = JSON.parse(toolsUsed);
      console.log('✅ Tools used this session:', tools);
      results.sessionStorage.push({ toolsUsed: tools });
    }

    const sessionStart = sessionStorage.getItem('session_start');
    if (sessionStart) {
      const sessionDuration = Math.floor((Date.now() - parseInt(sessionStart)) / 1000);
      console.log('✅ Current session duration:', sessionDuration, 'seconds');
    }

  } catch (error) {
    console.log('❌ Error reading sessionStorage:', error);
  }

  // Check for Supabase connection
  console.log('\n🗄️ Checking Supabase connection...');
  if (typeof window.supabase !== 'undefined') {
    console.log('✅ Supabase client found');
    results.supabase = 'Connected';
    // In production, you would query actual user data here
  } else {
    console.log('ℹ️ Supabase not connected (demo mode)');
  }

  // Calculate totals
  results.total = results.localStorage.length + results.sessionStorage.length + results.googleAnalytics;

  return results;
};

// Function to check trial status for current user
const checkTrialStatus = () => {
  console.log('\n⏰ Checking trial status...');
  
  const firstVisit = localStorage.getItem('attributeai_first_visit');
  if (!firstVisit) {
    console.log('ℹ️ New user - no trial data yet');
    return null;
  }

  const daysUsed = Math.floor((Date.now() - parseInt(firstVisit)) / (1000 * 60 * 60 * 24));
  const toolsUsed = JSON.parse(sessionStorage.getItem('tools_used') || '[]');
  const sessionCount = parseInt(localStorage.getItem('attributeai_sessions') || '1');
  const currentUser = localStorage.getItem('attributeai_user');
  
  const trialInfo = {
    daysUsed,
    daysRemaining: Math.max(0, 14 - daysUsed),
    toolsUsed: toolsUsed.length,
    sessionCount,
    isRegistered: !!currentUser,
    shouldPromptSignup: daysUsed >= 10 && toolsUsed.length >= 2 && !currentUser
  };

  console.log('📊 Trial Status:', trialInfo);
  
  if (trialInfo.shouldPromptSignup) {
    console.log('🚨 SHOULD SHOW SIGNUP PROMPT!');
  }

  return trialInfo;
};

// Function to simulate user creation for testing
const createTestUser = (email = 'test@example.com') => {
  const testUser = {
    id: 'test_' + Date.now(),
    email: email,
    firstName: 'Test',
    lastName: 'User',
    company: 'Test Company',
    industry: 'Technology',
    createdAt: new Date().toISOString(),
    isDemo: true
  };

  localStorage.setItem('attributeai_user', JSON.stringify(testUser));
  console.log('✅ Test user created:', testUser);
  
  return testUser;
};

// Function to simulate tool usage for testing prompts
const simulateToolUsage = () => {
  const tools = ['keyword_intelligence', 'content_generation', 'seo_analysis'];
  sessionStorage.setItem('tools_used', JSON.stringify(tools));
  
  // Simulate being a user for 12 days
  const twelveDaysAgo = Date.now() - (12 * 24 * 60 * 60 * 1000);
  localStorage.setItem('attributeai_first_visit', twelveDaysAgo.toString());
  localStorage.setItem('attributeai_sessions', '8');
  
  console.log('✅ Simulated 12-day user with 3 tools used');
  console.log('🚨 This should trigger signup prompts!');
};

// Run the audit
const runAudit = () => {
  const results = auditUserAccounts();
  const trialStatus = checkTrialStatus();
  
  console.log('\n📈 SUMMARY');
  console.log('===========');
  console.log('📊 Total tracked users:', results.total);
  console.log('💾 localStorage users:', results.localStorage.length);
  console.log('🔄 Session data points:', results.sessionStorage.length); 
  console.log('📈 Google Analytics users:', results.googleAnalytics);
  console.log('🗄️ Supabase status:', results.supabase);
  
  if (trialStatus) {
    console.log('\n⏰ TRIAL INFORMATION');
    console.log('=====================');
    console.log('📅 Days used:', trialStatus.daysUsed);
    console.log('⏳ Days remaining:', trialStatus.daysRemaining);
    console.log('🔧 Tools used:', trialStatus.toolsUsed);
    console.log('🔄 Sessions:', trialStatus.sessionCount);
    console.log('📝 Registered:', trialStatus.isRegistered ? 'Yes' : 'No');
    console.log('🚨 Should prompt signup:', trialStatus.shouldPromptSignup ? 'YES' : 'No');
  }

  return results;
};

// Export functions for manual testing
window.userAudit = {
  runAudit,
  auditUserAccounts,
  checkTrialStatus,
  createTestUser,
  simulateToolUsage,
  
  // Quick test functions
  testSignupPrompt: () => {
    simulateToolUsage();
    console.log('🧪 Signup prompt should now appear (refresh page)');
  },
  
  resetUser: () => {
    localStorage.removeItem('attributeai_user');
    localStorage.removeItem('attributeai_first_visit');
    localStorage.removeItem('attributeai_sessions');
    sessionStorage.removeItem('tools_used');
    console.log('🔄 User data reset');
  }
};

// Auto-run audit
const auditResults = runAudit();

console.log('\n🛠️ Available commands:');
console.log('   userAudit.runAudit() - Run full audit again');
console.log('   userAudit.testSignupPrompt() - Test signup prompt system');
console.log('   userAudit.createTestUser("email@test.com") - Create test user');
console.log('   userAudit.resetUser() - Reset all user data');

// Return results for external use
auditResults;