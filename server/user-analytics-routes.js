// User Analytics & Conversion Tracking API Routes
const express = require('express');
const router = express.Router();

// In-memory storage for demo (replace with Supabase in production)
let users = [
  {
    id: 1,
    email: 'demo@attributeai.app',
    firstName: 'Demo',
    lastName: 'User',
    accountType: 'free',
    signupDate: '2025-06-10T10:30:00Z',
    lastActive: '2025-06-16T00:15:00Z',
    country: 'New Zealand',
    city: 'Auckland',
    industry: 'E-commerce',
    conversionStage: 'trial',
    totalSessions: 15,
    featuresUsed: ['keyword-intelligence', 'weather-insights', 'content-strategy'],
    lifetimeValue: 0,
    trialStartDate: '2025-06-10T10:30:00Z',
    trialEndDate: '2025-06-24T10:30:00Z'
  },
  {
    id: 2,
    email: 'sarah@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    accountType: 'professional',
    signupDate: '2025-06-05T14:20:00Z',
    lastActive: '2025-06-15T18:45:00Z',
    country: 'United States',
    city: 'San Francisco',
    industry: 'SaaS & Technology',
    conversionStage: 'paid',
    totalSessions: 32,
    featuresUsed: ['keyword-intelligence', 'content-clusters', 'attribution-engine', 'weather-insights'],
    lifetimeValue: 97,
    trialStartDate: '2025-06-05T14:20:00Z',
    conversionDate: '2025-06-12T09:15:00Z'
  }
];

let userActivities = [
  {
    id: 1,
    userId: 1,
    action: 'login',
    timestamp: '2025-06-16T00:15:00Z',
    metadata: { source: 'direct', device: 'desktop' }
  },
  {
    id: 2,
    userId: 1,
    action: 'feature_used',
    feature: 'keyword-intelligence',
    timestamp: '2025-06-16T00:16:30Z',
    metadata: { searches: 5, keywords_analyzed: 25 }
  },
  {
    id: 3,
    userId: 2,
    action: 'subscription_upgraded',
    timestamp: '2025-06-12T09:15:00Z',
    metadata: { from_plan: 'free', to_plan: 'professional', amount: 97 }
  }
];

let conversionFunnelStages = [
  { stage: 'visitor', name: 'Website Visitor', description: 'Lands on AttributeAI.app' },
  { stage: 'signup', name: 'Account Created', description: 'Completes free trial signup' },
  { stage: 'activated', name: 'First Feature Use', description: 'Uses any AttributeAI tool' },
  { stage: 'engaged', name: 'Multi-Feature User', description: 'Uses 3+ different tools' },
  { stage: 'qualified', name: 'Trial Qualifier', description: 'High engagement + value realization' },
  { stage: 'converted', name: 'Paid Customer', description: 'Upgrades to paid plan' }
];

// GET /api/analytics/dashboard - Main analytics dashboard
router.get('/dashboard', (req, res) => {
  try {
    const now = new Date();
    const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    // Calculate key metrics
    const totalUsers = users.length;
    const activeUsers = users.filter(user => 
      new Date(user.lastActive) > last7Days
    ).length;
    
    const freeUsers = users.filter(user => user.accountType === 'free').length;
    const paidUsers = users.filter(user => user.accountType !== 'free').length;
    
    const newSignupsLast30Days = users.filter(user => 
      new Date(user.signupDate) > last30Days
    ).length;
    
    const totalRevenue = users.reduce((sum, user) => sum + (user.lifetimeValue || 0), 0);
    const avgRevenuePerUser = paidUsers > 0 ? totalRevenue / paidUsers : 0;

    // Conversion funnel analysis
    const funnelData = conversionFunnelStages.map(stage => {
      let count = 0;
      switch(stage.stage) {
        case 'visitor':
          count = 50; // From GA4 data (estimated total visitors)
          break;
        case 'signup':
          count = totalUsers;
          break;
        case 'activated':
          count = users.filter(user => user.featuresUsed.length > 0).length;
          break;
        case 'engaged':
          count = users.filter(user => user.featuresUsed.length >= 3).length;
          break;
        case 'qualified':
          count = users.filter(user => user.totalSessions >= 10).length;
          break;
        case 'converted':
          count = paidUsers;
          break;
      }
      return { ...stage, count };
    });

    // User activity by country
    const usersByCountry = users.reduce((acc, user) => {
      acc[user.country] = (acc[user.country] || 0) + 1;
      return acc;
    }, {});

    // Feature usage analytics
    const featureUsage = users.reduce((acc, user) => {
      user.featuresUsed.forEach(feature => {
        acc[feature] = (acc[feature] || 0) + 1;
      });
      return acc;
    }, {});

    // Recent activity timeline
    const recentActivities = userActivities
      .filter(activity => new Date(activity.timestamp) > last7Days)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);

    const dashboard = {
      overview: {
        totalUsers,
        activeUsers,
        freeUsers,
        paidUsers,
        newSignupsLast30Days,
        totalRevenue,
        avgRevenuePerUser: Math.round(avgRevenuePerUser * 100) / 100,
        conversionRate: totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100 * 100) / 100 : 0
      },
      conversionFunnel: funnelData,
      usersByCountry,
      featureUsage,
      recentActivities,
      trends: {
        dailySignups: generateDailyTrend(users, 'signupDate', 7),
        dailyRevenue: generateDailyRevenueTrend(users, 7),
        featureAdoption: calculateFeatureAdoption(users)
      },
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      dashboard
    });
  } catch (error) {
    console.error('❌ Error generating analytics dashboard:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate analytics dashboard' 
    });
  }
});

