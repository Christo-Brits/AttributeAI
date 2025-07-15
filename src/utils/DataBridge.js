// Data Bridge - Cross-Component Data Sharing System
import React from 'react';

// Enables components to share insights and create unified workflows

class DataBridge {
  constructor() {
    this.listeners = new Map();
    this.data = new Map();
    this.init();
  }

  init() {
    // Load existing data from localStorage
    this.loadFromStorage();
    
    // Set up periodic storage sync
    setInterval(() => {
      this.saveToStorage();
    }, 30000); // Save every 30 seconds
  }

  // ============================================================================
  // CORE DATA MANAGEMENT
  // ============================================================================

  setData(key, data, metadata = {}) {
    const timestamp = new Date().toISOString();
    const entry = {
      data,
      metadata: {
        ...metadata,
        timestamp,
        source: metadata.source || 'unknown'
      }
    };

    this.data.set(key, entry);
    this.notifyListeners(key, entry);
    this.saveToStorage();
  }

  getData(key) {
    return this.data.get(key);
  }

  getAllData() {
    return Object.fromEntries(this.data);
  }

  // ============================================================================
  // ATTRIBUTION ENGINE INTEGRATION
  // ============================================================================

  shareAttributionInsights(insights) {
    this.setData('attribution_insights', insights, {
      source: 'attribution_engine',
      type: 'performance_data'
    });

    // Extract top keywords for content strategy
    const topKeywords = this.extractTopKeywords(insights);
    this.setData('top_performing_keywords', topKeywords, {
      source: 'attribution_engine',
      type: 'keyword_data'
    });

    // Extract channel performance for SEO analysis
    const channelPerformance = this.extractChannelPerformance(insights);
    this.setData('channel_performance', channelPerformance, {
      source: 'attribution_engine',
      type: 'channel_data'
    });
  }

  extractTopKeywords(insights) {
    // Extract keywords from attribution data
    return insights.topQueries?.slice(0, 10).map(query => ({
      keyword: query.query,
      clicks: query.clicks,
      conversionRate: query.conversionRate || 0,
      revenue: query.attributedRevenue || 0
    })) || [];
  }

  extractChannelPerformance(insights) {
    return insights.channelBreakdown || {};
  }

  // ============================================================================
  // SEO ANALYSIS INTEGRATION
  // ============================================================================

  shareSEOFindings(findings) {
    this.setData('seo_findings', findings, {
      source: 'seo_analysis',
      type: 'competitive_data'
    });

    // Extract content gaps for content strategy
    const contentGaps = this.extractContentGaps(findings);
    this.setData('content_gaps', contentGaps, {
      source: 'seo_analysis',
      type: 'opportunity_data'
    });

    // Extract quick wins for lead magnet ideas
    const quickWins = this.extractSEOQuickWins(findings);
    this.setData('seo_quick_wins', quickWins, {
      source: 'seo_analysis',
      type: 'optimization_data'
    });
  }

  extractContentGaps(findings) {
    return findings.contentGaps?.map(gap => ({
      topic: gap.topic,
      searchVolume: gap.searchVolume,
      difficulty: gap.difficulty,
      opportunity: gap.opportunity
    })) || [];
  }

  extractSEOQuickWins(findings) {
    return findings.quickWins?.filter(win => win.effort === 'Low') || [];
  }

  // ============================================================================
  // CONTENT STRATEGY INTEGRATION
  // ============================================================================

  shareContentInsights(insights) {
    this.setData('content_insights', insights, {
      source: 'content_strategy',
      type: 'content_data'
    });

    // Track content performance for optimization
    const contentPerformance = this.extractContentPerformance(insights);
    this.setData('content_performance', contentPerformance, {
      source: 'content_strategy',
      type: 'performance_data'
    });
  }

  extractContentPerformance(insights) {
    return {
      totalContent: insights.totalPieces || 0,
      avgWordCount: insights.avgWordCount || 0,
      avgSEOScore: insights.avgSEOScore || 0,
      topPerformingTopics: insights.topTopics || []
    };
  }

  // ============================================================================
  // CRO ANALYSIS INTEGRATION
  // ============================================================================

  shareCROFindings(findings) {
    this.setData('cro_findings', findings, {
      source: 'cro_analysis',
      type: 'optimization_data'
    });

    // Extract page optimization opportunities
    const pageOptimizations = this.extractPageOptimizations(findings);
    this.setData('page_optimizations', pageOptimizations, {
      source: 'cro_analysis',
      type: 'improvement_data'
    });
  }

  extractPageOptimizations(findings) {
    return findings.actionPlan?.map(action => ({
      page: action.page,
      issue: action.issue,
      solution: action.solution,
      impact: action.impact,
      effort: action.effort
    })) || [];
  }

  // ============================================================================
  // LEAD MAGNET INTEGRATION
  // ============================================================================

  shareLeadMagnetInsights(insights) {
    this.setData('lead_magnet_insights', insights, {
      source: 'lead_magnet_generator',
      type: 'conversion_data'
    });
  }

  // ============================================================================
  // GSC DATA INTEGRATION
  // ============================================================================

  shareGSCInsights(insights) {
    this.setData('gsc_insights', insights, {
      source: 'gsc_analyzer',
      type: 'search_data'
    });

    // Extract real performance data for all other tools
    const realKeywordData = this.extractRealKeywordData(insights);
    this.setData('real_keyword_performance', realKeywordData, {
      source: 'gsc_analyzer',
      type: 'verified_data'
    });
  }

