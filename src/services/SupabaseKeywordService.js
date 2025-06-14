// Enhanced Keyword Intelligence Service with Supabase Integration
// Provides persistent storage and advanced analytics capabilities

import { supabase, isSupabaseConfigured } from '../lib/supabase';

class SupabaseKeywordService {
  constructor() {
    this.initialized = false;
    this.fallbackMode = false;
    this.quotaLimits = {
      free: 1000,
      professional: 10000,
      enterprise: 100000,
      agency: 1000000
    };
  }

  // Initialize service and check Supabase connection
  async initialize() {
    try {
      this.initialized = true;
      if (!isSupabaseConfigured()) {
        console.log('📝 Keyword service running in localStorage mode');
        this.fallbackMode = true;
      } else {
        console.log('✅ Keyword service connected to Supabase');
        this.fallbackMode = false;
      }
      return true;
    } catch (error) {
      console.error('❌ Keyword service initialization failed:', error);
      this.fallbackMode = true;
      return false;
    }
  }

  /**
   * Get user's keyword analysis history
   */
  async getUserKeywords(userId, options = {}) {
    try {
      if (!isSupabaseConfigured()) {
        return this.fallbackToLocalStorage('getUserKeywords', { userId, options });
      }

      const { 
        limit = 50, 
        offset = 0, 
        search, 
        intent, 
        sortBy = 'created_at', 
        sortOrder = 'desc' 
      } = options;

      let query = supabase
        .from('keyword_analyses')
        .select('*')
        .eq('user_id', userId)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      if (search) {
        query = query.ilike('keyword', `%${search}%`);
      }

      if (intent) {
        query = query.eq('intent', intent);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Database error:', error);
        return this.fallbackToLocalStorage('getUserKeywords', { userId, options });
      }

      return {
        success: true,
        data: data || [],
        total: data?.length || 0,
        hasMore: data?.length === limit
      };

    } catch (error) {
      console.error('Error fetching user keywords:', error);
      return this.fallbackToLocalStorage('getUserKeywords', { userId, options });
    }
  }

  /**
   * Store keyword analysis result
   */
  async storeKeywordAnalysis(userId, analysisData) {
    try {
      if (!isSupabaseConfigured()) {
        return this.fallbackToLocalStorage('storeKeywordAnalysis', { userId, analysisData });
      }

      const { keyword, analysis } = analysisData;
      
      const dbRecord = {
        user_id: userId,
        keyword: keyword,
        search_volume: analysis.searchVolume,
        difficulty: analysis.difficulty,
        cpc: parseFloat(analysis.cpc),
        competition: analysis.competition,
        intent: analysis.intent,
        claude_insights: analysis.claudeInsights,
        gpt4_insights: analysis.gpt4Insights,
        gemini_insights: analysis.geminiInsights,
        attribution_potential: analysis.attributionPotential,
        content_opportunities: analysis.contentOpportunities,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('keyword_analyses')
        .insert([dbRecord])
        .select();

      if (error) {
        console.error('Database error:', error);
        return this.fallbackToLocalStorage('storeKeywordAnalysis', { userId, analysisData });
      }

      return {
        success: true,
        data: data[0],
        message: 'Keyword analysis stored successfully'
      };

    } catch (error) {
      console.error('Error storing keyword analysis:', error);
      return this.fallbackToLocalStorage('storeKeywordAnalysis', { userId, analysisData });
    }
  }

  /**
   * Update user's monthly quota usage
   */
  async updateQuotaUsage(userId, amount = 1) {
    try {
      if (!isSupabaseConfigured()) {
        return this.fallbackToLocalStorage('updateQuotaUsage', { userId, amount });
      }

      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

      // Try to update existing quota record
      const { data: existingQuota, error: fetchError } = await supabase
        .from('user_quotas')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching quota:', fetchError);
        return this.fallbackToLocalStorage('updateQuotaUsage', { userId, amount });
      }

      if (existingQuota) {
        // Update existing quota
        const { data, error } = await supabase
          .from('user_quotas')
          .update({ 
            usage: existingQuota.usage + amount,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingQuota.id)
          .select();

        if (error) {
          console.error('Error updating quota:', error);
          return this.fallbackToLocalStorage('updateQuotaUsage', { userId, amount });
        }

        return {
          success: true,
          data: data[0],
          message: 'Quota updated successfully'
        };
      } else {
        // Create new quota record
        const { data, error } = await supabase
          .from('user_quotas')
          .insert([{
            user_id: userId,
            month: currentMonth,
            usage: amount,
            limit: this.quotaLimits.free, // Default to free tier
            created_at: new Date().toISOString()
          }])
          .select();

        if (error) {
          console.error('Error creating quota:', error);
          return this.fallbackToLocalStorage('updateQuotaUsage', { userId, amount });
        }

        return {
          success: true,
          data: data[0],
          message: 'Quota record created successfully'
        };
      }

    } catch (error) {
      console.error('Error updating quota usage:', error);
      return this.fallbackToLocalStorage('updateQuotaUsage', { userId, amount });
    }
  }

  /**
   * Get user's current quota status
   */
  async getQuotaStatus(userId) {
    try {
      if (!isSupabaseConfigured()) {
        return this.fallbackToLocalStorage('getQuotaStatus', { userId });
      }

      const currentMonth = new Date().toISOString().slice(0, 7);

      const { data, error } = await supabase
        .from('user_quotas')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching quota status:', error);
        return this.fallbackToLocalStorage('getQuotaStatus', { userId });
      }

      if (!data) {
        // No quota record exists, create default
        return {
          success: true,
          data: {
            usage: 0,
            limit: this.quotaLimits.free,
            remaining: this.quotaLimits.free,
            percentage: 0,
            isNearLimit: false,
            isOverLimit: false
          }
        };
      }

      const remaining = Math.max(0, data.limit - data.usage);
      const percentage = Math.round((data.usage / data.limit) * 100);

      return {
        success: true,
        data: {
          usage: data.usage,
          limit: data.limit,
          remaining: remaining,
          percentage: percentage,
          isNearLimit: percentage >= 80,
          isOverLimit: percentage >= 100,
          resetDate: new Date(data.month + '-01').toLocaleDateString()
        }
      };

    } catch (error) {
      console.error('Error getting quota status:', error);
      return this.fallbackToLocalStorage('getQuotaStatus', { userId });
    }
  }

