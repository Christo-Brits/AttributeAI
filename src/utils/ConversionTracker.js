// GA4 Conversion Events - Implementation of Peer Review Recommendations
// Add this to your analytics setup to track the conversion funnel

class ConversionTracker {
  static trackSignupAttempt(method, email = null) {
    if (window.gtag) {
      window.gtag('event', 'sign_up_attempt', {
        method: method, // 'magic_link', 'google_oauth', 'email_password'
        email: email,
        timestamp: new Date().toISOString()
      });
    }
  }

  static trackSignupSuccess(userId, method) {
    if (window.gtag) {
      window.gtag('event', 'sign_up', {
        method: method,
        user_id: userId,
        value: 1 // Assign conversion value
      });
    }
  }

  static trackChromeExtensionInstall() {
    if (window.gtag) {
      window.gtag('event', 'chrome_addon_install', {
        event_category: 'engagement',
        event_label: 'browser_extension'
      });
    }
  }

  static trackTrialStarted(userId) {
    if (window.gtag) {
      window.gtag('event', 'trial_started', {
        user_id: userId,
        trial_type: 'premium',
        value: 47 // Monthly value
      });
    }
  }

  static trackKeywordAnalysis(userId, keywordCount) {
    if (window.gtag) {
      window.gtag('event', 'keyword_analysis', {
        user_id: userId,
        keyword_count: keywordCount,
        event_category: 'engagement'
      });
    }
  }

  static trackQuotaReached(userId, quotaType) {
    if (window.gtag) {
      window.gtag('event', 'quota_reached', {
        user_id: userId,
        quota_type: quotaType, // 'free', 'professional'
        event_category: 'conversion_opportunity'
      });
    }
  }

  static trackUpgradeIntent(userId, targetPlan) {
    if (window.gtag) {
      window.gtag('event', 'upgrade_intent', {
        user_id: userId,
        target_plan: targetPlan,
        value: targetPlan === 'professional' ? 47 : 97
      });
    }
  }

  static trackFeatureUsage(userId, feature) {
    if (window.gtag) {
      window.gtag('event', 'feature_usage', {
        user_id: userId,
        feature_name: feature,
        event_category: 'engagement'
      });
    }
  }

  // Landing page interaction tracking
  static trackCTAClick(ctaType) {
    if (window.gtag) {
      window.gtag('event', 'cta_click', {
        cta_type: ctaType, // 'trial', 'demo', 'free_account'
        page_location: window.location.href
      });
    }
  }

  static trackLandingPageView() {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Landing Page',
        page_location: window.location.href
      });
    }
  }

  // Funnel optimization tracking
  static trackSignupFormView() {
    if (window.gtag) {
      window.gtag('event', 'signup_form_view', {
        event_category: 'funnel',
        page_location: window.location.href
      });
    }
  }

  static trackEmailEntered() {
    if (window.gtag) {
      window.gtag('event', 'email_entered', {
        event_category: 'funnel_progress'
      });
    }
  }

  static trackAuthMethodSelected(method) {
    if (window.gtag) {
      window.gtag('event', 'auth_method_selected', {
        method: method,
        event_category: 'funnel_progress'
      });
    }
  }
}

// Enhanced funnel tracking for conversion optimization
export const initializeFunnelTracking = () => {
  // Track landing page views
  ConversionTracker.trackLandingPageView();

  // Track CTA button clicks
  document.addEventListener('click', (event) => {
    const target = event.target;
    
    // Track Create Free Account clicks
    if (target.textContent?.includes('Create Free Account') || 
        target.textContent?.includes('Start') ||
        target.closest('[data-cta="signup"]')) {
      ConversionTracker.trackCTAClick('free_account');
    }
    
    // Track demo/trial clicks
    if (target.textContent?.includes('Demo') || target.textContent?.includes('Trial')) {
      ConversionTracker.trackCTAClick('trial');
    }
  });

  // Track form interactions
  document.addEventListener('focus', (event) => {
    if (event.target.type === 'email' && event.target.placeholder?.includes('email')) {
      ConversionTracker.trackSignupFormView();
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.type === 'email' && event.target.value.includes('@')) {
      ConversionTracker.trackEmailEntered();
    }
  });
};

export default ConversionTracker;
