// Enhanced Conversion Tracker with Hotjar Integration
// Comprehensive funnel tracking for AttributeAI

class EnhancedConversionTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.funnelSteps = [];
    this.initializeTracking();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  initializeTracking() {
    // Track page load
    this.trackEvent('page_load', {
      page: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });

    // Set up scroll tracking
    this.setupScrollTracking();
    
    // Set up time-based tracking
    this.setupTimeTracking();
    
    // Set up exit intent tracking
    this.setupExitIntentTracking();
  }

  // === FUNNEL STEP TRACKING ===
  trackFunnelStep(stepName, stepData = {}) {
    const step = {
      name: stepName,
      timestamp: Date.now(),
      data: stepData,
      sessionId: this.sessionId
    };
    
    this.funnelSteps.push(step);
    
    // Track in GA4
    if (window.gtag) {
      window.gtag('event', 'funnel_step', {
        step_name: stepName,
        step_number: this.funnelSteps.length,
        session_id: this.sessionId,
        ...stepData
      });
    }

    // Track in Hotjar
    if (window.hj) {
      window.hj('event', stepName);
    }

    console.log(`🎯 Funnel Step: ${stepName}`, step);
  }

  // === ATTRIBUTION AI SPECIFIC TRACKING ===
  
  // Landing Page Interactions
  trackLandingPageView() {
    this.trackFunnelStep('landing_page_view', {
      page_type: 'landing',
      utm_source: this.getUTMParam('utm_source'),
      utm_medium: this.getUTMParam('utm_medium'),
      utm_campaign: this.getUTMParam('utm_campaign')
    });
  }

  trackToolInteraction(toolName, action = 'view') {
    this.trackFunnelStep('tool_interaction', {
      tool_name: toolName,
      action: action,
      timestamp: Date.now()
    });

    // Track specific tool usage in GA4
    if (window.gtag) {
      window.gtag('event', 'tool_usage', {
        tool_name: toolName,
        action: action,
        event_category: 'engagement'
      });
    }
  }

  // Keyword Intelligence specific tracking
  trackKeywordAnalysis(keywordCount, analysisType) {
    this.trackFunnelStep('keyword_analysis', {
      keyword_count: keywordCount,
      analysis_type: analysisType,
      value: keywordCount * 0.1 // Assign value based on analysis depth
    });
  }

  // Content generation tracking
  trackContentGeneration(contentType, wordCount) {
    this.trackFunnelStep('content_generation', {
      content_type: contentType,
      word_count: wordCount,
      value: wordCount * 0.01
    });
  }

  // === SIGNUP FUNNEL TRACKING ===
  
  trackSignupIntention() {
    this.trackFunnelStep('signup_intention', {
      trigger: 'cta_click',
      page: window.location.pathname
    });
  }

  trackSignupFormView() {
    this.trackFunnelStep('signup_form_view');
  }

  trackEmailEntered(email) {
    this.trackFunnelStep('email_entered', {
      email_domain: email.split('@')[1] || 'unknown'
    });
  }

  trackSignupAttempt(method) {
    this.trackFunnelStep('signup_attempt', {
      method: method,
      form_completion_time: Date.now() - this.startTime
    });
  }

  trackSignupSuccess(userId, method) {
    this.trackFunnelStep('signup_success', {
      user_id: userId,
      method: method,
      total_funnel_time: Date.now() - this.startTime
    });

    // Track conversion in GA4
    if (window.gtag) {
      window.gtag('event', 'sign_up', {
        method: method,
        user_id: userId,
        value: 47 // Assign trial value
      });
    }

    // Identify user in Hotjar
    if (window.hj) {
      window.hj('identify', userId, {
        signup_method: method,
        signup_date: new Date().toISOString()
      });
    }
  }

  // === ENGAGEMENT TRACKING ===
  
  trackFeatureDiscovery(feature) {
    this.trackFunnelStep('feature_discovery', {
      feature_name: feature,
      discovery_method: 'navigation'
    });
  }

  trackTrialUpgrade(plan) {
    this.trackFunnelStep('trial_upgrade', {
      target_plan: plan,
      value: plan === 'growth' ? 97 : 297
    });

    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: 'trial_upgrade_' + Date.now(),
        value: plan === 'growth' ? 97 : 297,
        currency: 'USD',
        items: [{
          item_id: plan,
          item_name: `AttributeAI ${plan} Plan`,
          category: 'subscription',
          quantity: 1,
          price: plan === 'growth' ? 97 : 297
        }]
      });
    }
  }

  // === BEHAVIOR TRACKING ===
  
  setupScrollTracking() {
    let maxScroll = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track major scroll milestones
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          this.trackEvent('scroll_depth', {
            scroll_percent: scrollPercent,
            page: window.location.pathname
          });
        }
      }
    };

    window.addEventListener('scroll', this.throttle(trackScroll, 1000));
  }

  setupTimeTracking() {
    // Track time spent milestones
    const timeIntervals = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
    
    timeIntervals.forEach(seconds => {
      setTimeout(() => {
        this.trackEvent('time_on_page', {
          seconds_spent: seconds,
          page: window.location.pathname,
          still_active: document.hasFocus()
        });
      }, seconds * 1000);
    });
  }

  setupExitIntentTracking() {
    let exitIntentTriggered = false;
    
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true;
        this.trackEvent('exit_intent', {
          time_on_page: Date.now() - this.startTime,
          scroll_depth: Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100),
          page: window.location.pathname
        });
      }
    });
  }

  // === ATTRIBUTION TRACKING ===
  
  trackAttributionSource() {
    const source = {
      utm_source: this.getUTMParam('utm_source'),
      utm_medium: this.getUTMParam('utm_medium'),
      utm_campaign: this.getUTMParam('utm_campaign'),
      utm_term: this.getUTMParam('utm_term'),
      utm_content: this.getUTMParam('utm_content'),
      referrer: document.referrer,
      landing_page: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    // Store attribution data in localStorage for session tracking
    localStorage.setItem('attribution_source', JSON.stringify(source));
    
    this.trackEvent('attribution_captured', source);
    
    return source;
  }

  // === UTILITY METHODS ===
  
  trackEvent(eventName, eventData = {}) {
    const event = {
      event: eventName,
      session_id: this.sessionId,
      timestamp: Date.now(),
      ...eventData
    };

    // Track in GA4
    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }

    // Track in Hotjar
    if (window.hj) {
      window.hj('event', eventName);
    }

    console.log(`📊 Event: ${eventName}`, event);
  }

  getUTMParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // === ANALYTICS INTEGRATION ===
  
  // Get comprehensive funnel analytics
  getFunnelAnalytics() {
    return {
      sessionId: this.sessionId,
      totalSteps: this.funnelSteps.length,
      funnelSteps: this.funnelSteps,
      sessionDuration: Date.now() - this.startTime,
      attributionSource: JSON.parse(localStorage.getItem('attribution_source') || '{}')
    };
  }

  // Export funnel data for analysis
  exportFunnelData() {
    const data = this.getFunnelAnalytics();
    console.log('📈 Funnel Analytics:', data);
    return data;
  }
}

// Initialize enhanced tracking
const tracker = new EnhancedConversionTracker();

// Export for use in React components
export { EnhancedConversionTracker };
export default tracker;

// Global convenience methods
window.attributeAITracker = tracker;

// Auto-track page loads
if (typeof window !== 'undefined') {
  tracker.trackLandingPageView();
  tracker.trackAttributionSource();
}