  /**
   * Store related keywords for a main keyword
   */
  async storeRelatedKeywords(userId, mainKeyword, relatedKeywords) {
    try {
      if (!isSupabaseConfigured()) {
        return this.fallbackToLocalStorage('storeRelatedKeywords', { userId, mainKeyword, relatedKeywords });
      }

      const records = relatedKeywords.map(related => ({
        user_id: userId,
        main_keyword: mainKeyword,
        related_keyword: related.keyword,
        relevance_score: related.relevance || 85,
        search_volume: related.searchVolume || 0,
        difficulty: related.difficulty || 50,
        created_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('related_keywords')
        .insert(records)
        .select();

      if (error) {
        console.error('Database error:', error);
        return this.fallbackToLocalStorage('storeRelatedKeywords', { userId, mainKeyword, relatedKeywords });
      }

      return {
        success: true,
        data: data,
        message: 'Related keywords stored successfully'
      };

    } catch (error) {
      console.error('Error storing related keywords:', error);
      return this.fallbackToLocalStorage('storeRelatedKeywords', { userId, mainKeyword, relatedKeywords });
    }
  }

  /**
   * Get analytics data for user's keyword research
   */
  async getKeywordAnalytics(userId, timeRange = '30days') {
    try {
      if (!isSupabaseConfigured()) {
        return this.fallbackToLocalStorage('getKeywordAnalytics', { userId, timeRange });
      }

      const daysAgo = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data, error } = await supabase
        .from('keyword_analyses')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString());

      if (error) {
        console.error('Database error:', error);
        return this.fallbackToLocalStorage('getKeywordAnalytics', { userId, timeRange });
      }

      // Process analytics
      const analytics = this.processKeywordAnalytics(data || []);

      return {
        success: true,
        data: analytics,
        timeRange: timeRange
      };

    } catch (error) {
      console.error('Error getting keyword analytics:', error);
      return this.fallbackToLocalStorage('getKeywordAnalytics', { userId, timeRange });
    }
  }

  /**
   * Process raw keyword data into analytics insights
   */
  processKeywordAnalytics(keywordData) {
    if (!keywordData || keywordData.length === 0) {
      return {
        totalKeywords: 0,
        avgSearchVolume: 0,
        avgDifficulty: 0,
        intentDistribution: {},
        topOpportunities: [],
        performanceMetrics: {}
      };
    }

    const totalKeywords = keywordData.length;
    const avgSearchVolume = Math.round(
      keywordData.reduce((sum, k) => sum + (k.search_volume || 0), 0) / totalKeywords
    );
    const avgDifficulty = Math.round(
      keywordData.reduce((sum, k) => sum + (k.difficulty || 0), 0) / totalKeywords
    );

    // Intent distribution
    const intentDistribution = keywordData.reduce((acc, k) => {
      acc[k.intent] = (acc[k.intent] || 0) + 1;
      return acc;
    }, {});

    // Top opportunities (high volume, low difficulty)
    const topOpportunities = keywordData
      .filter(k => k.search_volume > avgSearchVolume && k.difficulty < avgDifficulty)
      .sort((a, b) => (b.search_volume - b.difficulty) - (a.search_volume - a.difficulty))
      .slice(0, 10)
      .map(k => ({
        keyword: k.keyword,
        searchVolume: k.search_volume,
        difficulty: k.difficulty,
        opportunityScore: Math.round(k.search_volume / k.difficulty)
      }));

    return {
      totalKeywords,
      avgSearchVolume,
      avgDifficulty,
      intentDistribution,
      topOpportunities,
      performanceMetrics: {
        highVolumeKeywords: keywordData.filter(k => k.search_volume > 10000).length,
        lowDifficultyKeywords: keywordData.filter(k => k.difficulty < 30).length,
        commercialKeywords: keywordData.filter(k => k.intent === 'Commercial').length
      }
    };
  }

  /**
   * Fallback to localStorage when Supabase is not available
   */
  fallbackToLocalStorage(method, params) {
    console.log(`📝 Using localStorage fallback for ${method}`);
    
    const storageKey = `attributeai_${method}_${params.userId || 'default'}`;
    
    try {
      switch (method) {
        case 'getUserKeywords':
          const storedKeywords = localStorage.getItem(storageKey) || '[]';
          const keywords = JSON.parse(storedKeywords);
          return {
            success: true,
            data: keywords,
            total: keywords.length,
            source: 'localStorage'
          };

        case 'storeKeywordAnalysis':
          const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
          existing.push({
            ...params.analysisData,
            id: Date.now(),
            created_at: new Date().toISOString()
          });
          localStorage.setItem(storageKey, JSON.stringify(existing));
          return {
            success: true,
            data: existing[existing.length - 1],
            source: 'localStorage'
          };

        case 'getQuotaStatus':
          const quotaKey = `attributeai_quota_${params.userId}`;
          const quotaData = JSON.parse(localStorage.getItem(quotaKey) || '{"usage": 0, "limit": 1000}');
          return {
            success: true,
            data: {
              ...quotaData,
              remaining: Math.max(0, quotaData.limit - quotaData.usage),
              percentage: Math.round((quotaData.usage / quotaData.limit) * 100),
              isNearLimit: (quotaData.usage / quotaData.limit) >= 0.8,
              isOverLimit: (quotaData.usage / quotaData.limit) >= 1.0
            },
            source: 'localStorage'
          };

        case 'updateQuotaUsage':
          const currentQuotaKey = `attributeai_quota_${params.userId}`;
          const currentQuota = JSON.parse(localStorage.getItem(currentQuotaKey) || '{"usage": 0, "limit": 1000}');
          currentQuota.usage += params.amount;
          localStorage.setItem(currentQuotaKey, JSON.stringify(currentQuota));
          return {
            success: true,
            data: currentQuota,
            source: 'localStorage'
          };

        default:
          return {
            success: false,
            error: `Method ${method} not implemented in localStorage fallback`,
            source: 'localStorage'
          };
      }
    } catch (error) {
      console.error(`localStorage fallback error for ${method}:`, error);
      return {
        success: false,
        error: error.message,
        source: 'localStorage'
      };
    }
  }

  // Data generation helpers (same as original service)
  generateSearchVolume(keyword) {
    const baseVolume = Math.random() * 50000;
    const lengthFactor = Math.max(0.3, 1 - (keyword.length / 50));
    const brandFactor = keyword.includes('software') || keyword.includes('tool') ? 1.5 : 1;
    return Math.floor(baseVolume * lengthFactor * brandFactor) + 100;
  }

  generateDifficulty(keyword) {
    const competitiveTerms = ['best', 'top', 'review', 'comparison', 'vs'];
    const hasCompetitiveTerm = competitiveTerms.some(term => keyword.toLowerCase().includes(term));
    const baseDifficulty = Math.random() * 100;
    return Math.floor(hasCompetitiveTerm ? baseDifficulty * 0.8 + 20 : baseDifficulty);
  }

  generateCPC(keyword) {
    const commercialTerms = ['buy', 'price', 'cost', 'software', 'tool', 'service'];
    const isCommercial = commercialTerms.some(term => keyword.toLowerCase().includes(term));
    const baseCPC = Math.random() * 8;
    return (isCommercial ? baseCPC + 2 : baseCPC).toFixed(2);
  }

  generateCompetition() {
    const levels = ['Low', 'Medium', 'High'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  determineIntent(keyword) {
    const patterns = {
      'Transactional': ['buy', 'purchase', 'order', 'price', 'cost', 'cheap', 'discount'],
      'Commercial': ['best', 'top', 'review', 'comparison', 'vs', 'alternative'],
      'Informational': ['how', 'what', 'why', 'guide', 'tutorial', 'learn'],
      'Navigational': ['login', 'sign in', 'website', 'official']
    };

    for (const [intent, keywords] of Object.entries(patterns)) {
      if (keywords.some(word => keyword.toLowerCase().includes(word))) {
        return intent;
      }
    }
    
    return 'Informational';
  }
}

// Create singleton instance
const supabaseKeywordService = new SupabaseKeywordService();

export default supabaseKeywordService;
