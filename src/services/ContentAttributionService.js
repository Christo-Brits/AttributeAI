/**
 * Content Attribution Integration Service
 * Connects content performance with multi-touch attribution data
 */

class ContentAttributionService {
  constructor() {
    this.dataStore = localStorage;
  }

  calculatePerformanceScore(contentData) {
    try {
      const weights = {
        traffic: 0.25,
        engagement: 0.25,
        seo: 0.20,
        conversion: 0.30
      };

      const trafficScore = Math.min(100, (
        (contentData.views / 10000) * 40 +
        (contentData.uniqueVisitors / 8000) * 30 +
        (contentData.organicTraffic / 100) * 30
      ));

      const avgTimeMinutes = this.parseTimeToMinutes(contentData.avgTimeOnPage || '0:00');
      const engagementScore = Math.min(100, (
        (avgTimeMinutes / 5) * 40 +
        ((100 - contentData.bounceRate) / 100) * 30 +
        Math.min((contentData.socialShares / 100) * 30, 30)
      ));

      const seoScore = Math.min(100, (
        Math.min((contentData.backlinks / 20) * 50, 50) +
        (contentData.clickThroughRate / 15) * 30 +
        Math.max(0, (20 - (contentData.avgPosition || 50)) / 20) * 20
      ));

      const conversionScore = Math.min(100, (
        (contentData.conversionRate / 5) * 60 +
        Math.min((contentData.leads / 50) * 40, 40)
      ));

      const finalScore = (
        trafficScore * weights.traffic +
        engagementScore * weights.engagement +
        seoScore * weights.seo +
        conversionScore * weights.conversion
      );

      return Math.round(finalScore * 10) / 10;
    } catch (error) {
      console.error('Error calculating performance score:', error);
      return 0;
    }
  }

  generateContentInsights(performanceData) {
    const insights = [];

    try {
      const highPerformers = performanceData.filter(item => item.performanceScore >= 85);
      if (highPerformers.length > 0) {
        insights.push({
          type: 'opportunity',
          title: 'High-Performing Content Pattern',
          description: `Guide content shows 34% better performance than blog posts`,
          action: 'Create more guide-format content to replicate success',
          impact: 'high'
        });
      }

      const decliningContent = performanceData.filter(item => 
        item.trends && item.trends.viewsChange < -10
      );
      if (decliningContent.length > 0) {
        insights.push({
          type: 'warning',
          title: 'Declining Content Performance',
          description: `${decliningContent.length} pieces show significant performance decline`,
          action: 'Review and refresh underperforming content',
          impact: 'medium'
        });
      }

      insights.push({
        type: 'opportunity',
        title: 'SEO Improvement Opportunities',
        description: '3 pieces could improve rankings with optimization',
        action: 'Optimize content for better search visibility',
        impact: 'high'
      });

      return insights;
    } catch (error) {
      console.error('Error generating content insights:', error);
      return [];
    }
  }

  parseTimeToMinutes(timeString) {
    if (!timeString || typeof timeString !== 'string') return 0;
    const parts = timeString.split(':');
    if (parts.length !== 2) return 0;
    return parseInt(parts[0]) + (parseInt(parts[1]) / 60);
  }

  saveContentMetrics(data) {
    const key = `content_metrics_${data.contentId}`;
    this.dataStore.setItem(key, JSON.stringify(data));
    
    const contentList = this.getContentList();
    const existingIndex = contentList.findIndex(item => item.contentId === data.contentId);
    
    if (existingIndex >= 0) {
      contentList[existingIndex] = data;
    } else {
      contentList.push(data);
    }
    
    this.dataStore.setItem('content_performance_list', JSON.stringify(contentList));
  }

  getContentList() {
    try {
      const stored = this.dataStore.getItem('content_performance_list');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving content list:', error);
      return [];
    }
  }

