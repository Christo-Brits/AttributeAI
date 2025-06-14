// Google Analytics 4 Service for AttributeAI Platform
// Enhanced tracking for SaaS marketing attribution platform

class GoogleAnalyticsService {
  constructor() {
    this.isInitialized = false;
    this.userId = null;
    this.subscriptionTier = 'free';
    this.init();
  }

  // Initialize GA4 if gtag is available
  init() {
    if (typeof window !== 'undefined' && window.gtag) {
      this.isInitialized = true;
      this.setupUserProperties();
      console.log('🔍 Google Analytics initialized for AttributeAI');
    }
  }

  // Set user properties for segmentation
  setupUserProperties() {
    if (!this.isInitialized) return;

    // Get measurement ID from environment
    const measurementId = process.env.REACT_APP_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';

    // Get user data from localStorage
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const authData = JSON.parse(localStorage.getItem('attributeai_auth') || '{}');

    // Set user properties for advanced segmentation
    window.gtag('config', measurementId, {
      user_id: authData.userId || 'anonymous',
      custom_map: {
        'industry': userProfile.industry || 'unknown',
        'company_size': userProfile.companySize || 'unknown',
        'subscription_tier': userProfile.subscriptionTier || 'free',
        'primary_goals': userProfile.primaryGoals?.join(',') || 'unknown'
      }
    });
  }

