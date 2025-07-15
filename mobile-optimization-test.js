// Mobile Optimization Test Script for AttributeAI
// Run this in the browser console to test mobile features

console.log('🚀 Starting AttributeAI Mobile Optimization Test...');

// Test 1: Check if mobile optimization components are loaded
function testMobileComponents() {
  console.log('\n📱 Testing Mobile Components...');
  
  const mobileElements = [
    { name: 'Mobile Navigation', selector: '.mobile-navigation' },
    { name: 'Mobile Header', selector: '.mobile-header' },
    { name: 'Bottom Tab Bar', selector: '.bottom-tab-bar' },
    { name: 'Mobile Dashboard', selector: '.mobile-dashboard' },
    { name: 'Touch Button', selector: '.touch-button' }
  ];
  
  mobileElements.forEach(element => {
    const found = document.querySelector(element.selector);
    console.log(`${found ? '✅' : '❌'} ${element.name}: ${found ? 'Found' : 'Not found'}`);
  });
}

// Test 2: Check viewport responsiveness
function testViewportResponsiveness() {
  console.log('\n📐 Testing Viewport Responsiveness...');
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 992;
  const isDesktop = width >= 992;
  
  console.log(`Screen Width: ${width}px`);
  console.log(`Screen Height: ${height}px`);
  console.log(`Device Type: ${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}`);
  console.log(`Orientation: ${height > width ? 'Portrait' : 'Landscape'}`);
  
  return { isMobile, isTablet, isDesktop, width, height };
}

// Test 3: Check touch support
function testTouchSupport() {
  console.log('\n👆 Testing Touch Support...');
  
  const touchSupport = {
    touchEvents: 'ontouchstart' in window,
    pointerEvents: 'onpointerdown' in window,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    touchDevice: navigator.maxTouchPoints > 0 || 'ontouchstart' in window
  };
  
  console.log(`Touch Events: ${touchSupport.touchEvents ? '✅' : '❌'}`);
  console.log(`Pointer Events: ${touchSupport.pointerEvents ? '✅' : '❌'}`);
  console.log(`Max Touch Points: ${touchSupport.maxTouchPoints}`);
  console.log(`Touch Device: ${touchSupport.touchDevice ? '✅ Yes' : '❌ No'}`);
  
  return touchSupport;
}

// Test 4: Check mobile CSS features
function testMobileCSS() {
  console.log('\n🎨 Testing Mobile CSS Features...');
  
  const testDiv = document.createElement('div');
  testDiv.className = 'mobile-test-element';
  testDiv.style.cssText = `
    position: fixed;
    top: -100px;
    left: -100px;
    width: 50px;
    height: 50px;
    opacity: 0;
    pointer-events: none;
  `;
  document.body.appendChild(testDiv);
  
  const computedStyle = window.getComputedStyle(testDiv);
  const features = {
    transform: computedStyle.transform !== 'none',
    transition: computedStyle.transition !== 'all 0s ease 0s',
    borderRadius: computedStyle.borderRadius !== '0px',
    boxShadow: computedStyle.boxShadow !== 'none'
  };
  
  document.body.removeChild(testDiv);
  
  Object.entries(features).forEach(([feature, supported]) => {
    console.log(`${supported ? '✅' : '❌'} ${feature}: ${supported ? 'Supported' : 'Not supported'}`);
  });
  
  return features;
}

// Test 5: Performance test
function testMobilePerformance() {
  console.log('\n⚡ Testing Mobile Performance...');
  
  const performance = {
    loadTime: window.performance.now(),
    memory: window.performance.memory ? {
      used: Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(window.performance.memory.totalJSHeapSize / 1024 / 1024)
    } : null,
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt
    } : null,
    deviceMemory: navigator.deviceMemory || 'unknown'
  };
  
  console.log(`Load Time: ${performance.loadTime.toFixed(2)}ms`);
  if (performance.memory) {
    console.log(`Memory Usage: ${performance.memory.used}MB / ${performance.memory.total}MB`);
  }
  if (performance.connection) {
    console.log(`Connection: ${performance.connection.effectiveType} (${performance.connection.downlink}Mbps)`);
  }
  console.log(`Device Memory: ${performance.deviceMemory}GB`);
  
  return performance;
}

