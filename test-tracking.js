// Test script to verify AttributeAI tracking setup
// Open browser console and run this script to test

console.log('🎯 Testing AttributeAI Analytics Setup...');

// Test 1: Check if GA4 is loaded
if (typeof gtag !== 'undefined') {
    console.log('✅ Google Analytics 4 loaded successfully');
    
    // Test GA4 event
    gtag('event', 'test_tracking', {
        event_category: 'test',
        event_label: 'setup_verification',
        value: 1
    });
    console.log('✅ GA4 test event sent');
} else {
    console.log('❌ GA4 not loaded');
}

// Test 2: Check if Hotjar is loaded
if (typeof hj !== 'undefined') {
    console.log('✅ Hotjar loaded successfully');
    
    // Test Hotjar event
    hj('event', 'test_tracking_setup');
    console.log('✅ Hotjar test event sent');
} else {
    console.log('❌ Hotjar not loaded yet (may take a few seconds)');
}

// Test 3: Check if Enhanced Tracker is available
if (typeof window.attributeAITracker !== 'undefined') {
    console.log('✅ Enhanced Conversion Tracker loaded');
    
    // Test enhanced tracking
    window.attributeAITracker.trackEvent('test_setup', {
        test: true,
        timestamp: Date.now()
    });
    console.log('✅ Enhanced tracking test event sent');
} else {
    console.log('❌ Enhanced Conversion Tracker not loaded');
}

// Test 4: Display funnel analytics
if (typeof window.attributeAITracker !== 'undefined') {
    const analytics = window.attributeAITracker.getFunnelAnalytics();
    console.log('📊 Current Session Analytics:', analytics);
}

// Test 5: Check tracking data
setTimeout(() => {
    console.log('\n🔍 Checking tracking after 3 seconds...');
    
    if (typeof hj !== 'undefined') {
        console.log('✅ Hotjar is now ready');
    }
    
    if (typeof window.dataLayer !== 'undefined') {
        console.log('📊 GA4 DataLayer:', window.dataLayer.slice(-5)); // Last 5 events
    }
}, 3000);

console.log('\n📋 Setup Verification Complete!');
console.log('Next steps:');
console.log('1. Check browser Network tab for tracking requests');
console.log('2. Check Hotjar dashboard at https://insights.hotjar.com');
console.log('3. Check GA4 Real-time reports at https://analytics.google.com');
console.log('4. Look for test events in both platforms');