  // Track page views with enhanced context
  trackPageView(pageName, pageCategory = 'platform') {
    if (!this.isInitialized) return;

    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_category: pageCategory,
      engagement_time_msec: Date.now()
    });

    console.log(`📊 GA4: Page view - ${pageName}`);
  }

  // Track tool usage across your 8 marketing intelligence tools
  trackToolUsage(toolName, action, details = {}) {
    if (!this.isInitialized) return;

    window.gtag('event', 'tool_usage', {
      event_category: 'platform_engagement',
      tool_name: toolName,
      action: action,
      subscription_tier: this.subscriptionTier,
      ...details
    });

    // Also track as custom event for detailed analysis
    window.gtag('event', `${toolName}_${action}`, {
      event_category: 'tool_specific',
      event_label: toolName,
      value: 1,
      custom_parameter_1: toolName,
      custom_parameter_2: this.subscriptionTier,
      custom_parameter_3: action
    });

    console.log(`🔧 GA4: Tool usage - ${toolName}: ${action}`);
  }

  // Track AI interactions (crucial for your platform)
  trackAIInteraction(aiModel, interactionType, inputLength = 0, responseTime = 0) {
    if (!this.isInitialized) return;

    window.gtag('event', 'ai_interaction', {
      event_category: 'ai_engagement',
      ai_model: aiModel, // claude, gpt4, gemini
      interaction_type: interactionType, // analysis, generation, chat
      input_length: inputLength,
      response_time_ms: responseTime,
      subscription_tier: this.subscriptionTier
    });

    console.log(`🤖 GA4: AI interaction - ${aiModel}: ${interactionType}`);
  }

  // Track keyword research (major competitive advantage)
  trackKeywordResearch(keywordCount, analysisType, unlimited = true) {
    if (!this.isInitialized) return;

    window.gtag('event', 'keyword_research', {
      event_category: 'competitive_advantage',
      keyword_count: keywordCount,
      analysis_type: analysisType,
      unlimited_research: unlimited,
      vs_keywords_everywhere: true, // Track competitive advantage
      subscription_tier: this.subscriptionTier
    });

    console.log(`🔍 GA4: Keyword research - ${keywordCount} keywords (${analysisType})`);
  }

  // Track content generation (another major feature)
  trackContentGeneration(contentType, wordCount, aiModelsUsed = []) {
    if (!this.isInitialized) return;

    window.gtag('event', 'content_generation', {
      event_category: 'content_creation',
      content_type: contentType,
      word_count: wordCount,
      ai_models_used: aiModelsUsed.join(','),
      unlimited_generation: true,
      subscription_tier: this.subscriptionTier
    });

    console.log(`✍️ GA4: Content generated - ${contentType} (${wordCount} words)`);
  }

  // Track attribution analysis (core platform feature)
  trackAttributionAnalysis(attributionModel, touchpointCount, conversionValue = 0) {
    if (!this.isInitialized) return;

    window.gtag('event', 'attribution_analysis', {
      event_category: 'attribution_intelligence',
      attribution_model: attributionModel,
      touchpoint_count: touchpointCount,
      conversion_value: conversionValue,
      unique_feature: true, // Competitive differentiator
      subscription_tier: this.subscriptionTier
    });

    console.log(`📊 GA4: Attribution analysis - ${attributionModel} model`);
  }

  // Track subscription events (crucial for SaaS)
  trackSubscriptionEvent(eventType, tier, value = 0) {
    if (!this.isInitialized) return;

    // Track as both event and conversion
    window.gtag('event', 'subscription_event', {
      event_category: 'subscription',
      event_type: eventType, // signup, upgrade, downgrade, cancel
      subscription_tier: tier,
      currency: 'USD',
      value: value
    });

    // Track as conversion for optimization
    if (['signup', 'upgrade'].includes(eventType)) {
      const measurementId = process.env.REACT_APP_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';
      window.gtag('event', 'conversion', {
        send_to: `${measurementId}/subscription_conversion`,
        value: value,
        currency: 'USD',
        transaction_id: `sub_${Date.now()}`
      });
    }

    this.subscriptionTier = tier;
    console.log(`💰 GA4: Subscription ${eventType} - ${tier} tier`);
  }

  // Track competitor comparisons (market positioning)
  trackCompetitorComparison(competitorName, ourAdvantage, userAction) {
    if (!this.isInitialized) return;

    window.gtag('event', 'competitor_comparison', {
      event_category: 'competitive_intelligence',
      competitor: competitorName,
      our_advantage: ourAdvantage,
      user_action: userAction, // viewed, clicked, converted
      subscription_tier: this.subscriptionTier
    });

    console.log(`⚔️ GA4: Competitor comparison - ${competitorName}`);
  }

  // Track feature adoption across your platform
  trackFeatureAdoption(featureName, adopted = true, timeToAdoption = 0) {
    if (!this.isInitialized) return;

    window.gtag('event', 'feature_adoption', {
      event_category: 'product_engagement',
      feature_name: featureName,
      adopted: adopted,
      time_to_adoption_seconds: timeToAdoption,
      subscription_tier: this.subscriptionTier
    });

    console.log(`🚀 GA4: Feature ${adopted ? 'adopted' : 'viewed'} - ${featureName}`);
  }

  // Track export/download events
  trackExport(exportType, format, itemCount = 0) {
    if (!this.isInitialized) return;

    window.gtag('event', 'export_data', {
      event_category: 'data_export',
      export_type: exportType, // analysis, content, keywords, attribution
      format: format, // csv, json, pdf, html
      item_count: itemCount,
      subscription_tier: this.subscriptionTier
    });

    console.log(`📥 GA4: Export ${exportType} as ${format}`);
  }

  // Track performance metrics (for optimization)
  trackPerformance(metric, value, context = {}) {
    if (!this.isInitialized) return;

    window.gtag('event', 'performance_metric', {
      event_category: 'platform_performance',
      metric_name: metric,
      metric_value: value,
      ...context
    });

    console.log(`⚡ GA4: Performance - ${metric}: ${value}`);
  }

  // Track errors for debugging
  trackError(errorType, errorMessage, component = 'unknown') {
    if (!this.isInitialized) return;

    window.gtag('event', 'platform_error', {
      event_category: 'error_tracking',
      error_type: errorType,
      error_message: errorMessage.substring(0, 100), // Limit length
      component: component,
      subscription_tier: this.subscriptionTier
    });

    console.log(`❌ GA4: Error tracked - ${errorType} in ${component}`);
  }

  // Set user ID for cross-session tracking
  setUserId(userId, subscriptionTier = 'free') {
    if (!this.isInitialized) return;

    const measurementId = process.env.REACT_APP_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';
    this.userId = userId;
    this.subscriptionTier = subscriptionTier;

    window.gtag('config', measurementId, {
      user_id: userId,
      subscription_tier: subscriptionTier
    });

    console.log(`👤 GA4: User ID set - ${userId} (${subscriptionTier})`);
  }

  // Track campaign attribution (for your marketing efforts)
  trackCampaignAttribution(source, medium, campaign, term = '', content = '') {
    if (!this.isInitialized) return;

    window.gtag('event', 'campaign_attribution', {
      event_category: 'marketing_attribution',
      campaign_source: source,
      campaign_medium: medium,
      campaign_name: campaign,
      campaign_term: term,
      campaign_content: content
    });

    console.log(`📢 GA4: Campaign attribution - ${campaign} from ${source}`);
  }
}

// Create singleton instance
const analyticsService = new GoogleAnalyticsService();

export default analyticsService;
