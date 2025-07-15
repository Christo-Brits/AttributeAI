/**
 * Content Attribution Bridge Service
 * Integrates content performance with multi-touch attribution data
 * Provides comprehensive view of content's role in customer journey and conversions
 */

import ContentAttributionService from './ContentAttributionService';

class ContentAttributionBridge {
  constructor() {
    this.contentService = new ContentAttributionService();
    this.dataStore = localStorage;
    this.attributionModels = ['first-touch', 'last-touch', 'linear', 'time-decay', 'position-based'];
  }

  /**
   * Initialize attribution integration with sample data
   */
  async initializeAttributionIntegration() {
    try {
      // Create sample customer journeys with content touchpoints
      const sampleJourneys = this.generateSampleCustomerJourneys();
      
      // Store attribution data
      this.dataStore.setItem('customer_journeys', JSON.stringify(sampleJourneys));
      
      // Generate attribution analysis for each content piece
      const contentList = this.contentService.getContentList();
      const attributionAnalysis = await this.analyzeContentAttribution(contentList, sampleJourneys);
      
      this.dataStore.setItem('content_attribution_analysis', JSON.stringify(attributionAnalysis));
      
      console.log('✅ Attribution integration initialized with sample data');
      return attributionAnalysis;
    } catch (error) {
      console.error('Error initializing attribution integration:', error);
      return null;
    }
  }

