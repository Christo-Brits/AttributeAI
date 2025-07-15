// Weather Intelligence API Routes for n8n Integration
const express = require('express');
const router = express.Router();

// In-memory storage for demo (replace with Supabase in production)
let weatherInsights = [];
let customerSegments = [];
let campaignOptimizations = [];
let userLocations = [
  { 
    id: 1, 
    city: 'Auckland', 
    country: 'NZ', 
    latitude: -36.8485, 
    longitude: 174.7633, 
    user_count: 1250 
  },
  { 
    id: 2, 
    city: 'Wellington', 
    country: 'NZ', 
    latitude: -41.2865, 
    longitude: 174.7762, 
    user_count: 890 
  },
  { 
    id: 3, 
    city: 'Christchurch', 
    country: 'NZ', 
    latitude: -43.5321, 
    longitude: 172.6362, 
    user_count: 756 
  }
];

// Sample campaign data
let activeCampaigns = [
  {
    id: 1,
    name: "Summer Content Marketing",
    type: "content",
    budget: 5000,
    target_audience: "B2B marketers",
    status: "active",
    weather_sensitivity: "high"
  },
  {
    id: 2,
    name: "SEO Tool Promotion",
    type: "paid_ads",
    budget: 8000,
    target_audience: "SEO professionals",
    status: "active", 
    weather_sensitivity: "medium"
  },
  {
    id: 3,
    name: "Attribution Platform Demo",
    type: "email",
    budget: 2000,
    target_audience: "Marketing managers",
    status: "active",
    weather_sensitivity: "low"
  }
];

// POST /api/weather-insights - Store weather analysis
router.post('/weather-insights', (req, res) => {
  try {
    const insight = {
      id: weatherInsights.length + 1,
      ...req.body,
      created_at: new Date().toISOString()
    };
    
    weatherInsights.push(insight);
    
    // Keep only last 100 insights
    if (weatherInsights.length > 100) {
      weatherInsights = weatherInsights.slice(-100);
    }
    
    console.log('✅ Weather insight stored:', {
      id: insight.id,
      location: insight.location,
      temperature: insight.weather?.temperature,
      timestamp: insight.created_at
    });
    
    res.json({ 
      success: true, 
      id: insight.id,
      message: 'Weather insight stored successfully'
    });
  } catch (error) {
    console.error('❌ Error storing weather insight:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to store weather insight' 
    });
  }
});

// GET /api/weather-insights - Retrieve weather insights
router.get('/weather-insights', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const recent = weatherInsights.slice(-limit).reverse();
    
    res.json({
      success: true,
      insights: recent,
      total: weatherInsights.length
    });
  } catch (error) {
    console.error('❌ Error retrieving weather insights:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve weather insights' 
    });
  }
});

// GET /api/user-locations - Get user location data
router.get('/user-locations', (req, res) => {
  try {
    res.json({
      success: true,
      locations: userLocations,
      total_users: userLocations.reduce((sum, loc) => sum + loc.user_count, 0)
    });
  } catch (error) {
    console.error('❌ Error retrieving user locations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve user locations' 
    });
  }
});

// POST /api/customer-segments - Store customer segmentation data
router.post('/customer-segments', (req, res) => {
  try {
    const segment = {
      id: customerSegments.length + 1,
      ...req.body,
      created_at: new Date().toISOString()
    };
    
    customerSegments.push(segment);
    
    // Keep only last 200 segments
    if (customerSegments.length > 200) {
      customerSegments = customerSegments.slice(-200);
    }
    
    console.log('✅ Customer segment stored:', {
      id: segment.id,
      location: `${segment.location?.city}, ${segment.location?.country}`,
      users_affected: segment.users_affected,
      weather: segment.weather?.description
    });
    
    res.json({ 
      success: true, 
      id: segment.id,
      message: 'Customer segment stored successfully'
    });
  } catch (error) {
    console.error('❌ Error storing customer segment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to store customer segment' 
    });
  }
});

// GET /api/customer-segments - Retrieve customer segments
router.get('/customer-segments', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const recent = customerSegments.slice(-limit).reverse();
    
    res.json({
      success: true,
      segments: recent,
      total: customerSegments.length
    });
  } catch (error) {
    console.error('❌ Error retrieving customer segments:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve customer segments' 
    });
  }
});

