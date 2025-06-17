// AttributeAI Advanced Funnel Tracking System
// Enhanced Google Analytics 4 integration with detailed user journey tracking

/* global gtag */

class AttributeAIAnalytics {
  constructor() {
    this.GA_MEASUREMENT_ID = 'G-BDZZKFKYDV';
    this.sessionStart = this.getSessionStart();
    this.initializeSession();
  }

  initializeSession() {
    if (!sessionStorage.getItem('session_start')) {
      sessionStorage.setItem('session_start', Date.now().toString());
      this.trackSessionStart();
    }
    
    // Track tools used in this session
    if (!sessionStorage.getItem('tools_used')) {
      sessionStorage.setItem('tools_used', JSON.stringify([]));
    }
  }

  // Core funnel tracking method
  trackFunnelStep(step, data = {}) {
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'funnel_progress', {
        'event_category': 'user_journey',
        'funnel_step': step,
        'step_number': this.getFunnelStepNumber(step),
        'user_type': this.getUserType(),
        'session_duration': this.getSessionDuration(),
        'device_type': this.getDeviceType(),
        'user_segment': this.getUserSegment(),
        ...data
      });
    }
    
    console.log('📊 Funnel Step:', step, data);
  }

  // Session and user tracking
  trackSessionStart() {
    this.trackFunnelStep('session_start', {
      'traffic_source': this.getTrafficSource(),
      'landing_page': window.location.pathname,
      'referrer': document.referrer,
      'user_agent': navigator.userAgent,
      'timestamp': new Date().toISOString()
    });
  }

  // Navigation and feature discovery
  trackFeatureDiscovery(featureName, discoveryMethod = 'navigation_click') {
    this.trackFunnelStep('feature_discovery', {
      'feature_name': featureName,
      'discovery_method': discoveryMethod,
      'time_to_discovery': this.getSessionDuration(),
      'page_location': window.location.pathname
    });
  }

  // Tool usage tracking
  trackToolUsage(toolName, action, data = {}) {
    // Update tools used in session
    const toolsUsed = this.getToolsUsed();
    if (!toolsUsed.includes(toolName)) {
      toolsUsed.push(toolName);
      sessionStorage.setItem('tools_used', JSON.stringify(toolsUsed));
    }

    this.trackFunnelStep('tool_usage', {
      'tool_name': toolName,
      'action': action,
      'usage_duration': data.duration || 0,
      'features_used': data.features || [],
      'success': data.success || false,
      'error_encountered': data.error || false,
      'tools_used_count': toolsUsed.length,
      ...data
    });
  }

  // AI Chat specific tracking
  trackAIChatEngagement(eventType, data = {}) {
    this.trackFunnelStep('ai_chat_engagement', {
      'chat_event': eventType,
      'conversation_length': data.messageCount || 0,
      'chat_duration': data.duration || 0,
      'intent_detected': data.intent || 'general',
      'ai_model_used': data.aiModel || 'claude',
      'response_quality': data.responseQuality || 'unknown',
      'user_satisfaction': data.satisfaction || 'unknown'
    });
  }

  // Conversion events
  trackConversion(conversionType, data = {}) {
    this.trackFunnelStep('conversion_event', {
      'conversion_type': conversionType,
      'conversion_value': data.value || 0,
      'user_segment': this.getUserSegment(),
      'attribution_source': this.getAttributionSource(),
      'tools_used_before_conversion': this.getToolsUsed(),
      'session_duration_at_conversion': this.getSessionDuration(),
      'page_location': window.location.pathname
    });

    // Also track as GA4 conversion
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'purchase', {
        'transaction_id': `conv_${Date.now()}`,
        'value': data.value || 0,
        'currency': 'USD',
        'event_category': 'conversion',
        'event_label': conversionType
      });
    }
  }

  // Drop-off tracking
  trackDropOff(location, reason = 'unknown', data = {}) {
    this.trackFunnelStep('user_drop_off', {
      'drop_off_location': location,
      'drop_off_reason': reason,
      'session_duration': this.getSessionDuration(),
      'pages_viewed': this.getPagesViewed(),
      'tools_tried': this.getToolsUsed(),
      'last_action': data.lastAction || 'unknown',
      'exit_intent': data.exitIntent || false
    });
  }

  // AttributeAI specific feature tracking
  trackKeywordResearch(action, data = {}) {
    this.trackToolUsage('keyword_research', action, {
      'keywords_analyzed': data.keywordCount || 0,
      'analysis_type': data.analysisType || 'basic',
      'export_format': data.exportFormat || null,
      'ai_insights_generated': data.aiInsights || false,
      'competitor_analysis': data.competitorAnalysis || false,
      ...data
    });
  }

  trackContentGeneration(action, data = {}) {
    this.trackToolUsage('content_generation', action, {
      'content_type': data.contentType || 'article',
      'word_count': data.wordCount || 0,
      'ai_model_used': data.aiModel || 'claude',
      'research_sources': data.researchSources || 0,
      'export_format': data.exportFormat || null,
      ...data
    });
  }

  trackAttributionAnalysis(action, data = {}) {
    this.trackToolUsage('attribution_analysis', action, {
      'attribution_model': data.model || 'multi_touch',
      'data_sources': data.sources || [],
      'insights_generated': data.insightCount || 0,
      'roi_calculated': data.roiCalculated || false,
      ...data
    });
  }

  trackSEOAnalysis(action, data = {}) {
    this.trackToolUsage('seo_analysis', action, {
      'url_analyzed': data.url ? 'provided' : 'none', // Don't track actual URLs
      'seo_score': data.score || 0,
      'recommendations_count': data.recommendationCount || 0,
      'competitor_comparison': data.competitorComparison || false,
      ...data
    });
  }

  // Helper methods
  getSessionStart() {
    return parseInt(sessionStorage.getItem('session_start')) || Date.now();
  }

  getSessionDuration() {
    return Math.floor((Date.now() - this.sessionStart) / 1000);
  }

  getToolsUsed() {
    return JSON.parse(sessionStorage.getItem('tools_used') || '[]');
  }

  getPagesViewed() {
    return parseInt(sessionStorage.getItem('pages_viewed')) || 1;
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  getUserType() {
    const hasAccount = localStorage.getItem('user_profile');
    const sessionCount = parseInt(localStorage.getItem('session_count')) || 1;
    
    if (hasAccount && sessionCount > 5) return 'returning_power_user';
    if (hasAccount && sessionCount > 1) return 'returning_user';
    if (hasAccount) return 'registered_user';
    return 'anonymous_visitor';
  }

  getUserSegment() {
    const toolsUsed = this.getToolsUsed();
    const sessionCount = parseInt(localStorage.getItem('session_count')) || 1;
    const timeOnSite = this.getSessionDuration();

    if (toolsUsed.length >= 3 && sessionCount >= 3) return 'power_user';
    if (toolsUsed.length >= 2 && timeOnSite > 600) return 'engaged_user';
    if (toolsUsed.length >= 1) return 'trial_user';
    if (timeOnSite > 300) return 'interested_visitor';
    return 'bounce_risk';
  }

  getTrafficSource() {
    const referrer = document.referrer;
    if (!referrer) return 'direct';
    if (referrer.includes('google')) return 'google';
    if (referrer.includes('linkedin')) return 'linkedin';
    if (referrer.includes('reddit')) return 'reddit';
    if (referrer.includes('twitter')) return 'twitter';
    return 'referral';
  }

  getAttributionSource() {
    return this.getTrafficSource();
  }

  getFunnelStepNumber(step) {
    const stepMap = {
      'session_start': 1,
      'feature_discovery': 2,
      'tool_usage': 3,
      'ai_chat_engagement': 4,
      'conversion_event': 5,
      'user_drop_off': 99
    };
    return stepMap[step] || 0;
  }

  // Page tracking for SPA
  trackPageView(pageName) {
    const pagesViewed = this.getPagesViewed() + 1;
    sessionStorage.setItem('pages_viewed', pagesViewed.toString());
    
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('config', this.GA_MEASUREMENT_ID, {
        page_title: pageName,
        page_location: window.location.href
      });
    }
  }

  // Exit intent tracking
  trackExitIntent() {
    this.trackDropOff(window.location.pathname, 'exit_intent', {
      exitIntent: true,
      lastAction: 'mouse_leave'
    });
  }
}

// Singleton instance
const analyticsInstance = new AttributeAIAnalytics();

export default analyticsInstance;