  /**
   * Generate sample customer journeys with content touchpoints
   */
  generateSampleCustomerJourneys() {
    const journeys = [
      {
        journeyId: 'journey-001',
        customerId: 'customer-001',
        startDate: '2025-06-01T09:00:00Z',
        endDate: '2025-06-15T14:30:00Z',
        conversionValue: 2400,
        conversionType: 'subscription',
        touchpoints: [
          {
            timestamp: '2025-06-01T09:00:00Z',
            channel: 'organic-search',
            source: 'google',
            medium: 'organic',
            campaign: null,
            content: {
              contentId: 'guide-attribution-modeling',
              title: 'Complete Guide to Multi-Touch Attribution',
              url: '/blog/multi-touch-attribution-guide',
              timeSpent: 420, // 7 minutes
              scrollDepth: 85,
              interactions: ['download-guide', 'newsletter-signup']
            },
            attribution: {
              firstTouch: true,
              assistingTouch: false,
              lastTouch: false,
              touchPosition: 1,
              totalTouches: 5
            }
          },
          {
            timestamp: '2025-06-03T16:20:00Z',
            channel: 'email',
            source: 'newsletter',
            medium: 'email',
            campaign: 'weekly-newsletter',
            content: {
              contentId: 'customer-journey-mapping',
              title: 'Customer Journey Mapping Best Practices',
              url: '/blog/customer-journey-mapping',
              timeSpent: 180, // 3 minutes
              scrollDepth: 60,
              interactions: ['social-share-linkedin']
            },
            attribution: {
              firstTouch: false,
              assistingTouch: true,
              lastTouch: false,
              touchPosition: 2,
              totalTouches: 5
            }
          },
          {
            timestamp: '2025-06-08T11:45:00Z',
            channel: 'social',
            source: 'linkedin',
            medium: 'social',
            campaign: 'content-promotion',
            content: {
              contentId: 'advanced-seo-saas',
              title: 'Advanced SEO Strategies for SaaS',
              url: '/blog/saas-seo-strategies',
              timeSpent: 240, // 4 minutes
              scrollDepth: 70,
              interactions: ['comment', 'website-visit']
            },
            attribution: {
              firstTouch: false,
              assistingTouch: true,
              lastTouch: false,
              touchPosition: 3,
              totalTouches: 5
            }
          },
          {
            timestamp: '2025-06-12T10:15:00Z',
            channel: 'direct',
            source: 'direct',
            medium: 'direct',
            campaign: null,
            content: {
              contentId: 'guide-attribution-modeling',
              title: 'Complete Guide to Multi-Touch Attribution',
              url: '/blog/multi-touch-attribution-guide',
              timeSpent: 600, // 10 minutes
              scrollDepth: 95,
              interactions: ['demo-request', 'pricing-page-visit']
            },
            attribution: {
              firstTouch: false,
              assistingTouch: true,
              lastTouch: false,
              touchPosition: 4,
              totalTouches: 5
            }
          },
          {
            timestamp: '2025-06-15T14:30:00Z',
            channel: 'direct',
            source: 'direct',
            medium: 'direct',
            campaign: null,
            content: null, // Direct conversion without content
            conversion: {
              type: 'subscription',
              value: 2400,
              plan: 'professional'
            },
            attribution: {
              firstTouch: false,
              assistingTouch: false,
              lastTouch: true,
              touchPosition: 5,
              totalTouches: 5
            }
          }
        ]
      },
      {
        journeyId: 'journey-002',
        customerId: 'customer-002',
        startDate: '2025-05-28T14:20:00Z',
        endDate: '2025-06-05T09:45:00Z',
        conversionValue: 1200,
        conversionType: 'subscription',
        touchpoints: [
          {
            timestamp: '2025-05-28T14:20:00Z',
            channel: 'paid-search',
            source: 'google',
            medium: 'cpc',
            campaign: 'attribution-keywords',
            content: {
              contentId: 'customer-journey-mapping',
              title: 'Customer Journey Mapping Best Practices',
              url: '/blog/customer-journey-mapping',
              timeSpent: 300, // 5 minutes
              scrollDepth: 80,
              interactions: ['download-template', 'newsletter-signup']
            },
            attribution: {
              firstTouch: true,
              assistingTouch: false,
              lastTouch: false,
              touchPosition: 1,
              totalTouches: 3
            }
          },
          {
            timestamp: '2025-06-02T19:30:00Z',
            channel: 'email',
            source: 'drip-campaign',
            medium: 'email',
            campaign: 'nurture-sequence',
            content: {
              contentId: 'advanced-seo-saas',
              title: 'Advanced SEO Strategies for SaaS',
              url: '/blog/saas-seo-strategies',
              timeSpent: 210, // 3.5 minutes
              scrollDepth: 65,
              interactions: ['checklist-download']
            },
            attribution: {
              firstTouch: false,
              assistingTouch: true,
              lastTouch: false,
              touchPosition: 2,
              totalTouches: 3
            }
          },
          {
            timestamp: '2025-06-05T09:45:00Z',
            channel: 'email',
            source: 'promotional',
            medium: 'email',
            campaign: 'monthly-offer',
            content: null,
            conversion: {
              type: 'subscription',
              value: 1200,
              plan: 'starter'
            },
            attribution: {
              firstTouch: false,
              assistingTouch: false,
              lastTouch: true,
              touchPosition: 3,
              totalTouches: 3
            }
          }
        ]
      },
      {
        journeyId: 'journey-003',
        customerId: 'customer-003',
        startDate: '2025-06-10T08:15:00Z',
        endDate: '2025-06-18T16:20:00Z',
        conversionValue: 4800,
        conversionType: 'subscription',
        touchpoints: [
          {
            timestamp: '2025-06-10T08:15:00Z',
            channel: 'referral',
            source: 'partner-blog',
            medium: 'referral',
            campaign: 'guest-post',
            content: {
              contentId: 'guide-attribution-modeling',
              title: 'Complete Guide to Multi-Touch Attribution',
              url: '/blog/multi-touch-attribution-guide',
              timeSpent: 720, // 12 minutes
              scrollDepth: 90,
              interactions: ['guide-download', 'demo-request', 'newsletter-signup']
            },
            attribution: {
              firstTouch: true,
              assistingTouch: false,
              lastTouch: false,
              touchPosition: 1,
              totalTouches: 4
            }
          },
          {
            timestamp: '2025-06-13T15:30:00Z',
            channel: 'social',
            source: 'twitter',
            medium: 'social',
            campaign: 'thought-leadership',
            content: {
              contentId: 'customer-journey-mapping',
              title: 'Customer Journey Mapping Best Practices',
              url: '/blog/customer-journey-mapping',
              timeSpent: 180, // 3 minutes
              scrollDepth: 55,
              interactions: ['retweet', 'website-visit']
            },
            attribution: {
              firstTouch: false,
              assistingTouch: true,
              lastTouch: false,
              touchPosition: 2,
              totalTouches: 4
            }
          },
          {
            timestamp: '2025-06-16T12:00:00Z',
            channel: 'direct',
            source: 'direct',
            medium: 'direct',
            campaign: null,
            content: {
              contentId: 'advanced-seo-saas',
              title: 'Advanced SEO Strategies for SaaS',
              url: '/blog/saas-seo-strategies',
              timeSpent: 360, // 6 minutes
              scrollDepth: 75,
              interactions: ['pricing-page-visit', 'feature-comparison']
            },
            attribution: {
              firstTouch: false,
              assistingTouch: true,
              lastTouch: false,
              touchPosition: 3,
              totalTouches: 4
            }
          },
          {
            timestamp: '2025-06-18T16:20:00Z',
            channel: 'direct',
            source: 'direct',
            medium: 'direct',
            campaign: null,
            content: null,
            conversion: {
              type: 'subscription',
              value: 4800,
              plan: 'enterprise'
            },
            attribution: {
              firstTouch: false,
              assistingTouch: false,
              lastTouch: true,
              touchPosition: 4,
              totalTouches: 4
            }
          }
        ]
      }
    ];

    return journeys;
  }