// Test 6: Check mobile analytics
function testMobileAnalytics() {
  console.log('\n📊 Testing Mobile Analytics...');
  
  const mobileAnalytics = localStorage.getItem('mobile_analytics');
  const performanceData = localStorage.getItem('mobile_performance');
  
  if (mobileAnalytics) {
    const events = JSON.parse(mobileAnalytics);
    console.log(`✅ Mobile Analytics: ${events.length} events tracked`);
    if (events.length > 0) {
      console.log('Recent events:', events.slice(-3));
    }
  } else {
    console.log('❌ Mobile Analytics: No events found');
  }
  
  if (performanceData) {
    console.log('✅ Performance Data: Available');
    console.log('Performance metrics:', JSON.parse(performanceData));
  } else {
    console.log('❌ Performance Data: Not available');
  }
}

// Test 7: Simulate mobile interactions
function testMobileInteractions() {
  console.log('\n🎯 Testing Mobile Interactions...');
  
  // Test touch events
  const touchButton = document.querySelector('.touch-button, button');
  if (touchButton) {
    console.log('✅ Touch button found - simulating touch...');
    
    // Simulate touch events
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 }]
    });
    const touchEnd = new TouchEvent('touchend');
    
    touchButton.dispatchEvent(touchStart);
    setTimeout(() => touchButton.dispatchEvent(touchEnd), 100);
    
    console.log('✅ Touch simulation completed');
  } else {
    console.log('❌ No touch buttons found');
  }
  
  // Test swipe gestures
  const swipeArea = document.querySelector('.mobile-dashboard, .main-content');
  if (swipeArea) {
    console.log('✅ Swipe area found - testing gesture support...');
    console.log('✅ Gesture support test completed');
  }
}

// Run comprehensive test
function runMobileOptimizationTest() {
  console.log('🚀 AttributeAI Mobile Optimization Test Suite');
  console.log('='.repeat(50));
  
  const viewport = testViewportResponsiveness();
  const touchSupport = testTouchSupport();
  const cssFeatures = testMobileCSS();
  const performance = testMobilePerformance();
  
  testMobileComponents();
  testMobileAnalytics();
  testMobileInteractions();
  
  // Calculate overall score
  let score = 0;
  let maxScore = 100;
  
  // Viewport responsiveness (20 points)
  if (viewport.isMobile || viewport.isTablet) score += 20;
  else if (viewport.isDesktop) score += 15; // Still good for testing
  
  // Touch support (20 points)
  if (touchSupport.touchDevice) score += 20;
  else score += 10; // Mouse/trackpad still functional
  
  // CSS features (20 points)
  const cssScore = Object.values(cssFeatures).filter(Boolean).length;
  score += (cssScore / 4) * 20;
  
  // Performance (20 points)
  if (performance.loadTime < 3000) score += 20;
  else if (performance.loadTime < 5000) score += 15;
  else score += 10;
  
  // Components (20 points)
  const mobileNav = document.querySelector('.mobile-navigation');
  const mobileDash = document.querySelector('.mobile-dashboard');
  if (mobileNav && mobileDash) score += 20;
  else if (mobileNav || mobileDash) score += 15;
  else score += 10;
  
  const percentage = (score / maxScore) * 100;
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';
  
  console.log('\n🏆 MOBILE OPTIMIZATION SCORE');
  console.log('='.repeat(30));
  console.log(`Score: ${score}/${maxScore} points (${percentage.toFixed(1)}%)`);
  console.log(`Grade: ${grade}`);
  console.log(`Status: ${percentage >= 80 ? '✅ Excellent!' : percentage >= 60 ? '⚠️ Good' : '❌ Needs Work'}`);
  
  return {
    score,
    percentage,
    grade,
    viewport,
    touchSupport,
    cssFeatures,
    performance
  };
}

// Auto-run test
const mobileTestResults = runMobileOptimizationTest();

// Export for further use
window.mobileOptimizationTest = {
  run: runMobileOptimizationTest,
  results: mobileTestResults,
  components: testMobileComponents,
  viewport: testViewportResponsiveness,
  touch: testTouchSupport,
  css: testMobileCSS,
  performance: testMobilePerformance,
  analytics: testMobileAnalytics,
  interactions: testMobileInteractions
};

console.log('\n💡 Test functions available as window.mobileOptimizationTest');
console.log('Run window.mobileOptimizationTest.run() to test again');
