// AttributeAI Analytics Testing Script
// Run in browser console to test funnel tracking

console.log('🚀 AttributeAI Analytics Testing Started');

// Test basic analytics functionality
const testAnalytics = () => {
  // Check if analytics instance exists
  if (typeof window.analytics !== 'undefined') {
    console.log('✅ Analytics instance found');
  } else {
    console.log('❌ Analytics instance not found');
  }

  // Check if gtag is loaded
  if (typeof gtag !== 'undefined') {
    console.log('✅ Google Analytics gtag found');
    
    // Test a simple event
    gtag('event', 'test_tracking', {
      'event_category': 'testing',
      'event_label': 'analytics_verification',
      'value': 1
    });
    console.log('📊 Test event sent to GA4');
  } else {
    console.log('❌ Google Analytics gtag not found');
  }

  // Test funnel tracking
  try {
    // Simulate funnel events
    const testEvents = [
      {
        step: 'session_start',
        data: { test_mode: true, user_type: 'test_user' }
      },
      {
        step: 'feature_discovery',
        data: { feature_name: 'test_feature', test_mode: true }
      },
      {
        step: 'tool_usage',
        data: { tool_name: 'test_tool', action: 'started', test_mode: true }
      }
    ];

    testEvents.forEach((event, index) => {
      setTimeout(() => {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'funnel_progress', {
            'event_category': 'user_journey',
            'funnel_step': event.step,
            'step_number': index + 1,
            'test_mode': true,
            ...event.data
          });
          console.log(`📈 Funnel event ${index + 1}/3 sent: ${event.step}`);
        }
      }, index * 1000);
    });

  } catch (error) {
    console.log('❌ Error testing funnel tracking:', error);
  }
};

// Test component analytics hooks
const testComponentHooks = () => {
  console.log('🧪 Testing component analytics hooks...');
  
  // Check if we're on a component that uses analytics
  const componentAnalytics = document.querySelector('[data-analytics]');
  if (componentAnalytics) {
    console.log('✅ Component with analytics found');
  } else {
    console.log('ℹ️ No components with analytics data attributes found');
  }

  // Test session storage for analytics
  try {
    sessionStorage.setItem('test_analytics', 'working');
    if (sessionStorage.getItem('test_analytics') === 'working') {
      console.log('✅ Session storage working for analytics');
      sessionStorage.removeItem('test_analytics');
    }
  } catch (error) {
    console.log('❌ Session storage issue:', error);
  }

  // Check for session analytics data
  const sessionStart = sessionStorage.getItem('session_start');
  const toolsUsed = sessionStorage.getItem('tools_used');
  
  if (sessionStart) {
    console.log('✅ Session tracking active:', new Date(parseInt(sessionStart)));
  } else {
    console.log('ℹ️ No session tracking data found');
  }

  if (toolsUsed) {
    console.log('✅ Tools usage tracking:', JSON.parse(toolsUsed));
  } else {
    console.log('ℹ️ No tools usage data found');
  }
};

// Test GA4 connection
const testGA4Connection = () => {
  console.log('🔍 Testing GA4 connection...');
  
  // Check if GA4 config is loaded
  if (typeof gtag !== 'undefined') {
    // Send a test event and log it
    gtag('event', 'analytics_test', {
      'event_category': 'system_test',
      'event_label': 'connection_verification',
      'custom_parameter': 'test_value',
      'timestamp': new Date().toISOString()
    });
    
    console.log('📡 Test event sent to GA4 (G-BDZZKFKYDV)');
    console.log('   Check GA4 Real-time reports to verify receipt');
  } else {
    console.log('❌ GA4 not properly loaded');
  }
};

// Run all tests
const runAllTests = () => {
  console.log('🧪 Running comprehensive analytics tests...\n');
  
  testAnalytics();
  console.log('\n');
  
  testComponentHooks();
  console.log('\n');
  
  testGA4Connection();
  console.log('\n');
  
  console.log('✅ Analytics testing complete!');
  console.log('📊 Check Google Analytics Real-time reports to verify events');
  console.log('🔗 GA4 Real-time: https://analytics.google.com/analytics/web/#/p' + (window.GA_MEASUREMENT_ID || 'YOUR_PROPERTY_ID') + '/reports/realtime');
};

// Auto-run tests
runAllTests();

// Export test functions for manual use
window.analyticsTest = {
  runAll: runAllTests,
  testBasic: testAnalytics,
  testComponents: testComponentHooks,
  testGA4: testGA4Connection,
  
  // Quick event test
  sendTestEvent: (eventName = 'manual_test') => {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        'event_category': 'manual_testing',
        'timestamp': new Date().toISOString(),
        'test_source': 'console'
      });
      console.log(`📊 Manual test event sent: ${eventName}`);
    } else {
      console.log('❌ GA4 not available for manual test');
    }
  }
};

console.log('\n🛠️ Analytics test functions available:');
console.log('   analyticsTest.runAll() - Run all tests');
console.log('   analyticsTest.sendTestEvent("your_event") - Send custom test event');
console.log('   analyticsTest.testGA4() - Test GA4 connection only');