  /**
   * Analyze content attribution across customer journeys
   */
  async analyzeContentAttribution(contentList, customerJourneys) {
    try {
      const attributionAnalysis = {};

      // Analyze each content piece
      for (const content of contentList) {
        const contentAttribution = await this.analyzeContentPieceAttribution(content, customerJourneys);
        attributionAnalysis[content.contentId] = contentAttribution;
      }

      // Calculate overall attribution metrics
      const overallMetrics = this.calculateOverallAttributionMetrics(attributionAnalysis, customerJourneys);
      attributionAnalysis.overall = overallMetrics;

      return attributionAnalysis;
    } catch (error) {
      console.error('Error analyzing content attribution:', error);
      return {};
    }
  }

  /**
   * Analyze attribution for a specific content piece
   */
  async analyzeContentPieceAttribution(content, customerJourneys) {
    try {
      const attribution = {
        contentId: content.contentId,
        title: content.title,
        totalTouchpoints: 0,
        uniqueCustomers: new Set(),
        revenue: {
          firstTouch: 0,
          lastTouch: 0,
          linear: 0,
          timeDecay: 0,
          positionBased: 0,
          total: 0
        },
        touchpointAnalysis: {
          first: 0,
          assisting: 0,
          last: 0,
          averagePosition: 0,
          averageTimeSpent: 0,
          averageScrollDepth: 0,
          totalInteractions: 0
        },
        channelBreakdown: {},
        conversionInfluence: {
          directConversions: 0,
          assistedConversions: 0,
          conversionRate: 0,
          avgTimeToConversion: 0
        },
        customerJourneyImpact: []
      };

      // Find all touchpoints for this content
      for (const journey of customerJourneys) {
        const contentTouchpoints = journey.touchpoints.filter(tp => 
          tp.content && tp.content.contentId === content.contentId
        );

        if (contentTouchpoints.length > 0) {
          attribution.uniqueCustomers.add(journey.customerId);
          
          for (const touchpoint of contentTouchpoints) {
            attribution.totalTouchpoints++;
            
            // Analyze touchpoint position
            if (touchpoint.attribution.firstTouch) {
              attribution.touchpointAnalysis.first++;
              attribution.revenue.firstTouch += journey.conversionValue;
            } else if (touchpoint.attribution.lastTouch) {
              attribution.touchpointAnalysis.last++;
              attribution.revenue.lastTouch += journey.conversionValue;
            } else if (touchpoint.attribution.assistingTouch) {
              attribution.touchpointAnalysis.assisting++;
            }

            // Calculate revenue attribution for different models
            const revenueShare = this.calculateRevenueShare(touchpoint, journey);
            attribution.revenue.linear += revenueShare.linear;
            attribution.revenue.timeDecay += revenueShare.timeDecay;
            attribution.revenue.positionBased += revenueShare.positionBased;

            // Analyze engagement metrics
            if (touchpoint.content.timeSpent) {
              attribution.touchpointAnalysis.averageTimeSpent += touchpoint.content.timeSpent;
            }
            if (touchpoint.content.scrollDepth) {
              attribution.touchpointAnalysis.averageScrollDepth += touchpoint.content.scrollDepth;
            }
            if (touchpoint.content.interactions) {
              attribution.touchpointAnalysis.totalInteractions += touchpoint.content.interactions.length;
            }

            // Channel breakdown
            const channel = touchpoint.channel;
            if (!attribution.channelBreakdown[channel]) {
              attribution.channelBreakdown[channel] = {
                touchpoints: 0,
                revenue: 0,
                averageEngagement: 0
              };
            }
            attribution.channelBreakdown[channel].touchpoints++;
            attribution.channelBreakdown[channel].revenue += revenueShare.linear;

            // Customer journey impact
            attribution.customerJourneyImpact.push({
              journeyId: journey.journeyId,
              customerId: journey.customerId,
              touchpointPosition: touchpoint.attribution.touchPosition,
              totalTouchpoints: touchpoint.attribution.totalTouches,
              timeSpent: touchpoint.content.timeSpent,
              interactions: touchpoint.content.interactions,
              conversionValue: journey.conversionValue,
              revenueAttribution: revenueShare
            });
          }
        }
      }

      // Calculate averages and conversion metrics
      if (attribution.totalTouchpoints > 0) {
        attribution.touchpointAnalysis.averageTimeSpent /= attribution.totalTouchpoints;
        attribution.touchpointAnalysis.averageScrollDepth /= attribution.totalTouchpoints;
        attribution.touchpointAnalysis.averagePosition = 
          attribution.customerJourneyImpact.reduce((sum, impact) => sum + impact.touchpointPosition, 0) / 
          attribution.customerJourneyImpact.length;
      }

      // Convert Set to number for unique customers
      attribution.uniqueCustomers = attribution.uniqueCustomers.size;

      // Calculate total revenue
      attribution.revenue.total = Math.max(
        attribution.revenue.firstTouch,
        attribution.revenue.lastTouch,
        attribution.revenue.linear,
        attribution.revenue.timeDecay,
        attribution.revenue.positionBased
      );

      // Conversion influence analysis
      attribution.conversionInfluence.assistedConversions = attribution.customerJourneyImpact.length;
      attribution.conversionInfluence.conversionRate = 
        (attribution.conversionInfluence.assistedConversions / attribution.totalTouchpoints) * 100;

      return attribution;
    } catch (error) {
      console.error('Error analyzing content piece attribution:', error);
      return null;
    }
  }

