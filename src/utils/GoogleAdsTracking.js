/**
 * Google Ads Conversion Tracking Utility
 * Tracks key conversion events for AttributeAI platform
 */

// Google Ads Conversion ID
const GOOGLE_ADS_ID = 'AW-17201839062';

// Global gtag reference
/* global gtag */

class GoogleAdsTracking {
  
  // Track sign-up conversion
  static trackSignup(planType = 'freemium', value = 0) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': `${GOOGLE_ADS_ID}/signup`,
        'value': value,
        'currency': 'USD',
        'transaction_id': this.generateTransactionId(),
        'custom_parameters': {
          'plan_type': planType,
          'source': 'AttributeAI_platform'
        }
      });
      
      console.log(`🎯 Google Ads: Signup conversion tracked - ${planType}`);
    }
  }
  
  // Track subscription purchase
  static trackPurchase(planType, amount, transactionId = null) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': `${GOOGLE_ADS_ID}/purchase`,
        'value': amount,
        'currency': 'USD',
        'transaction_id': transactionId || this.generateTransactionId(),
        'custom_parameters': {
          'plan_type': planType,
          'subscription_value': amount,
          'platform': 'AttributeAI'
        }
      });
      
      console.log(`🎯 Google Ads: Purchase conversion tracked - ${planType} ($${amount})`);
    }
  }
  
  // Track free trial start
  static trackTrialStart(planType = 'growth') {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': `${GOOGLE_ADS_ID}/trial_start`,
        'value': 0,
        'currency': 'USD',
        'custom_parameters': {
          'trial_plan': planType,
          'trial_length': '14_days'
        }
      });
      
      console.log(`🎯 Google Ads: Trial start tracked - ${planType}`);
    }
  }
  
  // Track tool usage (high-value engagement)
  static trackToolUsage(toolName, sessionLength = 0) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': `${GOOGLE_ADS_ID}/tool_engagement`,
        'value': 1,
        'currency': 'USD',
        'custom_parameters': {
          'tool_name': toolName,
          'session_length': sessionLength,
          'engagement_type': 'high_value'
        }
      });
      
      console.log(`🎯 Google Ads: Tool usage tracked - ${toolName}`);
    }
  }
  
  // Track lead generation (contact form, demo request)
  static trackLead(leadType = 'contact', value = 10) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': `${GOOGLE_ADS_ID}/lead`,
        'value': value,
        'currency': 'USD',
        'custom_parameters': {
          'lead_type': leadType,
          'lead_quality': 'qualified'
        }
      });
      
      console.log(`🎯 Google Ads: Lead conversion tracked - ${leadType}`);
    }
  }
  
  // Track content downloads (lead magnets, reports)
  static trackDownload(contentType, contentName) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': `${GOOGLE_ADS_ID}/download`,
        'value': 5,
        'currency': 'USD',
        'custom_parameters': {
          'content_type': contentType,
          'content_name': contentName
        }
      });
      
      console.log(`🎯 Google Ads: Download tracked - ${contentName}`);
    }
  }
  
  // Track video engagement
  static trackVideoEngagement(videoTitle, watchPercentage) {
    if (typeof gtag !== 'undefined' && watchPercentage >= 50) {
      gtag('event', 'conversion', {
        'send_to': `${GOOGLE_ADS_ID}/video_engagement`,
        'value': 2,
        'currency': 'USD',
        'custom_parameters': {
          'video_title': videoTitle,
          'watch_percentage': watchPercentage
        }
      });
      
      console.log(`🎯 Google Ads: Video engagement tracked - ${videoTitle} (${watchPercentage}%)`);
    }
  }
  
  // Track page engagement (time on page)
  static trackPageEngagement(pageName, timeOnPage) {
    if (typeof gtag !== 'undefined' && timeOnPage >= 120) { // 2+ minutes
      gtag('event', 'conversion', {
        'send_to': `${GOOGLE_ADS_ID}/page_engagement`,
        'value': 1,
        'currency': 'USD',
        'custom_parameters': {
          'page_name': pageName,
          'time_on_page': timeOnPage
        }
      });
      
      console.log(`🎯 Google Ads: Page engagement tracked - ${pageName} (${timeOnPage}s)`);
    }
  }
  
  // Track demo requests
  static trackDemoRequest(company = '', industry = '') {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': `${GOOGLE_ADS_ID}/demo_request`,
        'value': 25,
        'currency': 'USD',
        'custom_parameters': {
          'company': company,
          'industry': industry,
          'lead_quality': 'high_intent'
        }
      });
      
      console.log(`🎯 Google Ads: Demo request tracked - ${company}`);
    }
  }
  
  // Generate unique transaction ID
  static generateTransactionId() {
    return `attr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Track custom conversion with flexible parameters
  static trackCustomConversion(conversionName, value = 0, customParams = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': `${GOOGLE_ADS_ID}/${conversionName}`,
        'value': value,
        'currency': 'USD',
        'custom_parameters': {
          ...customParams,
          'platform': 'AttributeAI',
          'timestamp': new Date().toISOString()
        }
      });
      
      console.log(`🎯 Google Ads: Custom conversion tracked - ${conversionName}`);
    }
  }
}

export default GoogleAdsTracking;
