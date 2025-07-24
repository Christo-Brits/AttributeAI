import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Zap, AlertCircle, CheckCircle, Clock, Users, Globe, Brain, MessageCircle, Search, Eye, PenTool, Edit3, Shield, Crown } from 'lucide-react';
import { Card, Button } from './ui/DesignSystem';
import { useDataBridge } from '../utils/DataBridge';
import { useAuth } from './auth/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAttributeAIAnalytics } from '../hooks/useAttributeAIAnalytics';
import AttributeAILogo from './ui/AttributeAILogo';
import WeatherWidget from './WeatherWidget';
import './WeatherWidget.css';
import { ConversionBanner, QuickSignupModal } from './immediate-conversion-system';
import YCDemoMode from './YCDemoMode';
import logger from '../utils/logger';
// import TrialCountdownBanner from './TrialCountdownBanner'; // Temporarily disabled

const UnifiedDashboard = ({ websiteAnalysis, onNavigateToTab }) => {
  const { user } = useAuth();
  const { data, generateUnifiedInsights } = useDataBridge();
  const { trackPage, trackTool, trackFeature } = useAnalytics();
  const { trackFeatureClick, trackToolStart } = useAttributeAIAnalytics('unified_dashboard');
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showYCDemo, setShowYCDemo] = useState(false);

  const handleKeywordIntelligenceClick = () => {
    // Enhanced analytics tracking
    trackFeatureClick('keyword_intelligence', {
      'source': 'featured_callout',
      'cta_type': 'primary_feature',
      'user_segment': user?.industry || 'unknown'
    });
    
    trackToolStart('keyword_intelligence', {
      'entry_point': 'dashboard_featured',
      'user_type': user ? 'registered' : 'guest'
    });
    
    // Legacy tracking (keep for compatibility)
    trackTool('keyword_intelligence', 'navigate_from_dashboard', { source: 'featured_callout' });
    trackFeature('keyword_intelligence', true);
    
    if (onNavigateToTab) {
      onNavigateToTab('keyword-intelligence');
    } else {
      logger.warn('Navigation handler not available for keyword intelligence');
    }
  };

  // Navigation handlers for action buttons
  const handleSEOAnalysisClick = () => {
    trackFeatureClick('seo_analysis', {
      'source': 'no_insights_section',
      'cta_type': 'action_button'
    });
    
    trackTool('seo_analysis', 'navigate_from_dashboard', { source: 'no_insights_section' });
    if (onNavigateToTab) {
      onNavigateToTab('seo-enhanced');
    } else {
      logger.warn('Navigation handler not available for SEO analysis');
    }
  };

  const handleGenerateContentClick = () => {
    trackFeatureClick('content_generation', {
      'source': 'no_insights_section',
      'cta_type': 'action_button'
    });
    
    trackTool('content_generation', 'navigate_from_dashboard', { source: 'no_insights_section' });
    if (onNavigateToTab) {
      onNavigateToTab('enhanced-content');
    } else {
      logger.warn('Navigation handler not available for content generation');
    }
  };

  const handleCROAnalysisClick = () => {
    trackFeatureClick('cro_analysis', {
      'source': 'no_insights_section',
      'cta_type': 'action_button'
    });
    
    trackTool('cro_analysis', 'navigate_from_dashboard', { source: 'no_insights_section' });
    if (onNavigateToTab) {
      onNavigateToTab('cro');
    } else {
      logger.warn('Navigation handler not available for CRO analysis');
    }
  };

  const handleSignupSuccess = (userData) => {
    logger.success('New user signed up from dashboard', { userId: userData?.id, email: userData?.email });
    // Track the conversion
    if (window.gtag) {
      window.gtag('event', 'signup_completed', {
        event_category: 'conversion',
        event_label: 'dashboard_banner',
        value: 1
      });
    }
    // Refresh page to show authenticated state
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    // Track dashboard page view
    trackPage('Unified Dashboard', 'core_platform');
    
    // Generate insights from available data
    const loadInsights = async () => {
      setIsLoading(true);
      try {
        const unifiedInsights = await generateUnifiedInsights();
        setInsights(unifiedInsights);
      } catch (error) {
        console.error('Failed to load insights:', error);
        setInsights(null);
      }
      setIsLoading(false);
    };

    loadInsights();
  }, [data]);

  // YC Demo Mode Check
  if (showYCDemo) {
    return <YCDemoMode onNavigate={onNavigateToTab} />;
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-4">
      {/* YC Demo Toggle Button */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000 
      }}>
        <button
          onClick={() => setShowYCDemo(true)}
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            color: '#1f2937',
            border: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
          }}
        >
          <Crown size={16} />
          YC DEMO MODE
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Marketing Intelligence Dashboard
          </h1>
          <p className="text-lg text-gray-400">
            Unified insights from all your marketing analysis tools
          </p>
        </div>

        {/* Onboarding Checklist for New Users */}
        {(!insights || !data || Object.keys(data).length === 0) && user && (
          <div className="bg-gradient-to-r from-blue-800/50 to-purple-800/50 backdrop-blur-sm border border-blue-600/50 rounded-xl p-6 mb-8 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-white mb-2">
                🚀 Welcome to AttributeAI! Let's get you started
              </h3>
              <p className="text-gray-300">Complete these 3 steps to unlock your marketing intelligence</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1: Connect GA4 */}
              <div className="bg-gray-900/60 backdrop-blur p-6 rounded-xl border border-gray-700 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <h4 className="font-bold text-white mb-2">1. Connect Analytics</h4>
                <p className="text-gray-400 text-sm mb-4">Link Google Analytics to track visitor behavior</p>
                <Button 
                  onClick={() => onNavigateToTab('seo-competitor-analysis')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm"
                >
                  Connect GA4 →
                </Button>
              </div>

              {/* Step 2: Import Ad Spend */}
              <div className="bg-gray-900/60 backdrop-blur p-6 rounded-xl border border-gray-700 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <h4 className="font-bold text-white mb-2">2. Import Ad Spend</h4>
                <p className="text-gray-400 text-sm mb-4">Upload campaign data for attribution analysis</p>
                <Button 
                  onClick={() => onNavigateToTab('attribution-engine')}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm"
                >
                  Import Data →
                </Button>
              </div>

              {/* Step 3: Run First Attribution */}
              <div className="bg-gray-900/60 backdrop-blur p-6 rounded-xl border border-gray-700 text-center">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Target className="w-6 h-6 text-pink-400" />
                </div>
                <h4 className="font-bold text-white mb-2">3. Run Attribution</h4>
                <p className="text-gray-400 text-sm mb-4">Generate your first attribution report</p>
                <Button 
                  onClick={handleKeywordIntelligenceClick}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 text-sm"
                >
                  Start Analysis →
                </Button>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-400">0 of 3 steps completed • Takes about 5 minutes</p>
            </div>
          </div>
        )}

        {/* Conversion Banner - Only show for unauthenticated users */}
        {!user && <ConversionBanner onSignup={() => setShowSignupModal(true)} />}

        {/* Trial Countdown Banner - Temporarily disabled for investor demo */}
        {/* {user && <TrialCountdownBanner />} */}

        {/* Featured Tool Callout */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                🚀 New: Keyword Intelligence Engine
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300"><strong className="text-white">Unlimited Research</strong> • No credit limits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-300"><strong className="text-white">Multi-AI Analysis</strong> • Claude + GPT-4 + Gemini</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-pink-400" />
                  <span className="text-gray-300"><strong className="text-white">Attribution Intelligence</strong> • Conversion insights</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">10x Better Value</div>
              <div className="text-sm text-gray-400">vs Keywords Everywhere</div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={handleKeywordIntelligenceClick}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-2 text-lg font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Try Keyword Intelligence
            </Button>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center group hover:scale-105 transition-all duration-300">
            <BarChart3 className="h-8 w-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-white">
              {insights?.performanceScore || 85}
            </div>
            <div className="text-sm text-gray-400">Overall Performance</div>
            <div className="text-xs text-green-400 mt-1">
              {insights?.performanceScore > 70 ? '↗ Excellent' : 
               insights?.performanceScore > 50 ? '→ Good' : '↘ Needs Work'}
            </div>
          </Card>

          <Card className="text-center group hover:scale-105 transition-all duration-300">
            <Target className="h-8 w-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-white">
              {insights?.topOpportunities?.length || 0}
            </div>
            <div className="text-sm text-gray-400">Top Opportunities</div>
            <div className="text-xs text-blue-400 mt-1">Ready to implement</div>
          </Card>

          <Card className="text-center group hover:scale-105 transition-all duration-300">
            <Zap className="h-8 w-8 text-pink-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold text-white">
              {insights?.quickWins?.length || 0}
            </div>
            <div className="text-sm text-gray-400">Quick Wins</div>
            <div className="text-xs text-orange-400 mt-1">Low effort, high impact</div>
          </Card>
        </div>

        {/* Quick Wins Section */}
        {insights?.quickWins?.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              Quick Wins - Implement These First
            </h3>
            <div className="space-y-3">
              {insights.quickWins.slice(0, 5).map((win, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{win.title || win}</span>
                    {win.impact && (
                      <div className="text-sm text-gray-600 mt-1">
                        Impact: {win.impact} • Effort: {win.effort}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Top Opportunities */}
        {insights?.topOpportunities?.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Top Growth Opportunities
            </h3>
            <div className="space-y-3">
              {insights.topOpportunities.slice(0, 5).map((opportunity, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">{opportunity.title || opportunity}</span>
                    {opportunity.potential && (
                      <div className="text-sm text-gray-600 mt-1">
                        Potential: {opportunity.potential}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Compact Empty State - Show when no insights yet */}
        {(!insights || (!insights?.quickWins?.length && !insights?.topOpportunities?.length)) && (
          <Card className="text-center py-6">
            <div className="mb-4">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Generate Insights</h3>
              <p className="text-sm text-gray-500 mb-4">
                Run analysis in any tool to see unified insights here
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={handleSEOAnalysisClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
              >
                Run SEO Analysis
              </Button>
              <Button
                onClick={handleGenerateContentClick}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm"
              >
                Generate Content
              </Button>
              <Button
                onClick={handleCROAnalysisClick}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
              >
                Analyze CRO
              </Button>
              <Button
                onClick={() => onNavigateToTab && onNavigateToTab('surveys')}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 text-sm"
              >
                Test Surveys
              </Button>
            </div>
          </Card>
        )}


      </div>
      
      {/* Weather Intelligence Widget - Compact */}
      <div className="flex justify-end">
        <WeatherWidget />
      </div>
      
      {/* Footer */}
      <footer className="mt-6 text-center text-xs text-gray-500 py-3">
        &copy; {new Date().getFullYear()} AttributeAI &mdash; <a href="/privacy-policy.html" className="hover:underline text-blue-500">Privacy Policy</a>
      </footer>
      
      {/* Quick Signup Modal - Only show for unauthenticated users */}
      {!user && (
        <QuickSignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          onSuccess={handleSignupSuccess}
        />
      )}
    </div>
  );
};

export default UnifiedDashboard;