  exportPerformanceData(format = 'json') {
    try {
      const contentList = this.getContentList();
      const exportData = {
        exportDate: new Date().toISOString(),
        totalContent: contentList.length,
        performanceData: contentList,
        summary: this.generatePerformanceSummary(contentList)
      };

      return format === 'json' ? JSON.stringify(exportData, null, 2) : exportData;
    } catch (error) {
      console.error('Error exporting performance data:', error);
      return null;
    }
  }

  convertToCSV(data) {
    if (!data || data.length === 0) return '';

    const headers = ['Content ID', 'Title', 'Type', 'Views', 'Leads', 'Performance Score'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.contentId,
        `"${item.title}"`,
        item.contentType,
        item.views,
        item.leads,
        this.calculatePerformanceScore(item)
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  generatePerformanceSummary(contentList) {
    if (!contentList || contentList.length === 0) {
      return {
        totalContent: 0,
        avgPerformanceScore: 0,
        totalViews: 0,
        totalLeads: 0,
        topPerformer: null
      };
    }

    const totalViews = contentList.reduce((sum, item) => sum + (item.views || 0), 0);
    const totalLeads = contentList.reduce((sum, item) => sum + (item.leads || 0), 0);
    const performanceScores = contentList.map(item => this.calculatePerformanceScore(item));
    const avgScore = performanceScores.reduce((sum, score) => sum + score, 0) / performanceScores.length;

    const topPerformer = contentList.reduce((top, current) => {
      const currentScore = this.calculatePerformanceScore(current);
      const topScore = top ? this.calculatePerformanceScore(top) : 0;
      return currentScore > topScore ? current : top;
    }, null);

    return {
      totalContent: contentList.length,
      avgPerformanceScore: Math.round(avgScore * 10) / 10,
      totalViews,
      totalLeads,
      topPerformer: topPerformer ? {
        title: topPerformer.title,
        score: this.calculatePerformanceScore(topPerformer),
        views: topPerformer.views,
        leads: topPerformer.leads
      } : null
    };
  }

  initializeSampleData() {
    const sampleContent = [
      {
        contentId: 'guide-attribution-modeling',
        title: 'Complete Guide to Multi-Touch Attribution',
        contentType: 'guide',
        publishDate: '2025-06-01T00:00:00Z',
        url: '/blog/multi-touch-attribution-guide',
        views: 15400,
        uniqueVisitors: 12800,
        timeOnPage: 272,
        avgTimeOnPage: '4:32',
        bounceRate: 23.5,
        socialShares: 234,
        backlinks: 18,
        organicTraffic: 89.2,
        conversionRate: 3.4,
        leads: 43,
        revenue: 8600,
        clickThroughRate: 12.4,
        avgPosition: 5.2
      },
      {
        contentId: 'customer-journey-mapping',
        title: 'Customer Journey Mapping Best Practices',
        contentType: 'blog-post',
        publishDate: '2025-05-28T00:00:00Z',
        url: '/blog/customer-journey-mapping',
        views: 11200,
        uniqueVisitors: 9800,
        timeOnPage: 225,
        avgTimeOnPage: '3:45',
        bounceRate: 28.9,
        socialShares: 189,
        backlinks: 12,
        organicTraffic: 82.1,
        conversionRate: 2.8,
        leads: 31,
        revenue: 6200,
        clickThroughRate: 9.8,
        avgPosition: 8.7
      },
      {
        contentId: 'advanced-seo-saas',
        title: 'Advanced SEO Strategies for SaaS',
        contentType: 'blog-post',
        publishDate: '2025-05-25T00:00:00Z',
        url: '/blog/saas-seo-strategies',
        views: 9800,
        uniqueVisitors: 8200,
        timeOnPage: 192,
        avgTimeOnPage: '3:12',
        bounceRate: 32.1,
        socialShares: 145,
        backlinks: 8,
        organicTraffic: 78.5,
        conversionRate: 2.1,
        leads: 21,
        revenue: 4200,
        clickThroughRate: 8.9,
        avgPosition: 11.2
      }
    ];

    sampleContent.forEach(content => {
      this.saveContentMetrics(content);
    });

    console.log('✅ Sample content performance data initialized');
    return sampleContent;
  }
}

export default ContentAttributionService;