// GET /api/analytics/users - Detailed user list with conversion stages
router.get('/users', (req, res) => {
  try {
    const { stage, country, accountType, limit = 50 } = req.query;
    
    let filteredUsers = [...users];
    
    // Apply filters
    if (stage) {
      filteredUsers = filteredUsers.filter(user => user.conversionStage === stage);
    }
    if (country) {
      filteredUsers = filteredUsers.filter(user => user.country === country);
    }
    if (accountType) {
      filteredUsers = filteredUsers.filter(user => user.accountType === accountType);
    }
    
    // Add calculated fields
    const enrichedUsers = filteredUsers.map(user => ({
      ...user,
      daysSinceSignup: Math.floor((new Date() - new Date(user.signupDate)) / (1000 * 60 * 60 * 24)),
      daysSinceActive: Math.floor((new Date() - new Date(user.lastActive)) / (1000 * 60 * 60 * 24)),
      trialDaysRemaining: user.trialEndDate ? 
        Math.max(0, Math.floor((new Date(user.trialEndDate) - new Date()) / (1000 * 60 * 60 * 24))) : null,
      engagementScore: calculateEngagementScore(user)
    })).slice(0, limit);

    res.json({
      success: true,
      users: enrichedUsers,
      total: filteredUsers.length,
      filters: { stage, country, accountType }
    });
  } catch (error) {
    console.error('❌ Error retrieving user analytics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve user analytics' 
    });
  }
});

// POST /api/analytics/track - Track user activity
router.post('/track', (req, res) => {
  try {
    const { userId, action, feature, metadata = {} } = req.body;
    
    const activity = {
      id: userActivities.length + 1,
      userId: parseInt(userId),
      action,
      feature: feature || null,
      timestamp: new Date().toISOString(),
      metadata
    };
    
    userActivities.push(activity);
    
    // Update user last active time
    const user = users.find(u => u.id === parseInt(userId));
    if (user) {
      user.lastActive = activity.timestamp;
      user.totalSessions = user.totalSessions + 1;
      
      // Track feature usage
      if (feature && !user.featuresUsed.includes(feature)) {
        user.featuresUsed.push(feature);
      }
      
      // Update conversion stage based on activity
      updateUserConversionStage(user);
    }
    
    console.log('✅ User activity tracked:', {
      userId,
      action,
      feature,
      timestamp: activity.timestamp
    });
    
    res.json({
      success: true,
      activityId: activity.id,
      message: 'Activity tracked successfully'
    });
  } catch (error) {
    console.error('❌ Error tracking user activity:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to track user activity' 
    });
  }
});

