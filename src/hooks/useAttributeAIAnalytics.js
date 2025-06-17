// React Hook for AttributeAI Analytics Integration
import { useEffect, useCallback, useRef } from 'react';
import analyticsInstance from '../utils/AttributeAIAnalytics';

export const useAttributeAIAnalytics = (componentName = 'unknown') => {
  const componentMountTime = useRef(Date.now());
  const toolStartTime = useRef(null);

  // Track component mount (page view)
  useEffect(() => {
    analyticsInstance.trackPageView(componentName);
    analyticsInstance.trackFeatureDiscovery(componentName, 'component_load');

    // Track exit intent on component unmount
    return () => {
      const timeSpent = Date.now() - componentMountTime.current;
      if (timeSpent < 5000) { // Less than 5 seconds = potential bounce
        analyticsInstance.trackDropOff(componentName, 'quick_exit', {
          timeSpent: timeSpent,
          lastAction: 'component_unmount'
        });
      }
    };
  }, [componentName]);

  // Feature interaction tracking
  const trackFeatureClick = useCallback((featureName, data = {}) => {
    analyticsInstance.trackFeatureDiscovery(featureName, 'user_click');
    console.log(`🎯 Feature clicked: ${featureName}`);
  }, []);

  const trackButtonClick = useCallback((buttonName, location = componentName) => {
    analyticsInstance.trackFunnelStep('ui_interaction', {
      'interaction_type': 'button_click',
      'button_name': buttonName,
      'component_location': location,
      'session_duration': analyticsInstance.getSessionDuration()
    });
  }, [componentName]);

  // Tool usage tracking
  const trackToolStart = useCallback((toolName, data = {}) => {
    toolStartTime.current = Date.now();
    analyticsInstance.trackToolUsage(toolName, 'started', {
      'start_location': componentName,
      'user_segment': analyticsInstance.getUserSegment(),
      ...data
    });
    console.log(`🔧 Tool started: ${toolName}`);
  }, [componentName]);

  const trackToolProgress = useCallback((toolName, progressData = {}) => {
    const duration = toolStartTime.current ? Date.now() - toolStartTime.current : 0;
    analyticsInstance.trackToolUsage(toolName, 'progress', {
      'duration': Math.floor(duration / 1000),
      'progress_point': progressData.step || 'unknown',
      'completion_percentage': progressData.percentage || 0,
      ...progressData
    });
  }, []);

  const trackToolComplete = useCallback((toolName, results = {}) => {
    const duration = toolStartTime.current ? Date.now() - toolStartTime.current : 0;
    analyticsInstance.trackToolUsage(toolName, 'completed', {
      'duration': Math.floor(duration / 1000),
      'success': true,
      'results_quality': results.quality || 'unknown',
      ...results
    });
    console.log(`✅ Tool completed: ${toolName}`, results);
  }, []);

  const trackToolError = useCallback((toolName, error, data = {}) => {
    const duration = toolStartTime.current ? Date.now() - toolStartTime.current : 0;
    analyticsInstance.trackToolUsage(toolName, 'error', {
      'duration': Math.floor(duration / 1000),
      'error': true,
      'error_type': error.type || 'unknown',
      'error_message': error.message || 'unknown',
      ...data
    });
    console.log(`❌ Tool error: ${toolName}`, error);
  }, []);

  // AI Chat tracking
  const trackChatStart = useCallback(() => {
    analyticsInstance.trackAIChatEngagement('started', {
      'start_location': componentName,
      'user_segment': analyticsInstance.getUserSegment()
    });
  }, [componentName]);

  const trackChatMessage = useCallback((messageData = {}) => {
    analyticsInstance.trackAIChatEngagement('message_sent', {
      'message_length': messageData.length || 0,
      'message_type': messageData.type || 'text',
      'conversation_turn': messageData.turn || 1,
      'intent': messageData.intent || 'unknown'
    });
  }, []);

  const trackChatResponse = useCallback((responseData = {}) => {
    analyticsInstance.trackAIChatEngagement('response_received', {
      'response_length': responseData.length || 0,
      'response_time': responseData.responseTime || 0,
      'ai_model': responseData.aiModel || 'claude',
      'response_quality': responseData.quality || 'unknown'
    });
  }, []);

  // Conversion tracking
  const trackConversion = useCallback((conversionType, data = {}) => {
    analyticsInstance.trackConversion(conversionType, {
      'conversion_location': componentName,
      'tools_used_before': analyticsInstance.getToolsUsed(),
      'session_duration_at_conversion': analyticsInstance.getSessionDuration(),
      ...data
    });
    console.log(`🎉 Conversion: ${conversionType}`, data);
  }, [componentName]);

  // Specific AttributeAI feature tracking
  const trackKeywordAnalysis = useCallback((action, data = {}) => {
    analyticsInstance.trackKeywordResearch(action, data);
  }, []);

  const trackContentGeneration = useCallback((action, data = {}) => {
    analyticsInstance.trackContentGeneration(action, data);
  }, []);

  const trackAttributionAnalysis = useCallback((action, data = {}) => {
    analyticsInstance.trackAttributionAnalysis(action, data);
  }, []);

  const trackSEOAnalysis = useCallback((action, data = {}) => {
    analyticsInstance.trackSEOAnalysis(action, data);
  }, []);

  // Export and value realization tracking
  const trackExport = useCallback((exportType, data = {}) => {
    analyticsInstance.trackFunnelStep('value_realization', {
      'realization_type': 'export',
      'export_format': exportType,
      'data_size': data.size || 0,
      'export_location': componentName,
      'user_segment': analyticsInstance.getUserSegment()
    });
    console.log(`📤 Export: ${exportType}`, data);
  }, [componentName]);

  // Form and input tracking
  const trackFormSubmit = useCallback((formName, data = {}) => {
    analyticsInstance.trackFunnelStep('form_submission', {
      'form_name': formName,
      'form_location': componentName,
      'fields_completed': data.fieldsCompleted || 0,
      'validation_errors': data.errors || 0,
      'success': data.success || false
    });
  }, [componentName]);

  // Error and issue tracking
  const trackError = useCallback((errorType, errorDetails = {}) => {
    analyticsInstance.trackFunnelStep('error_encountered', {
      'error_type': errorType,
      'error_location': componentName,
      'error_message': errorDetails.message || 'unknown',
      'user_action': errorDetails.userAction || 'unknown',
      'recovery_attempted': errorDetails.recoveryAttempted || false
    });
  }, [componentName]);

  // Performance tracking
  const trackPerformance = useCallback((metricName, value, unit = 'ms') => {
    analyticsInstance.trackFunnelStep('performance_metric', {
      'metric_name': metricName,
      'metric_value': value,
      'metric_unit': unit,
      'component_location': componentName,
      'user_segment': analyticsInstance.getUserSegment()
    });
  }, [componentName]);

  // Return all tracking functions
  return {
    // Basic tracking
    trackFeatureClick,
    trackButtonClick,
    
    // Tool tracking
    trackToolStart,
    trackToolProgress,
    trackToolComplete,
    trackToolError,
    
    // Chat tracking
    trackChatStart,
    trackChatMessage,
    trackChatResponse,
    
    // Conversion tracking
    trackConversion,
    
    // Feature-specific tracking
    trackKeywordAnalysis,
    trackContentGeneration,
    trackAttributionAnalysis,
    trackSEOAnalysis,
    
    // Value realization
    trackExport,
    trackFormSubmit,
    
    // Error and performance
    trackError,
    trackPerformance,
    
    // Direct access to analytics instance
    analytics: analyticsInstance
  };
};