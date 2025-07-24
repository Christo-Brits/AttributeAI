// YC Demo Data Generator - Creates impressive demo data for presentations

export const generateDemoData = () => {
  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const twoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);

  return {
    // Overall Performance Metrics
    performance: {
      totalRevenue: 2347820,
      revenueGrowth: 156.7,
      conversionRate: 3.42,
      conversionGrowth: 67.3,
      averageOrderValue: 847,
      aovGrowth: 23.1,
      customerAcquisitionCost: 89,
      cacReduction: -34.2,
      lifetimeValue: 2850,
      ltvGrowth: 89.4
    },

    // Attribution Data
    attribution: {
      channels: [
        { name: 'Organic Search', revenue: 892340, percentage: 38.1, growth: 45.2 },
        { name: 'Paid Search', revenue: 587920, percentage: 25.1, growth: 78.9 },
        { name: 'Social Media', revenue: 423180, percentage: 18.0, growth: 156.3 },
        { name: 'Email Marketing', revenue: 234760, percentage: 10.0, growth: 23.7 },
        { name: 'Direct Traffic', revenue: 164820, percentage: 7.0, growth: 12.4 },
        { name: 'Referral', revenue: 44800, percentage: 1.9, growth: 234.8 }
      ],
      touchpoints: [
        { position: 'First Touch', revenue: 1156780, percentage: 49.3 },
        { position: 'Middle Touch', revenue: 759240, percentage: 32.4 },
        { position: 'Last Touch', revenue: 431800, percentage: 18.4 }
      ]
    },

    // Keyword Intelligence
    keywords: {
      total: 15847,
      ranking: {
        topTen: 342,
        topFifty: 1847,
        topHundred: 4829
      },
      opportunities: [
        { keyword: 'marketing attribution software', volume: 8900, difficulty: 65, position: 12, opportunity: 'High' },
        { keyword: 'customer journey analytics', volume: 5400, difficulty: 58, position: 8, opportunity: 'Medium' },
        { keyword: 'multi touch attribution', volume: 3200, difficulty: 72, position: 23, opportunity: 'High' },
        { keyword: 'ai marketing tools', volume: 12000, difficulty: 78, position: 15, opportunity: 'High' },
        { keyword: 'predictive analytics marketing', volume: 2800, difficulty: 54, position: 7, opportunity: 'Low' }
      ],
      trends: {
        impressions: 2847329,
        impressionsGrowth: 67.8,
        clicks: 89234,
        clicksGrowth: 89.2,
        averagePosition: 7.3,
        positionImprovement: 4.7
      }
    },

    // Content Performance
    content: {
      totalPieces: 247,
      published: 189,
      inProgress: 43,
      planned: 15,
      performance: [
        { title: 'The Complete Guide to Marketing Attribution', views: 45670, conversions: 234, roi: 856 },
        { title: 'AI-Powered Customer Journey Mapping', views: 32890, conversions: 167, roi: 678 },
        { title: '10 Attribution Models Every Marketer Should Know', views: 28340, conversions: 142, roi: 534 },
        { title: 'How to Track Multi-Touch Attribution', views: 19870, conversions: 98, roi: 423 },
        { title: 'Predictive Analytics for Marketing Teams', views: 15680, conversions: 89, roi: 387 }
      ],
      metrics: {
        averageViews: 8947,
        averageConversions: 67,
        averageROI: 445,
        contentROIGrowth: 127.8
      }
    },

    // Customer Journey Analytics
    journey: {
      averageJourneyLength: 7.3,
      averageTouchpoints: 12.8,
      averageTimeToConversion: 23.4, // days
      stages: [
        { stage: 'Awareness', visitors: 45670, conversion: 12.4 },
        { stage: 'Interest', visitors: 5663, conversion: 23.7 },
        { stage: 'Consideration', visitors: 1342, conversion: 34.8 },
        { stage: 'Intent', visitors: 467, conversion: 56.2 },
        { stage: 'Purchase', visitors: 262, conversion: 78.9 }
      ],
      topPaths: [
        'Organic Search → Blog → Email → Purchase',
        'Social Media → Landing Page → Retargeting → Purchase',
        'Paid Search → Product Page → Email → Purchase',
        'Direct → Blog → Social → Email → Purchase'
      ]
    },

    // AI Insights & Predictions
    aiInsights: {
      predictionAccuracy: 94.7,
      recommendations: [
        {
          type: 'Budget Reallocation',
          impact: 'High',
          description: 'Shift 15% budget from paid social to organic content for 23% ROI improvement',
          confidence: 89
        },
        {
          type: 'Content Optimization',
          impact: 'Medium',
          description: 'Update attribution guide with AI focus for 67% more conversions',
          confidence: 76
        },
        {
          type: 'Channel Expansion',
          impact: 'High',
          description: 'LinkedIn ads show 156% higher enterprise conversion potential',
          confidence: 92
        }
      ],
      forecasting: {
        nextMonth: {
          revenue: 2847920,
          growth: 21.3,
          confidence: 87
        },
        nextQuarter: {
          revenue: 8934760,
          growth: 78.9,
          confidence: 82
        }
      }
    },

    // Real-time Metrics (updates every few seconds)
    realTime: {
      activeVisitors: 1247,
      conversionsToday: 89,
      revenueToday: 23470,
      topPages: [
        '/attribution-guide',
        '/pricing',
        '/demo',
        '/ai-features'
      ],
      liveEvents: [
        { time: '2 min ago', event: 'New enterprise trial signup - TechCorp Inc.' },
        { time: '5 min ago', event: 'Attribution analysis completed - 94% accuracy' },
        { time: '8 min ago', event: 'AI prediction: 23% revenue increase next month' },
        { time: '12 min ago', event: 'Customer journey mapped - 15 touchpoints identified' }
      ]
    }
  };
};

