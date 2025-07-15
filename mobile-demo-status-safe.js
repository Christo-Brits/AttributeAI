// SAFE VERSION - Replace mobile-demo-status.js with this

// Mobile Demo Status Checker - SECURE VERSION
class MobileDemoChecker {
  constructor() {
    this.checks = {
      viewport: this.checkViewport.bind(this),
      safeArea: this.checkSafeArea.bind(this),
      navigation: this.checkNavigation.bind(this),
      layout: this.checkLayout.bind(this)
    };
  }

  checkViewport() {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    return {
      height: vh,
      width: vw,
      isMobile: vw < 768,
      aspectRatio: vw / vh
    };
  }

  checkSafeArea() {
    const safeArea = {
      top: getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0px',
      bottom: getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0px'
    };
    return safeArea;
  }

  checkNavigation() {
    const nav = document.querySelector('.mobile-nav');
    return {
      exists: !!nav,
      visible: nav ? !nav.hidden : false,
      position: nav ? getComputedStyle(nav).position : null
    };
  }

  checkLayout() {
    const footer = document.querySelector('.bottom-fixed');
    return {
      hasBottomFixed: !!footer,
      clearance: footer ? getComputedStyle(footer).bottom : null
    };
  }

  runAllChecks() {
    const results = {};
    for (const [name, check] of Object.entries(this.checks)) {
      try {
        results[name] = check();
      } catch (error) {
        results[name] = { error: error.message };
      }
    }
    return results;
  }
}

// Safe global exposure
window.MobileDemoChecker = MobileDemoChecker;
window.checkMobileDemoStatus = () => {
  const checker = new MobileDemoChecker();
  const results = checker.runAllChecks();
  console.log('📱 Mobile Demo Status:', results);
  return results;
};

// Auto-run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.checkMobileDemoStatus);
} else {
  window.checkMobileDemoStatus();
}
