// Phase 2 - React Hook for Claude AI Integration
import { useState, useCallback } from 'react';
import claudeService from './ClaudeService';

export const useClaudeAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastAnalysis, setLastAnalysis] = useState(null);

  const analyzeWithClaude = useCallback(async (analysisType, data, context = {}) => {
    if (!claudeService.isReady()) {
      setError('Claude AI service not available. Please check your API key.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await claudeService.analyzeData(analysisType, data, context);
      setLastAnalysis(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const isReady = claudeService.isReady();

  return {
    analyzeWithClaude,
    loading,
    error,
    lastAnalysis,
    isReady
  };
};

// Quick analysis functions for common use cases
export const useQuickAnalysis = () => {
  const { analyzeWithClaude, loading, error } = useClaudeAnalysis();

  const analyzeSEO = useCallback((seoData) => {
    return analyzeWithClaude('seo_analysis', seoData);
  }, [analyzeWithClaude]);

  const analyzeContent = useCallback((contentData) => {
    return analyzeWithClaude('content_strategy', contentData);
  }, [analyzeWithClaude]);

  const analyzeLeadMagnets = useCallback((leadData) => {
    return analyzeWithClaude('lead_magnet_optimization', leadData);
  }, [analyzeWithClaude]);

  const analyzeCRO = useCallback((croData) => {
    return analyzeWithClaude('cro_analysis', croData);
  }, [analyzeWithClaude]);

  const analyzeAttribution = useCallback((attributionData) => {
    return analyzeWithClaude('attribution_analysis', attributionData);
  }, [analyzeWithClaude]);

  return {
    analyzeSEO,
    analyzeContent,
    analyzeLeadMagnets,
    analyzeCRO,
    analyzeAttribution,
    loading,
    error
  };
};