// Generate time-series data for charts
export const generateTimeSeriesData = (days = 30, baseValue = 1000, growth = 0.1) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Add some realistic variation
    const trend = baseValue * (1 + (growth * i / days));
    const noise = (Math.random() - 0.5) * 0.2 * trend;
    const value = Math.max(0, Math.round(trend + noise));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: value,
      formattedDate: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    });
  }
  
  return data;
};

// Generate realistic competitor data
export const generateCompetitorData = () => {
  return [
    {
      name: 'HubSpot',
      price: 800,
      features: ['Basic Attribution', 'CRM Integration', 'Email Marketing'],
      limitations: ['No AI insights', 'Limited attribution models', 'Expensive'],
      marketShare: 12.4,
      userSatisfaction: 3.8
    },
    {
      name: 'Adobe Analytics', 
      price: 1200,
      features: ['Advanced Analytics', 'Custom Reports', 'Enterprise Scale'],
      limitations: ['Complex setup', 'No predictive AI', 'Requires training'],
      marketShare: 8.9,
      userSatisfaction: 3.5
    },
    {
      name: 'Keywords Everywhere',
      price: 10, // per 100k credits
      features: ['Keyword Research', 'Search Volume', 'Browser Extension'],
      limitations: ['Credit system', 'No attribution', 'Basic data only'],
      marketShare: 2.1,
      userSatisfaction: 3.9
    },
    {
      name: 'AttributeAI',
      price: 197,
      features: ['Multi-AI Intelligence', 'Full Attribution', 'Predictive Analytics', 'Unlimited Research'],
      limitations: ['Newer platform'],
      marketShare: 2.3,
      userSatisfaction: 4.9
    }
  ];
};

// Generate YC-specific metrics that investors care about
export const generateYCMetrics = () => {
  return {
    // Growth metrics
    monthlyGrowthRate: 45.7, // % month over month
    weeklyActiveUsers: 15847,
    userRetention: {
      day1: 89,
      day7: 67,
      day30: 45
    },
    
    // Revenue metrics
    monthlyRecurringRevenue: 89420,
    annualRecurringRevenue: 1073040,
    averageRevenuePerUser: 197,
    customerLifetimeValue: 2847,
    paybackPeriod: 3.2, // months
    
    // Market metrics
    totalAddressableMarket: 15600000000, // $15.6B
    serviceableAddressableMarket: 2340000000, // $2.34B
    currentMarketPenetration: 0.000046, // Very early stage
    
    // Competitive metrics
    competitiveDifferentiation: [
      'Only multi-AI attribution platform',
      'Unlimited keyword research (no credits)',
      'Real-time predictive analytics',
      '10x better price-to-value ratio'
    ],
    
    // Team efficiency metrics
    engineeringProductivity: 156, // % above industry average
    customerSupportSatisfaction: 4.8,
    netPromoterScore: 67
  };
};

export default {
  generateDemoData,
  generateTimeSeriesData,
  generateCompetitorData,
  generateYCMetrics
};