// GET /api/active-campaigns - Get active campaign data
router.get('/active-campaigns', (req, res) => {
  try {
    const campaigns = activeCampaigns.filter(campaign => campaign.status === 'active');
    
    res.json({
      success: true,
      campaigns: campaigns,
      total_budget: campaigns.reduce((sum, campaign) => sum + campaign.budget, 0)
    });
  } catch (error) {
    console.error('❌ Error retrieving active campaigns:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve active campaigns' 
    });
  }
});

// POST /api/campaign-optimizations - Store campaign optimization recommendations
router.post('/campaign-optimizations', (req, res) => {
  try {
    const optimization = {
      id: campaignOptimizations.length + 1,
      ...req.body,
      created_at: new Date().toISOString()
    };
    
    campaignOptimizations.push(optimization);
    
    // Keep only last 100 optimizations
    if (campaignOptimizations.length > 100) {
      campaignOptimizations = campaignOptimizations.slice(-100);
    }
    
    console.log('✅ Campaign optimization stored:', {
      id: optimization.id,
      campaigns_count: optimization.campaigns?.length || 0,
      confidence_score: optimization.confidence_score,
      recommendations_count: optimization.recommendations_count
    });
    
    res.json({ 
      success: true, 
      id: optimization.id,
      message: 'Campaign optimization stored successfully'
    });
  } catch (error) {
    console.error('❌ Error storing campaign optimization:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to store campaign optimization' 
    });
  }
});

// GET /api/campaign-optimizations - Retrieve campaign optimizations
router.get('/campaign-optimizations', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const recent = campaignOptimizations.slice(-limit).reverse();
    
    res.json({
      success: true,
      optimizations: recent,
      total: campaignOptimizations.length
    });
  } catch (error) {
    console.error('❌ Error retrieving campaign optimizations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve campaign optimizations' 
    });
  }
});

// POST /api/slack-notifications - Handle Slack notification requests
router.post('/slack-notifications', (req, res) => {
  try {
    const { channel, message, timestamp } = req.body;
    
    // In a real implementation, this would send to Slack
    // For now, we'll just log it
    console.log('🔔 Slack Notification:', {
      channel,
      timestamp,
      preview: message.substring(0, 100) + '...'
    });
    
    res.json({ 
      success: true, 
      message: 'Notification logged successfully',
      // In production, you'd return Slack API response
      slack_response: {
        ok: true,
        ts: timestamp,
        channel: channel
      }
    });
  } catch (error) {
    console.error('❌ Error handling Slack notification:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send notification' 
    });
  }
});

// POST /api/notifications - General notification endpoint
router.post('/notifications', (req, res) => {
  try {
    const notification = {
      id: Date.now(),
      ...req.body,
      created_at: new Date().toISOString()
    };
    
    console.log('📢 Notification received:', {
      type: notification.type,
      title: notification.title,
      severity: notification.severity
    });
    
    res.json({ 
      success: true, 
      id: notification.id,
      message: 'Notification processed successfully'
    });
  } catch (error) {
    console.error('❌ Error processing notification:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process notification' 
    });
  }
});

// GET /api/weather-intelligence/dashboard - Dashboard summary data
router.get('/weather-intelligence/dashboard', (req, res) => {
  try {
    const dashboard = {
      weather_insights: {
        total: weatherInsights.length,
        latest: weatherInsights[weatherInsights.length - 1] || null,
        today_count: weatherInsights.filter(insight => 
          new Date(insight.created_at).toDateString() === new Date().toDateString()
        ).length
      },
      customer_segments: {
        total: customerSegments.length,
        locations_tracked: userLocations.length,
        total_users: userLocations.reduce((sum, loc) => sum + loc.user_count, 0)
      },
      campaign_optimizations: {
        total: campaignOptimizations.length,
        high_confidence: campaignOptimizations.filter(opt => 
          opt.confidence_score && opt.confidence_score > 0.7
        ).length,
        active_campaigns: activeCampaigns.filter(c => c.status === 'active').length
      },
      system_status: {
        weather_api: 'connected',
        ai_analysis: 'active',
        storage: 'operational',
        last_update: new Date().toISOString()
      }
    };
    
    res.json({
      success: true,
      dashboard
    });
  } catch (error) {
    console.error('❌ Error generating dashboard data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate dashboard data' 
    });
  }
});

module.exports = router;