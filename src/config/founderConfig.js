// Founder Account Configuration
// Unlimited access setup for Chris (founder)

const FOUNDER_CONFIG = {
  // Your email addresses that should have unlimited access
  founderEmails: [
    'infinitebuildsolutions2024@gmail.com',
    'chris@attributeai.app', // If you have this
    'christo@attributeai.app' // Alternative
  ],
  
  // Founder subscription tier
  tier: 'founder',
  
  // Unlimited usage limits
  unlimitedUsage: {
    keywords_per_month: 999999,
    content_pieces_per_month: 999999,
    attribution_queries_per_month: 999999,
    ai_requests_per_day: 999999,
    export_downloads_per_month: 999999,
    api_calls_per_hour: 999999
  },
  
  // Special founder features
  features: [
    'unlimited_everything',
    'admin_panel_access',
    'usage_analytics_view',
    'export_all_data',
    'priority_support',
    'beta_features',
    'white_label_access',
    'api_access',
    'team_management'
  ]
};

// Check if email is founder email
export const isFounderEmail = (email) => {
  if (!email) return false;
  return FOUNDER_CONFIG.founderEmails.includes(email.toLowerCase());
};

// Get founder profile data
export const getFounderProfile = (user, additionalData = {}) => {
  return {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || additionalData.full_name || 'Chris (Founder)',
    avatar_url: user.user_metadata?.avatar_url,
    subscription_tier: 'founder',
    is_founder: true,
    monthly_usage: {
      keywords_analyzed: 0,
      content_generated: 0,
      attribution_queries: 0
    },
    usage_limits: FOUNDER_CONFIG.unlimitedUsage,
    features: FOUNDER_CONFIG.features,
    created_at: new Date().toISOString(),
    ...additionalData
  };
};

export default FOUNDER_CONFIG;