  /**
   * Calculate revenue share for different attribution models
   */
  calculateRevenueShare(touchpoint, journey) {
    const totalTouches = touchpoint.attribution.totalTouches;
    const position = touchpoint.attribution.touchPosition;
    const conversionValue = journey.conversionValue;

    return {
      linear: conversionValue / totalTouches,
      timeDecay: this.calculateTimeDecayAttribution(touchpoint, journey),
      positionBased: this.calculatePositionBasedAttribution(touchpoint, journey)
    };
  }

  /**
   * Calculate time-decay attribution
   */
  calculateTimeDecayAttribution(touchpoint, journey) {
    const conversionDate = new Date(journey.endDate);
    const touchpointDate = new Date(touchpoint.timestamp);
    const daysDifference = Math.max(1, (conversionDate - touchpointDate) / (1000 * 60 * 60 * 24));
    
    // Time decay with 7-day half-life
    const halfLife = 7;
    const decayFactor = Math.pow(0.5, daysDifference / halfLife);
    
    // Calculate total decay factor for all touchpoints in journey
    let totalDecayFactor = 0;
    for (const tp of journey.touchpoints) {
      if (tp.content) {
        const tpDate = new Date(tp.timestamp);
        const tpDaysDiff = Math.max(1, (conversionDate - tpDate) / (1000 * 60 * 60 * 24));
        totalDecayFactor += Math.pow(0.5, tpDaysDiff / halfLife);
      }
    }

    return (decayFactor / totalDecayFactor) * journey.conversionValue;
  }