// GET /api/analytics/conversion-funnel - Detailed funnel analysis
router.get('/conversion-funnel', (req, res) => {
  try {
    const funnelData = conversionFunnelStages.map((stage, index) => {
      let count = 0;
      let conversionRate = 0;
      
      switch(stage.stage) {
        case 'visitor':
          count = 50; // From GA4 (estimated)
          break;
        case 'signup':
          count = users.length;
          conversionRate = count / 50 * 100; // visitor to signup
          break;
        case 'activated':
          count = users.filter(user => user.featuresUsed.length > 0).length;
          conversionRate = count / users.length * 100; // signup to activation
          break;
        case 'engaged':
          count = users.filter(user => user.featuresUsed.length >= 3).length;
          const activatedUsers = users.filter(user => user.featuresUsed.length > 0).length;
          conversionRate = activatedUsers > 0 ? count / activatedUsers * 100 : 0;
          break;
        case 'qualified':
          count = users.filter(user => user.totalSessions >= 10).length;
          const engagedUsers = users.filter(user => user.featuresUsed.length >= 3).length;
          conversionRate = engagedUsers > 0 ? count / engagedUsers * 100 : 0;
          break;
        case 'converted':
          count = users.filter(user => user.accountType !== 'free').length;
          const qualifiedUsers = users.filter(user => user.totalSessions >= 10).length;
          conversionRate = qualifiedUsers > 0 ? count / qualifiedUsers * 100 : 0;
          break;
      }
      
      return {
        ...stage,
        count,
        conversionRate: Math.round(conversionRate * 100) / 100,
        dropoffRate: index > 0 ? Math.round((100 - conversionRate) * 100) / 100 : 0
      };
    });

    // Calculate overall funnel metrics
    const totalVisitors = funnelData[0].count;
    const totalConverted = funnelData[funnelData.length - 1].count;
    const overallConversionRate = totalVisitors > 0 ? (totalConverted / totalVisitors) * 100 : 0;

    res.json({
      success: true,
      funnel: funnelData,
      summary: {
        totalVisitors,
        totalConverted,
        overallConversionRate: Math.round(overallConversionRate * 100) / 100,
        biggestDropoff: findBiggestDropoff(funnelData)
      }
    });
  } catch (error) {
    console.error('❌ Error generating conversion funnel:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate conversion funnel' 
    });
  }
});

// Helper functions
function generateDailyTrend(users, dateField, days) {
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const count = users.filter(user => {
      const userDate = new Date(user[dateField]);
      return userDate >= dayStart && userDate <= dayEnd;
    }).length;
    
    trend.push({
      date: dayStart.toISOString().split('T')[0],
      count
    });
  }
  return trend;
}

function generateDailyRevenueTrend(users, days) {
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    
    const revenue = users.filter(user => {
      const conversionDate = user.conversionDate ? new Date(user.conversionDate) : null;
      return conversionDate && conversionDate >= dayStart && conversionDate <= dayEnd;
    }).reduce((sum, user) => sum + (user.lifetimeValue || 0), 0);
    
    trend.push({
      date: dayStart.toISOString().split('T')[0],
      revenue: Math.round(revenue * 100) / 100
    });
  }
  return trend;
}

function calculateFeatureAdoption(users) {
  const features = ['keyword-intelligence', 'content-strategy', 'attribution-engine', 'weather-insights', 'content-clusters'];
  return features.map(feature => ({
    feature,
    users: users.filter(user => user.featuresUsed.includes(feature)).length,
    percentage: Math.round((users.filter(user => user.featuresUsed.includes(feature)).length / users.length) * 100)
  }));
}

function calculateEngagementScore(user) {
  let score = 0;
  score += user.totalSessions * 2; // 2 points per session
  score += user.featuresUsed.length * 10; // 10 points per feature used
  score += user.accountType !== 'free' ? 50 : 0; // 50 points for paid account
  
  const daysSinceSignup = Math.floor((new Date() - new Date(user.signupDate)) / (1000 * 60 * 60 * 24));
  score += Math.max(0, 30 - daysSinceSignup); // More points for recent signups
  
  return Math.min(100, score); // Cap at 100
}

function updateUserConversionStage(user) {
  if (user.accountType !== 'free') {
    user.conversionStage = 'converted';
  } else if (user.totalSessions >= 10) {
    user.conversionStage = 'qualified';
  } else if (user.featuresUsed.length >= 3) {
    user.conversionStage = 'engaged';
  } else if (user.featuresUsed.length > 0) {
    user.conversionStage = 'activated';
  } else {
    user.conversionStage = 'signup';
  }
}

function findBiggestDropoff(funnelData) {
  let biggestDropoff = { stage: '', rate: 0 };
  for (let i = 1; i < funnelData.length; i++) {
    if (funnelData[i].dropoffRate > biggestDropoff.rate) {
      biggestDropoff = {
        stage: funnelData[i].name,
        rate: funnelData[i].dropoffRate
      };
    }
  }
  return biggestDropoff;
}

module.exports = router;