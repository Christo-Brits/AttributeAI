#!/bin/bash
# Manual Founder Account Setup Script
# Run this to instantly grant founder access to your account

echo "🚀 AttributeAI Founder Account Setup"
echo "===================================="

# Set your founder email here
FOUNDER_EMAIL="infinitebuildsolutions2024@gmail.com"

echo "📧 Setting up founder access for: $FOUNDER_EMAIL"

# Create the founder profile in localStorage (for immediate access)
cat << 'EOF' > setup-founder.html
<!DOCTYPE html>
<html>
<head>
    <title>AttributeAI Founder Setup</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f0f9ff; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .founder-badge { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #92400e; padding: 10px 20px; border-radius: 8px; display: inline-block; font-weight: bold; margin: 10px 0; }
        button { background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; margin: 10px 5px; }
        button:hover { background: #2563eb; }
        .success { background: #10b981; }
        .status { padding: 15px; margin: 10px 0; border-radius: 6px; }
        .status.success { background: #d1fae5; color: #065f46; border: 1px solid #10b981; }
        .status.info { background: #dbeafe; color: #1e40af; border: 1px solid #3b82f6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 AttributeAI Founder Access Setup</h1>
        
        <div class="founder-badge">
            👑 FOUNDER ACCESS ACTIVATION
        </div>
        
        <div class="status info">
            <strong>🔧 Setting up unlimited access for:</strong><br>
            infinitebuildsolutions2024@gmail.com
        </div>
        
        <div id="status"></div>
        
        <button onclick="setupFounderAccess()">🚀 Activate Founder Access</button>
        <button onclick="checkCurrentStatus()">📊 Check Current Status</button>
        <button onclick="clearAndReset()">🔄 Reset to Regular User</button>
        
        <div id="results"></div>
        
        <h3>🎯 Founder Features Activated:</h3>
        <ul>
            <li>♾️ Unlimited keyword research</li>
            <li>♾️ Unlimited content generation</li>
            <li>♾️ Unlimited AI requests</li>
            <li>♾️ Unlimited exports</li>
            <li>🎨 Beta features access</li>
            <li>⚡ Priority support</li>
            <li>🔧 Admin panel access</li>
            <li>📊 Usage analytics view</li>
        </ul>
    </div>

    <script>
        function setupFounderAccess() {
            const founderProfile = {
                id: 'founder-' + Date.now(),
                email: 'infinitebuildsolutions2024@gmail.com',
                firstName: 'Chris',
                lastName: 'Founder',
                full_name: 'Chris (Founder)',
                subscription_tier: 'founder',
                is_founder: true,
                usage_limits: {
                    keywords_per_month: 999999,
                    content_pieces_per_month: 999999,
                    attribution_queries_per_month: 999999,
                    ai_requests_per_day: 999999,
                    export_downloads_per_month: 999999,
                    api_calls_per_hour: 999999
                },
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
                ],
                monthly_usage: {
                    keywords_analyzed: 0,
                    content_generated: 0,
                    attribution_queries: 0
                },
                created_at: new Date().toISOString(),
                company: 'AttributeAI',
                industry: 'Technology',
                websiteUrl: 'https://attributeai.app'
            };

            localStorage.setItem('attributeai_user_profile', JSON.stringify(founderProfile));
            
            // Also set authentication state
            sessionStorage.setItem('attributeai_authenticated', 'true');
            localStorage.setItem('attributeai_founder_activated', 'true');
            
            document.getElementById('status').innerHTML = `
                <div class="status success">
                    <strong>🎉 SUCCESS!</strong><br>
                    Founder access activated for infinitebuildsolutions2024@gmail.com<br>
                    <strong>You now have unlimited access to all features!</strong>
                </div>
            `;
            
            setTimeout(() => {
                window.location.href = 'http://localhost:3000/dashboard';
            }, 2000);
        }
        
        function checkCurrentStatus() {
            const profile = JSON.parse(localStorage.getItem('attributeai_user_profile') || '{}');
            const isFounder = profile.is_founder || profile.subscription_tier === 'founder';
            
            document.getElementById('results').innerHTML = `
                <div class="status ${isFounder ? 'success' : 'info'}">
                    <h4>📊 Current Status:</h4>
                    <strong>Email:</strong> ${profile.email || 'Not set'}<br>
                    <strong>Tier:</strong> ${profile.subscription_tier || 'free'}<br>
                    <strong>Founder:</strong> ${isFounder ? '👑 YES' : '👤 No'}<br>
                    <strong>Keyword Limit:</strong> ${profile.usage_limits?.keywords_per_month === 999999 ? '♾️ Unlimited' : profile.usage_limits?.keywords_per_month || 100}<br>
                    <strong>Content Limit:</strong> ${profile.usage_limits?.content_pieces_per_month === 999999 ? '♾️ Unlimited' : profile.usage_limits?.content_pieces_per_month || 5}
                </div>
            `;
        }
        
        function clearAndReset() {
            localStorage.removeItem('attributeai_user_profile');
            localStorage.removeItem('attributeai_founder_activated');
            sessionStorage.removeItem('attributeai_authenticated');
            
            document.getElementById('status').innerHTML = `
                <div class="status info">
                    <strong>🔄 Reset Complete</strong><br>
                    All founder access removed. You are now a regular user.
                </div>
            `;
        }
        
        // Auto-check status on load
        window.onload = checkCurrentStatus;
    </script>
</body>
</html>
EOF

echo "✅ Founder setup page created: setup-founder.html"
echo ""
echo "📋 Next Steps:"
echo "1. Open setup-founder.html in your browser"
echo "2. Click 'Activate Founder Access'"
echo "3. Go to http://localhost:3000 to see unlimited access"
echo ""
echo "🎯 You will have:"
echo "   ♾️ Unlimited keyword research"
echo "   ♾️ Unlimited content generation"
echo "   ♾️ Unlimited AI requests"
echo "   👑 Founder badge displayed"
echo "   🚀 All beta features"
echo ""
echo "🔧 Or run this JavaScript in browser console:"
echo "---"
cat << 'EOF'
// Quick founder access activation
const founderProfile = {
  email: 'infinitebuildsolutions2024@gmail.com',
  firstName: 'Chris', lastName: 'Founder',
  subscription_tier: 'founder', is_founder: true,
  usage_limits: { keywords_per_month: 999999, content_pieces_per_month: 999999, attribution_queries_per_month: 999999 },
  monthly_usage: { keywords_analyzed: 0, content_generated: 0, attribution_queries: 0 }
};
localStorage.setItem('attributeai_user_profile', JSON.stringify(founderProfile));
console.log('🎉 Founder access activated! Refresh the page.');
EOF
echo "---"
echo ""
echo "🚀 Founder Account Setup Complete!"