  /**
   * Calculate position-based attribution (40% first, 20% last, 40% middle)
   */
  calculatePositionBasedAttribution(touchpoint, journey) {
    const totalTouches = touchpoint.attribution.totalTouches;
    const position = touchpoint.attribution.touchPosition;
    const conversionValue = journey.conversionValue;

    if (totalTouches === 1) {
      return conversionValue; // Single touch gets 100%
    }

    if (position === 1) {
      return conversionValue * 0.4; // First touch gets 40%
    } else if (position === totalTouches) {
      return conversionValue * 0.2; // Last touch gets 20%
    } else {
      const middleTouches = totalTouches - 2;
      return middleTouches > 0 ? (conversionValue * 0.4) / middleTouches : 0; // Middle touches share 40%
    }
  }

  /**
   * Calculate overall attribution metrics
   */
  calculateOverallAttributionMetrics(attributionAnalysis, customerJourneys) {
    const metrics = {
      totalRevenue: 0,
      totalTouchpoints: 0,
      totalCustomers: customerJourneys.length,
      averageJourneyLength: 0,
      contentPerformanceRanking: [],
      channelEffectiveness: {},
      attributionModelComparison: {
        firstTouch: 0,
        lastTouch: 0,
        linear: 0,
        timeDecay: 0,
        positionBased: 0
      }
    };

    // Calculate totals and rankings
    const contentPerformance = [];
    for (const [contentId, analysis] of Object.entries(attributionAnalysis)) {
      if (contentId !== 'overall' && analysis) {
        metrics.totalRevenue += analysis.revenue.total;
        metrics.totalTouchpoints += analysis.totalTouchpoints;
        
        // Add to content performance ranking
        contentPerformance.push({
          contentId: analysis.contentId,
          title: analysis.title,
          totalRevenue: analysis.revenue.total,
          totalTouchpoints: analysis.totalTouchpoints,
          uniqueCustomers: analysis.uniqueCustomers,
          averageEngagement: analysis.touchpointAnalysis.averageTimeSpent,
          conversionInfluence: analysis.conversionInfluence.conversionRate
        });

        // Aggregate attribution model totals
        metrics.attributionModelComparison.firstTouch += analysis.revenue.firstTouch;
        metrics.attributionModelComparison.lastTouch += analysis.revenue.lastTouch;
        metrics.attributionModelComparison.linear += analysis.revenue.linear;
        metrics.attributionModelComparison.timeDecay += analysis.revenue.timeDecay;
        metrics.attributionModelComparison.positionBased += analysis.revenue.positionBased;
      }
    }

    // Sort content by total revenue attribution
    metrics.contentPerformanceRanking = contentPerformance.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Calculate average journey length
    const totalJourneyTouches = customerJourneys.reduce((sum, journey) => sum + journey.touchpoints.length, 0);
    metrics.averageJourneyLength = totalJourneyTouches / customerJourneys.length;

    return metrics;
  }

  /**
   * Get attribution integration data
   */
  getAttributionIntegrationData() {
    try {
      const stored = this.dataStore.getItem('content_attribution_analysis');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving attribution integration data:', error);
      return null;
    }
  }

  /**
   * Get customer journeys data
   */
  getCustomerJourneys() {
    try {
      const stored = this.dataStore.getItem('customer_journeys');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving customer journeys:', error);
      return [];
    }
  }

