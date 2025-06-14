import { useEffect, useCallback } from 'react';
import analyticsService from '../services/GoogleAnalyticsService';

// Custom hook for Google Analytics integration
export const useAnalytics = () => {
  
  // Track page views automatically
  const trackPage = useCallback((pageName, category = 'platform') => {
    analyticsService.trackPageView(pageName, category);
  }, []);

  // Track tool usage across your 8 marketing intelligence tools
  const trackTool = useCallback((toolName, action, details = {}) => {
    analyticsService.trackToolUsage(toolName, action, details);
  }, []);

  // Track AI interactions (crucial for your platform)
  const trackAI = useCallback((aiModel, interactionType, inputLength = 0, responseTime = 0) => {
    analyticsService.trackAIInteraction(aiModel, interactionType, inputLength, responseTime);
  }, []);

  // Track keyword research (competitive advantage)
  const trackKeywords = useCallback((keywordCount, analysisType, unlimited = true) => {
    analyticsService.trackKeywordResearch(keywordCount, analysisType, unlimited);
  }, []);

  // Track content generation
  const trackContent = useCallback((contentType, wordCount, aiModelsUsed = []) => {
    analyticsService.trackContentGeneration(contentType, wordCount, aiModelsUsed);
  }, []);

  // Track attribution analysis
  const trackAttribution = useCallback((attributionModel, touchpointCount, conversionValue = 0) => {
    analyticsService.trackAttributionAnalysis(attributionModel, touchpointCount, conversionValue);
  }, []);

  // Track subscription events
  const trackSubscription = useCallback((eventType, tier, value = 0) => {
    analyticsService.trackSubscriptionEvent(eventType, tier, value);
  }, []);

  // Track competitor comparisons
  const trackCompetitor = useCallback((competitorName, ourAdvantage, userAction) => {
    analyticsService.trackCompetitorComparison(competitorName, ourAdvantage, userAction);
  }, []);

  // Track feature adoption
  const trackFeature = useCallback((featureName, adopted = true, timeToAdoption = 0) => {
    analyticsService.trackFeatureAdoption(featureName, adopted, timeToAdoption);
  }, []);

  // Track exports
  const trackExport = useCallback((exportType, format, itemCount = 0) => {
    analyticsService.trackExport(exportType, format, itemCount);
  }, []);

  // Track performance metrics
  const trackPerformance = useCallback((metric, value, context = {}) => {
    analyticsService.trackPerformance(metric, value, context);
  }, []);

  // Track errors
  const trackError = useCallback((errorType, errorMessage, component = 'unknown') => {
    analyticsService.trackError(errorType, errorMessage, component);
  }, []);

  // Set user identification
  const setUser = useCallback((userId, subscriptionTier = 'free') => {
    analyticsService.setUserId(userId, subscriptionTier);
  }, []);

  // Track campaign attribution
  const trackCampaign = useCallback((source, medium, campaign, term = '', content = '') => {
    analyticsService.trackCampaignAttribution(source, medium, campaign, term, content);
  }, []);

  return {
    trackPage,
    trackTool,
    trackAI,
    trackKeywords,
    trackContent,
    trackAttribution,
    trackSubscription,
    trackCompetitor,
    trackFeature,
    trackExport,
    trackPerformance,
    trackError,
    setUser,
    trackCampaign,
    analyticsService
  };
};

// Higher-order component for automatic page tracking
export const withAnalytics = (WrappedComponent, pageName, pageCategory = 'platform') => {
  return function AnalyticsWrappedComponent(props) {
    const { trackPage } = useAnalytics();

    useEffect(() => {
      trackPage(pageName, pageCategory);
    }, [trackPage]);

    return <WrappedComponent {...props} />;
  };
};

export default useAnalytics;
