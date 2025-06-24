import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/auth/AuthContext';

const SUBSCRIPTION_LIMITS = {
  free: {
    keywords_per_month: 100,
    content_pieces_per_month: 5,
    attribution_queries_per_month: 50,
    features: ['basic_keyword_analysis', 'basic_content_generation', 'basic_attribution']
  },
  professional: {
    keywords_per_month: 2500,
    content_pieces_per_month: 50,
    attribution_queries_per_month: 500,
    features: ['advanced_keyword_analysis', 'unlimited_content_generation', 'advanced_attribution', 'competitor_analysis']
  },
  enterprise: {
    keywords_per_month: -1, // unlimited
    content_pieces_per_month: -1, // unlimited
    attribution_queries_per_month: -1, // unlimited
    features: ['all_features', 'priority_support', 'custom_integrations', 'white_label']
  }
};

export const useUsageLimits = () => {
  const { userProfile, updateProfile } = useAuth();
  const [usageStats, setUsageStats] = useState({
    keywords_analyzed: 0,
    content_generated: 0,
    attribution_queries: 0,
    last_reset: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get current subscription tier
  const subscriptionTier = userProfile?.subscription_tier || 'free';
  const limits = SUBSCRIPTION_LIMITS[subscriptionTier];

  // Load usage stats from user profile
  useEffect(() => {
    if (userProfile?.monthly_usage) {
      setUsageStats(userProfile.monthly_usage);
    }
  }, [userProfile]);

  // Check if current month, reset if needed
  useEffect(() => {
    const now = new Date();
    const lastReset = new Date(usageStats.last_reset);
    
    // If different month, reset usage
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      resetMonthlyUsage();
    }
  }, [usageStats.last_reset]);

  const resetMonthlyUsage = useCallback(async () => {
    const resetStats = {
      keywords_analyzed: 0,
      content_generated: 0,
      attribution_queries: 0,
      last_reset: new Date().toISOString()
    };

    setUsageStats(resetStats);
    
    if (updateProfile) {
      try {
        await updateProfile({ monthly_usage: resetStats });
      } catch (error) {
        console.error('Failed to reset monthly usage:', error);
      }
    }
  }, [updateProfile]);

  const checkLimit = useCallback((type) => {
    const current = usageStats[type] || 0;
    const limit = limits[`${type}_per_month`];
    
    // -1 means unlimited
    if (limit === -1) return { allowed: true, remaining: -1, percentage: 0 };
    
    const allowed = current < limit;
    const remaining = Math.max(0, limit - current);
    const percentage = limit > 0 ? (current / limit) * 100 : 0;
    
    return { allowed, remaining, percentage, current, limit };
  }, [usageStats, limits]);

  const incrementUsage = useCallback(async (type, amount = 1) => {
    setIsLoading(true);
    
    try {
      const newStats = {
        ...usageStats,
        [type]: (usageStats[type] || 0) + amount
      };
      
      setUsageStats(newStats);
      
      if (updateProfile) {
        await updateProfile({ monthly_usage: newStats });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to increment usage:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [usageStats, updateProfile]);

  const hasFeature = useCallback((feature) => {
    return limits.features.includes(feature) || limits.features.includes('all_features');
  }, [limits.features]);

  const getUpgradeRecommendation = useCallback(() => {
    if (subscriptionTier === 'enterprise') return null;
    
    const nextTier = subscriptionTier === 'free' ? 'professional' : 'enterprise';
    const nextLimits = SUBSCRIPTION_LIMITS[nextTier];
    
    // Check if approaching limits
    const keywordCheck = checkLimit('keywords_analyzed');
    const contentCheck = checkLimit('content_generated');
    const attributionCheck = checkLimit('attribution_queries');
    
    const approaching = [keywordCheck, contentCheck, attributionCheck].some(check => 
      check.percentage > 80 && check.limit !== -1
    );
    
    if (approaching || keywordCheck.remaining === 0 || contentCheck.remaining === 0 || attributionCheck.remaining === 0) {
      return {
        recommended: nextTier,
        benefits: nextLimits,
        reason: approaching ? 'approaching_limit' : 'limit_reached'
      };
    }
    
    return null;
  }, [subscriptionTier, checkLimit]);

  return {
    subscriptionTier,
    limits,
    usageStats,
    checkLimit,
    incrementUsage,
    hasFeature,
    getUpgradeRecommendation,
    isLoading,
    resetMonthlyUsage
  };
};