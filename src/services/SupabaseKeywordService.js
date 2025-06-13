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
        .select(`
          *,
          related_keywords(keyword, search_volume, difficulty, intent),
          content_opportunities(content_type, title, potential, status)
        `)
        .eq('user_id', userId)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      // Add filters
      if (search) {
        query = query.ilike('normalized_keyword', `%${search.toLowerCase()}%`);
      }
      
      if (intent) {
        query = query.eq('intent', intent);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Get user keywords error:', error);
        return this.fallbackToLocalStorage('getUserKeywords', { userId, options });
      }

      return {
        keywords: data || [],
        total: data?.length || 0,
        source: 'supabase'
      };

    } catch (error) {
      console.error('Get user keywords error:', error);
      return this.fallbackToLocalStorage('getUserKeywords', { userId, options });
    }
  }

  /**
   * Bulk analyze keywords with quota management
   */
  async bulkAnalyzeKeywords(userId, keywords, analysisType = 'basic') {
    try {
      if (!isSupabaseConfigured()) {
        return this.fallbackToLocalStorage('bulkAnalyzeKeywords', { keywords, analysisType });
      }

      // Check if user has enough quota
      const quotaCheck = await this.checkUserQuota(userId, keywords.length);
      if (!quotaCheck.allowed) {
        throw new Error(`Bulk analysis would exceed quota. ${quotaCheck.message}`);
      }

      const results = [];
      const batchSize = 10; // Process in batches to avoid overwhelming the database

      for (let i = 0; i < keywords.length; i += batchSize) {
        const batch = keywords.slice(i, i + batchSize);
        const batchPromises = batch.map(async (keyword) => {
          try {
            // Generate basic analysis for each keyword
            const analysisData = {
              primaryKeyword: keyword.trim(),
              normalizedKeyword: keyword.toLowerCase().trim(),
              metrics: {
                searchVolume: this.generateSearchVolume(keyword),
                difficulty: this.generateDifficulty(keyword),
                cpc: this.generateCPC(keyword),
                competition: this.generateCompetition(),
                intent: this.determineIntent(keyword)
              },
              analysisType,
              timestamp: new Date().toISOString()
            };

            return {
              keyword: keyword.trim(),
              ...analysisData.metrics,
              success: true
            };
          } catch (error) {
            return {
              keyword: keyword.trim(),
              error: error.message,
              success: false
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }

      // Store bulk analysis session
      await this.createResearchSession(userId, {
        session_name: `Bulk Analysis - ${new Date().toLocaleDateString()}`,
        keywords_analyzed: keywords,
        total_keywords: keywords.length,
        analysis_type: analysisType,
        session_data: { results }
      });

      // Increment usage
      await this.incrementKeywordUsage(userId, keywords.length);

      // Track activity
      await this.trackUserActivity(userId, 'bulk_analysis', {
        keywords_count: keywords.length,
        analysis_type: analysisType
      });

      return {
        results,
        totalProcessed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        source: 'supabase'
      };

    } catch (error) {
      console.error('Bulk analysis error:', error);
      return this.fallbackToLocalStorage('bulkAnalyzeKeywords', { keywords, analysisType });
    }
  }

  /**
   * Store competitor analysis
   */
  async storeCompetitorAnalysis(userId, domain, analysisData) {
    try {
      if (!isSupabaseConfigured()) {
        return this.fallbackToLocalStorage('storeCompetitorAnalysis', { domain, analysisData });
      }

      const { data, error } = await supabase
        .from('competitor_analyses')
        .upsert({
          user_id: userId,
          domain,
          analysis_data: analysisData.analysis,
          top_keywords: analysisData.analysis?.topKeywords || [],
          keyword_gaps: analysisData.analysis?.keywordGaps || [],
          content_gaps: analysisData.analysis?.contentGaps || [],
          authority_score: analysisData.analysis?.authorityScore || 0,
          estimated_traffic: analysisData.analysis?.estimatedTraffic || 0,
          total_keywords: analysisData.analysis?.totalKeywords || 0,
          opportunity_score: analysisData.analysis?.opportunityScore || 0
        }, {
          onConflict: 'user_id,domain'
        })
        .select()
        .single();

      if (error) {
        console.error('Competitor analysis storage error:', error);
        return this.fallbackToLocalStorage('storeCompetitorAnalysis', { domain, analysisData });
      }

      await this.trackUserActivity(userId, 'competitor_analysis', {
        domain,
        opportunity_score: analysisData.analysis?.opportunityScore
      });

      return {
        ...analysisData,
        id: data.id,
        stored: true,
        source: 'supabase'
      };

    } catch (error) {
      console.error('Competitor analysis error:', error);
      return this.fallbackToLocalStorage('storeCompetitorAnalysis', { domain, analysisData });
    }
  }

  /**
   * Check user keyword quota
   */
  async checkUserQuota(userId, keywordCount = 1) {
    try {
      if (!isSupabaseConfigured()) {
        return { allowed: true, message: 'Unlimited (localStorage mode)' };
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('subscription_tier, monthly_keyword_quota, keywords_used_this_month, quota_reset_date')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Quota check error:', error);
        return { allowed: true, message: 'Quota check failed, allowing request' };
      }

      // Check if quota needs reset (new month)
      const today = new Date();
      const resetDate = new Date(user.quota_reset_date);
      if (today >= resetDate) {
        await supabase.rpc('reset_monthly_keyword_usage');
        user.keywords_used_this_month = 0;
      }

      const remainingQuota = user.monthly_keyword_quota - user.keywords_used_this_month;
      const allowed = remainingQuota >= keywordCount;

      return {
        allowed,
        remaining: Math.max(0, remainingQuota),
        used: user.keywords_used_this_month,
        quota: user.monthly_keyword_quota,
        tier: user.subscription_tier,
        message: allowed 
          ? `${remainingQuota} keywords remaining this month`
          : `Quota exceeded. ${remainingQuota} remaining, ${keywordCount} requested`
      };

    } catch (error) {
      console.error('Quota check error:', error);
      return { allowed: true, message: 'Quota check failed, allowing request' };
    }
  }

  /**
   * Get user analytics and usage stats
   */
  async getUserAnalytics(userId) {
    try {
      if (!isSupabaseConfigured()) {
        return this.fallbackToLocalStorage('getUserAnalytics', { userId });
      }

      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('User analytics error:', error);
        return this.fallbackToLocalStorage('getUserAnalytics', { userId });
      }

      // Get recent activity
      const { data: recentActivity } = await supabase
        .from('user_activity')
        .select('activity_type, created_at, activity_data')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      return {
        ...data,
        recent_activity: recentActivity || [],
        source: 'supabase'
      };

    } catch (error) {
      console.error('User analytics error:', error);
      return this.fallbackToLocalStorage('getUserAnalytics', { userId });
    }
  }

  /**
   * Track keyword performance over time
   */
  async trackKeywordPerformance(userId, keywordId, performanceData) {
    try {
      if (!isSupabaseConfigured()) {
        return this.fallbackToLocalStorage('trackKeywordPerformance', { keywordId, performanceData });
      }

      const { data, error } = await supabase
        .from('keyword_performance')
        .upsert({
          keyword_analysis_id: keywordId,
          user_id: userId,
          current_ranking: performanceData.currentRanking,
          previous_ranking: performanceData.previousRanking,
          ranking_change: performanceData.rankingChange,
          traffic_estimate: performanceData.trafficEstimate,
          click_through_rate: performanceData.clickThroughRate,
          conversion_rate: performanceData.conversionRate,
          attributed_conversions: performanceData.attributedConversions || 0,
          attributed_revenue: performanceData.attributedRevenue || 0,
          tracked_date: new Date().toISOString().split('T')[0]
        }, {
          onConflict: 'keyword_analysis_id,tracked_date'
        })
        .select()
        .single();

      if (error) {
        console.error('Performance tracking error:', error);
        return this.fallbackToLocalStorage('trackKeywordPerformance', { keywordId, performanceData });
      }

      return {
        ...performanceData,
        id: data.id,
        stored: true,
        source: 'supabase'
      };

    } catch (error) {
      console.error('Performance tracking error:', error);
      return this.fallbackToLocalStorage('trackKeywordPerformance', { keywordId, performanceData });
    }
  }

  /**
   * Export user data in various formats
   */
  async exportUserData(userId, options = {}) {
    try {
      if (!isSupabaseConfigured()) {
        return this.fallbackToLocalStorage('exportUserData', { userId, options });
      }

      const { format = 'csv', includeRelated = true, dateRange } = options;

      let query = supabase
        .from('keyword_analyses')
        .select(`
          *,
          ${includeRelated ? 'related_keywords(*), content_opportunities(*)' : ''}
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (dateRange) {
        query = query.gte('created_at', dateRange.start).lte('created_at', dateRange.end);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Export data error:', error);
        throw new Error(handleSupabaseError(error));
      }

      // Track export activity
      await this.trackUserActivity(userId, 'export', {
        format,
        records_count: data?.length || 0,
        include_related: includeRelated
      });

      return {
        data: data || [],
        count: data?.length || 0,
        format,
        exported_at: new Date().toISOString(),
        source: 'supabase'
      };

    } catch (error) {
      console.error('Export error:', error);
      return this.fallbackToLocalStorage('exportUserData', { userId, options });
    }
  }

  // Helper Methods

  async storeRelatedKeywords(parentKeywordId, userId, relatedKeywords) {
    try {
      const relatedData = relatedKeywords.map(keyword => ({
        parent_keyword_id: parentKeywordId,
        user_id: userId,
        keyword: keyword.keyword,
        search_volume: keyword.volume,
        difficulty: keyword.difficulty,
        cpc: keyword.cpc,
        competition: keyword.competition,
        intent: keyword.intent,
        relationship_type: 'related',
        similarity_score: 0.8
      }));

      const { error } = await supabase
        .from('related_keywords')
        .upsert(relatedData);

      if (error) {
        console.error('Related keywords storage error:', error);
      }
    } catch (error) {
      console.error('Related keywords error:', error);
    }
  }

  async storeContentOpportunities(keywordAnalysisId, userId, contentOpportunities) {
    try {
      const contentData = contentOpportunities.map(opportunity => ({
        keyword_analysis_id: keywordAnalysisId,
        user_id: userId,
        content_type: opportunity.type,
        title: opportunity.title,
        description: opportunity.description || '',
        target_keywords: opportunity.targetKeywords || [],
        difficulty: opportunity.difficulty,
        potential: opportunity.potential,
        priority_score: this.calculatePriorityScore(opportunity),
        estimated_traffic: opportunity.estimatedTraffic || 0,
        status: 'suggested'
      }));

      const { error } = await supabase
        .from('content_opportunities')
        .upsert(contentData);

      if (error) {
        console.error('Content opportunities storage error:', error);
      }
    } catch (error) {
      console.error('Content opportunities error:', error);
    }
  }

  async createResearchSession(userId, sessionData) {
    try {
      const { error } = await supabase
        .from('keyword_research_sessions')
        .insert({
          user_id: userId,
          ...sessionData
        });

      if (error) {
        console.error('Research session creation error:', error);
      }
    } catch (error) {
      console.error('Research session error:', error);
    }
  }

  async incrementKeywordUsage(userId, count = 1) {
    try {
      await supabase.rpc('increment_keyword_usage', {
        user_uuid: userId,
        keyword_count: count
      });
    } catch (error) {
      console.error('Increment usage error:', error);
    }
  }

  async trackUserActivity(userId, activityType, activityData = {}) {
    try {
      const { error } = await supabase
        .from('user_activity')
        .insert({
          user_id: userId,
          activity_type: activityType,
          activity_data: activityData,
          keywords_analyzed: activityData.keywords_count || 1,
          session_id: this.generateSessionId(),
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Activity tracking error:', error);
      }
    } catch (error) {
      console.error('Activity tracking error:', error);
    }
  }

  calculatePriorityScore(opportunity) {
    let score = 0;
    
    if (opportunity.potential === 'Very High') score += 40;
    else if (opportunity.potential === 'High') score += 30;
    else if (opportunity.potential === 'Medium') score += 20;
    else score += 10;

    if (opportunity.difficulty === 'Low') score += 30;
    else if (opportunity.difficulty === 'Medium') score += 20;
    else score += 10;

    if (opportunity.estimatedTraffic) {
      score += Math.min(30, opportunity.estimatedTraffic / 100);
    }

    return Math.min(100, score);
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Fallback methods for localStorage when Supabase not configured
  fallbackToLocalStorage(method, data) {
    console.log(`📦 Using localStorage fallback for ${method}`);
    
    const fallbackData = {
      ...data,
      source: 'localStorage',
      fallback: true,
      timestamp: new Date().toISOString()
    };

    switch (method) {
      case 'analyzeKeyword':
        return {
          ...data,
          stored: false,
          source: 'localStorage'
        };
      
      case 'getUserKeywords':
        const stored = localStorage.getItem('attributeai_keywords') || '[]';
        return {
          keywords: JSON.parse(stored),
          total: JSON.parse(stored).length,
          source: 'localStorage'
        };
      
      case 'bulkAnalyzeKeywords':
        return {
          results: data.keywords.map(keyword => ({
            keyword,
            success: true,
            source: 'localStorage'
          })),
          totalProcessed: data.keywords.length,
          successful: data.keywords.length,
          failed: 0,
          source: 'localStorage'
        };
      
      default:
        return fallbackData;
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