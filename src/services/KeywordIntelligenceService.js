error || 'Failed to get suggestions');
      }

      return data;
    } catch (error) {
      console.error('Suggestions error:', error);
      throw new Error(`Failed to get keyword suggestions: ${error.message}`);
    }
  }

  /**
   * Export keyword analysis data
   */
  async exportKeywordData(analysisData, format = 'csv') {
    try {
      // Create exportable data structure
      const exportData = this.formatDataForExport(analysisData, format);
      
      // Create and download file
      this.downloadData(exportData, `keyword-analysis-${Date.now()}`, format);
      
      return { success: true, message: 'Data exported successfully' };
    } catch (error) {
      console.error('Export error:', error);
      throw new Error(`Failed to export data: ${error.message}`);
    }
  }

  /**
   * Format analysis data for export
   */
  formatDataForExport(data, format) {
    if (format === 'csv') {
      return this.convertToCSV(data);
    } else if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else {
      throw new Error('Unsupported export format');
    }
  }

  /**
   * Convert data to CSV format
   */
  convertToCSV(data) {
    const rows = [];
    
    // Header row
    rows.push([
      'Keyword',
      'Search Volume',
      'Difficulty',
      'CPC',
      'Competition',
      'Intent',
      'Claude Confidence',
      'GPT-4 Confidence',
      'Gemini Confidence',
      'Time to Rank',
      'Expected Traffic',
      'ROI'
    ]);

    // Primary keyword data
    if (data.primaryKeyword) {
      rows.push([
        data.primaryKeyword,
        data.metrics?.searchVolume || '',
        data.metrics?.difficulty || '',
        data.metrics?.cpc || '',
        data.metrics?.competition || '',
        data.metrics?.intent || '',
        data.aiInsights?.claude?.confidence || '',
        data.aiInsights?.gpt4?.confidence || '',
        data.aiInsights?.gemini?.confidence || '',
        data.predictions?.timeToRank || '',
        data.predictions?.expectedTraffic || '',
        data.predictions?.roi || ''
      ]);
    }

    // Related keywords
    if (data.relatedKeywords) {
      data.relatedKeywords.forEach(keyword => {
        rows.push([
          keyword.keyword,
          keyword.volume,
          keyword.difficulty,
          keyword.cpc,
          keyword.competition,
          keyword.intent,
          '', '', '', '', '', ''
        ]);
      });
    }

    // Convert to CSV string
    return rows.map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }

  /**
   * Download data as file
   */
  downloadData(data, filename, format) {
    const mimeType = format === 'csv' ? 'text/csv' : 'application/json';
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Integrate with existing AttributeAI attribution system
   */
  async integrateWithAttribution(keywordData, conversionData = {}) {
    try {
      // Map keyword insights to attribution data
      const attributionMapping = {
        keyword: keywordData.primaryKeyword,
        searchVolume: keywordData.metrics?.searchVolume,
        intent: keywordData.metrics?.intent,
        attributionPotential: keywordData.attributionPotential,
        predictions: keywordData.predictions,
        touchpointValue: this.calculateTouchpointValue(keywordData),
        conversionData
      };

      // Send to DataBridge for cross-component sharing
      if (window.DataBridge) {
        window.DataBridge.addData('keywordAttribution', attributionMapping);
      }

      return attributionMapping;
    } catch (error) {
      console.error('Attribution integration error:', error);
      throw new Error(`Failed to integrate with attribution: ${error.message}`);
    }
  }

  /**
   * Calculate touchpoint value for attribution modeling
   */
  calculateTouchpointValue(keywordData) {
    const { metrics, predictions, attributionPotential } = keywordData;
    
    let value = 0;
    
    // Base value from search volume and CPC
    if (metrics?.searchVolume && metrics?.cpc) {
      value += (metrics.searchVolume * parseFloat(metrics.cpc)) / 1000;
    }
    
    // Adjust for intent
    const intentMultiplier = {
      'Transactional': 2.0,
      'Commercial': 1.5,
      'Informational': 0.8,
      'Navigational': 1.2
    };
    
    value *= intentMultiplier[metrics?.intent] || 1.0;
    
    // Adjust for attribution potential
    if (attributionPotential?.score) {
      value *= (attributionPotential.score / 100);
    }
    
    // Adjust for predicted ROI
    if (predictions?.roi) {
      value *= (predictions.roi / 100);
    }
    
    return Math.round(value);
  }

  /**
   * Generate content strategy from keyword analysis
   */
  async generateContentStrategy(keywordData) {
    try {
      const strategy = {
        primaryKeyword: keywordData.primaryKeyword,
        contentPlan: [],
        keywordClusters: this.createKeywordClusters(keywordData),
        contentCalendar: this.generateContentCalendar(keywordData),
        optimizationTips: this.generateOptimizationTips(keywordData)
      };

      // Add content opportunities
      if (keywordData.contentOpportunities) {
        strategy.contentPlan = keywordData.contentOpportunities.map(opportunity => ({
          ...opportunity,
          status: 'planned',
          priority: this.calculateContentPriority(opportunity, keywordData),
          estimatedEffort: this.estimateContentEffort(opportunity),
          keywordMapping: opportunity.targetKeywords
        }));
      }

      return strategy;
    } catch (error) {
      console.error('Content strategy error:', error);
      throw new Error(`Failed to generate content strategy: ${error.message}`);
    }
  }

  /**
   * Create keyword clusters for content organization
   */
  createKeywordClusters(keywordData) {
    const clusters = new Map();
    
    // Primary keyword cluster
    clusters.set('primary', {
      name: 'Primary Focus',
      keywords: [keywordData.primaryKeyword],
      intent: keywordData.metrics?.intent,
      priority: 'High'
    });

    // Group related keywords by intent
    if (keywordData.relatedKeywords) {
      keywordData.relatedKeywords.forEach(keyword => {
        const intent = keyword.intent || 'Mixed';
        if (!clusters.has(intent.toLowerCase())) {
          clusters.set(intent.toLowerCase(), {
            name: `${intent} Intent`,
            keywords: [],
            intent: intent,
            priority: intent === 'Transactional' ? 'High' : intent === 'Commercial' ? 'Medium' : 'Low'
          });
        }
        clusters.get(intent.toLowerCase()).keywords.push(keyword.keyword);
      });
    }

    return Array.from(clusters.values());
  }

  /**
   * Generate content calendar based on keyword strategy
   */
  generateContentCalendar(keywordData) {
    const calendar = [];
    const today = new Date();

    // Create content schedule based on opportunities
    if (keywordData.contentOpportunities) {
      keywordData.contentOpportunities.forEach((opportunity, index) => {
        const publishDate = new Date(today);
        publishDate.setDate(today.getDate() + (index + 1) * 14); // Every 2 weeks

        calendar.push({
          date: publishDate.toISOString().split('T')[0],
          contentType: opportunity.type,
          title: opportunity.title,
          targetKeywords: opportunity.targetKeywords,
          status: 'scheduled',
          estimatedTraffic: opportunity.estimatedTraffic || 0
        });
      });
    }

    return calendar.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Generate SEO optimization tips
   */
  generateOptimizationTips(keywordData) {
    const tips = [];

    // AI insights tips
    if (keywordData.aiInsights?.claude?.keyRecommendations) {
      tips.push({
        category: 'Strategic',
        source: 'Claude AI',
        tips: keywordData.aiInsights.claude.keyRecommendations
      });
    }

    // Technical SEO tips
    tips.push({
      category: 'Technical SEO',
      source: 'Best Practices',
      tips: [
        `Optimize title tag with "${keywordData.primaryKeyword}"`,
        'Create comprehensive meta description (150-160 characters)',
        'Use keyword in H1 and H2 headings naturally',
        'Implement schema markup for better visibility',
        'Optimize for Core Web Vitals'
      ]
    });

    // Content optimization tips
    tips.push({
      category: 'Content Optimization',
      source: 'AI Analysis',
      tips: [
        `Target 1-3% keyword density for "${keywordData.primaryKeyword}"`,
        'Include semantic keywords and variations',
        'Create comprehensive, in-depth content (2000+ words)',
        'Add relevant internal and external links',
        'Optimize images with descriptive alt text'
      ]
    });

    return tips;
  }

  /**
   * Calculate content priority score
   */
  calculateContentPriority(opportunity, keywordData) {
    let score = 0;

    // Potential impact
    if (opportunity.potential === 'Very High') score += 40;
    else if (opportunity.potential === 'High') score += 30;
    else if (opportunity.potential === 'Medium') score += 20;
    else score += 10;

    // Difficulty (inverse scoring)
    if (opportunity.difficulty === 'Low') score += 30;
    else if (opportunity.difficulty === 'Medium') score += 20;
    else score += 10;

    // Estimated traffic
    if (opportunity.estimatedTraffic) {
      score += Math.min(30, opportunity.estimatedTraffic / 100);
    }

    return score >= 70 ? 'High' : score >= 50 ? 'Medium' : 'Low';
  }

  /**
   * Estimate content creation effort
   */
  estimateContentEffort(opportunity) {
    const effortMap = {
      'Blog Post': 'Medium',
      'Pillar Page': 'High',
      'How-to Guide': 'Medium',
      'Comparison Post': 'High',
      'Landing Page': 'Low',
      'Case Study': 'Medium'
    };

    return effortMap[opportunity.type] || 'Medium';
  }

  /**
   * Get keyword performance tracking data
   */
  async trackKeywordPerformance(keywords, timeframe = '30d') {
    // This would integrate with actual tracking APIs in production
    return {
      keywords: keywords.map(keyword => ({
        keyword,
        currentRanking: Math.floor(Math.random() * 100) + 1,
        previousRanking: Math.floor(Math.random() * 100) + 1,
        trafficChange: (Math.random() * 40 - 20).toFixed(1) + '%',
        clickThroughRate: (Math.random() * 5 + 1).toFixed(2) + '%',
        conversionRate: (Math.random() * 10 + 2).toFixed(2) + '%'
      })),
      timeframe,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Create singleton instance
const keywordIntelligenceService = new KeywordIntelligenceService();

export default keywordIntelligenceService;