  /**
   * Generate attribution report for specific content
   */
  generateContentAttributionReport(contentId) {
    try {
      const attributionData = this.getAttributionIntegrationData();
      if (!attributionData || !attributionData[contentId]) {
        return null;
      }

      const contentAttribution = attributionData[contentId];
      const overallMetrics = attributionData.overall;

      return {
        content: contentAttribution,
        benchmarks: {
          averageRevenue: overallMetrics.totalRevenue / Object.keys(attributionData).length - 1,
          averageTouchpoints: overallMetrics.totalTouchpoints / Object.keys(attributionData).length - 1,
          industryPercentile: this.calculateIndustryPercentile(contentAttribution)
        },
        recommendations: this.generateAttributionRecommendations(contentAttribution),
        reportGenerated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating attribution report:', error);
      return null;
    }
  }

  /**
   * Generate attribution-based recommendations
   */
  generateAttributionRecommendations(contentAttribution) {
    const recommendations = [];

    // High-performing content recommendations
    if (contentAttribution.revenue.total > 2000) {
      recommendations.push({
        type: 'success',
        title: 'High Revenue Attribution',
        description: `This content contributed $${contentAttribution.revenue.total.toLocaleString()} in revenue`,
        action: 'Create more content similar to this high-performer',
        impact: 'high'
      });
    }

    // Engagement optimization
    if (contentAttribution.touchpointAnalysis.averageTimeSpent < 180) {
      recommendations.push({
        type: 'opportunity',
        title: 'Low Engagement Time',
        description: `Average time spent is ${Math.round(contentAttribution.touchpointAnalysis.averageTimeSpent / 60)} minutes`,
        action: 'Optimize content to increase engagement and time spent',
        impact: 'medium'
      });
    }

    // Channel optimization
    const topChannel = Object.keys(contentAttribution.channelBreakdown)
      .sort((a, b) => contentAttribution.channelBreakdown[b].revenue - contentAttribution.channelBreakdown[a].revenue)[0];
    
    if (topChannel) {
      recommendations.push({
        type: 'opportunity',
        title: 'Channel Optimization',
        description: `${topChannel} is the top-performing channel for this content`,
        action: `Invest more in promoting this content through ${topChannel}`,
        impact: 'high'
      });
    }

    // Position-based insights
    if (contentAttribution.touchpointAnalysis.first > contentAttribution.touchpointAnalysis.assisting) {
      recommendations.push({
        type: 'insight',
        title: 'Strong First-Touch Performance',
        description: 'This content excels at introducing customers to your brand',
        action: 'Use this content for top-of-funnel marketing campaigns',
        impact: 'high'
      });
    }

    return recommendations;
  }

  /**
   * Calculate industry percentile (simulated)
   */
  calculateIndustryPercentile(contentAttribution) {
    // Simulate industry benchmarking
    const revenueScore = Math.min(100, (contentAttribution.revenue.total / 5000) * 100);
    const engagementScore = Math.min(100, (contentAttribution.touchpointAnalysis.averageTimeSpent / 600) * 100);
    const touchpointScore = Math.min(100, (contentAttribution.totalTouchpoints / 20) * 100);

    return Math.round((revenueScore + engagementScore + touchpointScore) / 3);
  }

  /**
   * Export attribution analysis
   */
  exportAttributionAnalysis(format = 'json') {
    try {
      const attributionData = this.getAttributionIntegrationData();
      const customerJourneys = this.getCustomerJourneys();

      const exportData = {
        exportDate: new Date().toISOString(),
        summary: attributionData?.overall || {},
        contentAttribution: attributionData || {},
        customerJourneys: customerJourneys,
        attributionModels: this.attributionModels
      };

      switch (format) {
        case 'json':
          return JSON.stringify(exportData, null, 2);
        case 'csv':
          return this.convertAttributionToCSV(attributionData);
        default:
          return exportData;
      }
    } catch (error) {
      console.error('Error exporting attribution analysis:', error);
      return null;
    }
  }

  /**
   * Convert attribution data to CSV format
   */
  convertAttributionToCSV(attributionData) {
    if (!attributionData) return '';

    const headers = [
      'Content ID', 'Title', 'Total Touchpoints', 'Unique Customers',
      'First Touch Revenue', 'Last Touch Revenue', 'Linear Revenue',
      'Time Decay Revenue', 'Position Based Revenue', 'Total Revenue',
      'Average Time Spent', 'Average Scroll Depth', 'Conversion Rate'
    ];

    const rows = [];
    for (const [contentId, data] of Object.entries(attributionData)) {
      if (contentId !== 'overall' && data) {
        rows.push([
          data.contentId,
          `"${data.title}"`,
          data.totalTouchpoints,
          data.uniqueCustomers,
          data.revenue.firstTouch.toFixed(2),
          data.revenue.lastTouch.toFixed(2),
          data.revenue.linear.toFixed(2),
          data.revenue.timeDecay.toFixed(2),
          data.revenue.positionBased.toFixed(2),
          data.revenue.total.toFixed(2),
          Math.round(data.touchpointAnalysis.averageTimeSpent),
          Math.round(data.touchpointAnalysis.averageScrollDepth),
          data.conversionInfluence.conversionRate.toFixed(1)
        ].join(','));
      }
    }

    return [headers.join(','), ...rows].join('\n');
  }
}

export default ContentAttributionBridge;