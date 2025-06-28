// React Hook for AttributeAI Analytics Integration
import { useEffect, useCallback, useRef } from 'react';
import tracker from '../utils/EnhancedConversionTracker';

export const useAttributeAITracking = () => {
  const componentMountTime = useRef(Date.now());

  // Track component usage
  const trackComponentView = useCallback((componentName) => {
    tracker.trackEvent('component_view', {
      component: componentName,
      timestamp: Date.now()
    });
  }, []);

  // Track tool interactions
  const trackToolUsage = useCallback((toolName, action = 'used', metadata = {}) => {
    tracker.trackToolInteraction(toolName, action);
    
    // Additional GA4 tracking
    if (window.gtag) {
      window.gtag('event', 'tool_interaction', {
        tool_name: toolName,
        action: action,
        component_time: Date.now() - componentMountTime.current,
        ...metadata
      });
    }
  }, []);

  // Track user engagement
  const trackEngagement = useCallback((action, data = {}) => {
    tracker.trackEvent('user_engagement', {
      action: action,
      component_time: Date.now() - componentMountTime.current,
      ...data
    });
  }, []);

  // Track conversion events
  const trackConversion = useCallback((conversionType, value = 0, metadata = {}) => {
    tracker.trackFunnelStep('conversion', {
      conversion_type: conversionType,
      value: value,
      ...metadata
    });

    if (window.gtag) {
      window.gtag('event', 'conversion', {
        conversion_type: conversionType,
        value: value,
        currency: 'USD',
        ...metadata
      });
    }
  }, []);

  // Track form interactions
  const trackFormInteraction = useCallback((formName, action, fieldName = null) => {
    tracker.trackEvent('form_interaction', {
      form_name: formName,
      action: action, // 'view', 'start', 'complete', 'abandon'
      field_name: fieldName,
      timestamp: Date.now()
    });
  }, []);

  // Track button clicks
  const trackButtonClick = useCallback((buttonName, context = '') => {
    tracker.trackEvent('button_click', {
      button_name: buttonName,
      context: context,
      page: window.location.pathname
    });
  }, []);

  // Track search/analysis actions
  const trackAnalysis = useCallback((analysisType, inputData, resultData) => {
    tracker.trackEvent('analysis_performed', {
      analysis_type: analysisType,
      input_count: inputData?.length || 0,
      result_count: resultData?.length || 0,
      processing_time: resultData?.processingTime || 0
    });
  }, []);

  // Track errors
  const trackError = useCallback((errorType, errorMessage, context = {}) => {
    tracker.trackEvent('error_encountered', {
      error_type: errorType,
      error_message: errorMessage,
      page: window.location.pathname,
      ...context
    });

    // Also track in Hotjar
    if (window.hj) {
      window.hj('event', 'error_encountered');
    }
  }, []);

  return {
    trackComponentView,
    trackToolUsage,
    trackEngagement,
    trackConversion,
    trackFormInteraction,
    trackButtonClick,
    trackAnalysis,
    trackError,
    tracker // Direct access to tracker instance
  };
};

// Specific hooks for AttributeAI components
export const useKeywordTracking = () => {
  const { trackAnalysis, trackEngagement } = useAttributeAITracking();

  const trackKeywordAnalysis = useCallback((keywords, results) => {
    tracker.trackKeywordAnalysis(keywords.length, 'bulk_analysis');
    trackAnalysis('keyword_analysis', keywords, results);
  }, [trackAnalysis]);

  const trackKeywordExport = useCallback((format, count) => {
    trackEngagement('keyword_export', {
      format: format,
      keyword_count: count
    });
  }, [trackEngagement]);

  return {
    trackKeywordAnalysis,
    trackKeywordExport
  };
};

export const useContentTracking = () => {
  const { trackAnalysis, trackEngagement } = useAttributeAITracking();

  const trackContentGeneration = useCallback((contentType, wordCount, aiModel) => {
    tracker.trackContentGeneration(contentType, wordCount);
    trackAnalysis('content_generation', { type: contentType, model: aiModel }, { wordCount });
  }, [trackAnalysis]);

  const trackContentExport = useCallback((format, contentType) => {
    trackEngagement('content_export', {
      format: format,
      content_type: contentType
    });
  }, [trackEngagement]);

  return {
    trackContentGeneration,
    trackContentExport
  };
};

export const useSignupTracking = () => {
  const { trackFormInteraction, trackConversion } = useAttributeAITracking();

  const trackSignupStart = useCallback(() => {
    tracker.trackSignupIntention();
    trackFormInteraction('signup', 'start');
  }, [trackFormInteraction]);

  const trackSignupFormView = useCallback(() => {
    tracker.trackSignupFormView();
    trackFormInteraction('signup', 'view');
  }, [trackFormInteraction]);

  const trackEmailEntry = useCallback((email) => {
    tracker.trackEmailEntered(email);
    trackFormInteraction('signup', 'email_entered', 'email');
  }, [trackFormInteraction]);

  const trackSignupComplete = useCallback((userId, method) => {
    tracker.trackSignupSuccess(userId, method);
    trackConversion('signup', 47, { method, user_id: userId });
  }, [trackConversion]);

  return {
    trackSignupStart,
    trackSignupFormView,
    trackEmailEntry,
    trackSignupComplete
  };
};

// Attribution specific tracking
export const useAttributionTracking = () => {
  const { trackEngagement } = useAttributeAITracking();

  const trackAttributionQuery = useCallback((queryType, channels, timeframe) => {
    trackEngagement('attribution_query', {
      query_type: queryType,
      channels_count: channels?.length || 0,
      timeframe: timeframe
    });
  }, [trackEngagement]);

  const trackReportGeneration = useCallback((reportType, dataPoints) => {
    trackEngagement('report_generation', {
      report_type: reportType,
      data_points: dataPoints
    });
  }, [trackEngagement]);

  return {
    trackAttributionQuery,
    trackReportGeneration
  };
};
