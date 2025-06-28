// Enhanced integration example for KeywordIntelligenceEngine
// Add this at the top of your KeywordIntelligenceEngine.js

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, TrendingUp, Target, Brain, Zap, BarChart3, 
  Globe, Users, DollarSign, Award, AlertCircle, CheckCircle,
  Download, Filter, RefreshCw, Lightbulb, ArrowRight,
  Cpu, Eye, Clock, Star, Database, Wifi, WifiOff, Crown
} from 'lucide-react';
import { Card, Button, ProgressIndicator } from './ui/DesignSystem';

// NEW: Enhanced tracking imports
import { useAttributeAITracking, useKeywordTracking } from '../hooks/useAttributeAITracking';
import { useUsageLimits } from '../hooks/useUsageLimits';
import { useAuth } from './auth/AuthContext';

const KeywordIntelligenceEngine = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitReached, setLimitReached] = useState(null);
  
  // Authentication and limits
  const { user, isAuthenticated } = useAuth();
  const { checkLimit, incrementUsage, subscriptionTier, getUpgradeRecommendation } = useUsageLimits();
  
  // NEW: Enhanced tracking hooks
  const { 
    trackComponentView, 
    trackToolUsage, 
    trackEngagement, 
    trackButtonClick,
    trackError 
  } = useAttributeAITracking();
  
  const { 
    trackKeywordAnalysis, 
    trackKeywordExport 
  } = useKeywordTracking();

  // Track component mount
  useEffect(() => {
    trackComponentView('keyword_intelligence_engine');
    trackToolUsage('keyword_intelligence', 'view');
  }, [trackComponentView, trackToolUsage]);

  // Enhanced keyword analysis with comprehensive tracking
  const analyzeKeyword = async (keyword) => {
    if (!keyword.trim()) return;
    
    const startTime = Date.now();
    
    try {
      // Track analysis start
      trackToolUsage('keyword_intelligence', 'analysis_started', {
        keyword: keyword,
        user_authenticated: isAuthenticated
      });
      
      // Check authentication
      if (!isAuthenticated) {
        trackEngagement('signup_prompt_shown', { 
          trigger: 'keyword_analysis',
          keyword_length: keyword.length 
        });
        setShowSignupModal(true);
        return;
      }
      
      // Check usage limits
      const keywordLimit = checkLimit('keywords_analyzed');
      if (!keywordLimit.allowed) {
        trackEngagement('usage_limit_reached', {
          limit_type: 'keywords_analyzed',
          current_tier: subscriptionTier
        });
        setLimitReached({
          type: 'keywords_analyzed',
          current: keywordLimit.current,
          limit: keywordLimit.limit,
          upgrade: getUpgradeRecommendation('keywords_analyzed')
        });
        setShowLimitModal(true);
        return;
      }
      
      setIsAnalyzing(true);
      
      // Perform analysis (your existing logic)
      const analysisResults = await performKeywordAnalysis(keyword);
      
      // Track successful analysis
      const processingTime = Date.now() - startTime;
      trackKeywordAnalysis([keyword], {
        ...analysisResults,
        processingTime
      });
      
      trackToolUsage('keyword_intelligence', 'analysis_completed', {
        keyword: keyword,
        processing_time: processingTime,
        results_count: analysisResults?.relatedKeywords?.length || 0
      });
      
      // Increment usage
      incrementUsage('keywords_analyzed', 1);
      
      setResults(analysisResults);
      
    } catch (error) {
      // Track errors
      trackError('keyword_analysis_failed', error.message, {
        keyword: keyword,
        processing_time: Date.now() - startTime
      });
      
      console.error('Keyword analysis failed:', error);
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Enhanced export tracking
  const handleExport = (format) => {
    if (!results) return;
    
    trackKeywordExport(format, results.relatedKeywords?.length || 0);
    trackButtonClick('export_keywords', format);
    
    // Your existing export logic here
    exportResults(format);
  };

  // Track button interactions
  const handleSearchClick = () => {
    trackButtonClick('search_keywords', 'primary_cta');
    analyzeKeyword(query);
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    
    // Track search intent when user types significant query
    if (value.length > 3) {
      trackEngagement('search_intent', {
        query_length: value.length,
        has_spaces: value.includes(' ')
      });
    }
  };

  // Your existing component JSX with enhanced tracking...
  return (
    <div className="keyword-intelligence-engine">
      {/* Your existing JSX structure */}
      
      {/* Search Input with tracking */}
      <input
        type="text"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onFocus={() => trackEngagement('search_input_focused')}
        placeholder="Enter keyword to analyze..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            trackButtonClick('search_keywords', 'enter_key');
            analyzeKeyword(query);
          }
        }}
      />
      
      {/* Search Button with tracking */}
      <Button onClick={handleSearchClick}>
        Analyze Keywords
      </Button>
      
      {/* Export buttons with tracking */}
      <Button onClick={() => handleExport('csv')}>
        Export CSV
      </Button>
      <Button onClick={() => handleExport('json')}>
        Export JSON
      </Button>
      
      {/* Your existing results display */}
    </div>
  );
};

export default KeywordIntelligenceEngine;