  extractRealKeywordData(insights) {
    return insights.topQueries?.map(query => ({
      keyword: query.query,
      clicks: query.clicks,
      impressions: query.impressions,
      ctr: query.ctr,
      position: query.position,
      verified: true
    })) || [];
  }

  // ============================================================================
  // UNIFIED INSIGHTS GENERATION
  // ============================================================================

  generateUnifiedInsights() {
    const allData = this.getAllData();
    
    return {
      topOpportunities: this.combineTopOpportunities(allData),
      quickWins: this.combineQuickWins(allData),
      performanceScore: this.calculateOverallScore(allData),
      recommendedActions: this.prioritizeActions(allData),
      dataFreshness: this.calculateDataFreshness(allData)
    };
  }

  combineTopOpportunities(allData) {
    const opportunities = [];
    
    // Add SEO opportunities
    if (allData.content_gaps) {
      allData.content_gaps.data.forEach(gap => {
        opportunities.push({
          type: 'Content Gap',
          opportunity: gap.topic,
          impact: gap.opportunity,
          source: 'SEO Analysis',
          priority: this.calculatePriority(gap)
        });
      });
    }

    // Add CRO opportunities
    if (allData.page_optimizations) {
      allData.page_optimizations.data.forEach(opt => {
        opportunities.push({
          type: 'Page Optimization',
          opportunity: opt.issue,
          impact: opt.impact,
          source: 'CRO Analysis',
          priority: this.calculatePriority(opt)
        });
      });
    }

    return opportunities.sort((a, b) => b.priority - a.priority).slice(0, 5);
  }

  combineQuickWins(allData) {
    const quickWins = [];
    
    // Add SEO quick wins
    if (allData.seo_quick_wins) {
      quickWins.push(...allData.seo_quick_wins.data);
    }

    // Add CRO quick wins (low effort, high impact)
    if (allData.page_optimizations) {
      const croQuickWins = allData.page_optimizations.data.filter(
        opt => opt.effort === 'Low' && opt.impact >= 3
      );
      quickWins.push(...croQuickWins);
    }

    return quickWins.slice(0, 10);
  }

  calculateOverallScore(allData) {
    let totalScore = 0;
    let componentCount = 0;

    // Factor in each component's performance
    Object.entries(allData).forEach(([key, value]) => {
      if (value.data && typeof value.data === 'object') {
        const score = this.calculateComponentScore(key, value.data);
        if (score > 0) {
          totalScore += score;
          componentCount++;
        }
      }
    });

    return componentCount > 0 ? Math.round(totalScore / componentCount) : 0;
  }

  calculateComponentScore(component, data) {
    // Component-specific scoring logic
    switch (component) {
      case 'attribution_insights':
        return data.conversionRate ? Math.min(data.conversionRate * 10, 100) : 0;
      case 'seo_findings':
        return data.overallHealth || 0;
      case 'cro_findings':
        return data.optimizationScore || 0;
      default:
        return 0;
    }
  }

  calculatePriority(item) {
    // Simple priority calculation based on impact and effort
    const impact = item.impact || item.opportunity || 1;
    const effort = item.effort === 'Low' ? 3 : item.effort === 'Medium' ? 2 : 1;
    return impact * effort;
  }

  calculateDataFreshness(allData) {
    const now = new Date();
    let totalAge = 0;
    let count = 0;

    Object.values(allData).forEach(entry => {
      if (entry.metadata?.timestamp) {
        const age = now - new Date(entry.metadata.timestamp);
        totalAge += age;
        count++;
      }
    });

    const avgAge = count > 0 ? totalAge / count : 0;
    const hoursAge = avgAge / (1000 * 60 * 60);
    
    return {
      avgAgeHours: Math.round(hoursAge),
      freshness: hoursAge < 24 ? 'Fresh' : hoursAge < 168 ? 'Recent' : 'Stale'
    };
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  notifyListeners(key, data) {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in DataBridge listener:', error);
        }
      });
    }

    // Also notify wildcard listeners
    const wildcardCallbacks = this.listeners.get('*');
    if (wildcardCallbacks) {
      wildcardCallbacks.forEach(callback => {
        try {
          callback({ key, data });
        } catch (error) {
          console.error('Error in DataBridge wildcard listener:', error);
        }
      });
    }
  }

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  saveToStorage() {
    try {
      const dataToSave = Object.fromEntries(this.data);
      localStorage.setItem('attributeai_data_bridge', JSON.stringify(dataToSave));
    } catch (error) {
      console.warn('Failed to save DataBridge data to localStorage:', error);
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('attributeai_data_bridge');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.data = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.warn('Failed to load DataBridge data from localStorage:', error);
    }
  }

  clearAll() {
    this.data.clear();
    localStorage.removeItem('attributeai_data_bridge');
  }
}

// Create singleton instance
const dataBridge = new DataBridge();

// React hook for easy component integration
export const useDataBridge = (key = null) => {
  const [data, setData] = React.useState(key ? dataBridge.getData(key) : dataBridge.getAllData());

  React.useEffect(() => {
    const unsubscribe = dataBridge.subscribe(key || '*', (newData) => {
      if (key) {
        setData(newData);
      } else {
        setData(dataBridge.getAllData());
      }
    });

    return unsubscribe;
  }, [key]);

  const updateData = React.useCallback((newData, metadata = {}) => {
    if (key) {
      dataBridge.setData(key, newData, metadata);
    }
  }, [key]);

  return {
    data: data?.data || data,
    metadata: data?.metadata,
    updateData,
    generateUnifiedInsights: dataBridge.generateUnifiedInsights.bind(dataBridge)
  };
};

export default dataBridge;