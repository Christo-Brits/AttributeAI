import React, { useState, useEffect } from 'react';
import { useViewport } from '../hooks/useViewport';
import { useAuth } from './auth/AuthContext';
import { useDataBridge } from '../utils/DataBridge';
import { useAttributeAIAnalytics } from '../hooks/useAttributeAIAnalytics';
import { TouchFeedback, useMobileAnalytics } from './MobileOptimizations';
import MobileStatusIndicator from './MobileStatusIndicator';
import DynamicGrid from './DynamicGrid';
import { MobileCard, MobileButton } from './ui/DesignSystem';

const MobileUnifiedDashboard = ({ websiteAnalysis, onNavigateToTab }) => {
  const [activeMetric, setActiveMetric] = useState(null);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { data, generateUnifiedInsights } = useDataBridge();
  const { trackFeatureClick, trackToolStart } = useAttributeAIAnalytics('mobile_dashboard');
  const { trackMobileEvent } = useMobileAnalytics();
  const { isMobile, isTablet, width } = useViewport();

  // Sample metrics data - will be replaced with real data from DataBridge
  const metrics = [
    {
      id: 'attribution',
      title: 'Attribution Score',
      value: '94%',
      change: '+12%',
      trend: 'up',
      icon: '🎯',
      color: '#4CAF50',
      description: 'Overall marketing attribution performance across all channels'
    },
    {
      id: 'content',
      title: 'Content Performance',
      value: '87%',
      change: '+8%',
      trend: 'up',
      icon: '📝',
      color: '#2196F3',
      description: 'Content engagement and conversion rates'
    },
    {
      id: 'keywords',
      title: 'Keyword Rankings',
      value: '142',
      change: '+23',
      trend: 'up',
      icon: '🔍',
      color: '#FF9800',
      description: 'Keywords in top 10 positions'
    },
    {
      id: 'conversions',
      title: 'Conversion Rate',
      value: '3.4%',
      change: '+0.7%',
      trend: 'up',
      icon: '💰',
      color: '#9C27B0',
      description: 'Overall conversion performance'
    }
  ];

  // Quick actions with mobile-friendly labels
  const quickActions = [
    {
      id: 'keyword-intelligence',
      label: isMobile ? 'Keywords' : 'Keyword Research',
      icon: '🔍',
      color: '#667eea',
      description: 'AI-powered keyword research'
    },
    {
      id: 'enhanced-content',
      label: isMobile ? 'Content' : 'Generate Content',
      icon: '✍️',
      color: '#764ba2',
      description: 'Multi-model content generation'
    },
    {
      id: 'attribution',
      label: isMobile ? 'Analytics' : 'View Analytics',
      icon: '📊',
      color: '#f093fb',
      description: 'Attribution modeling'
    },
    {
      id: 'seo-enhanced',
      label: isMobile ? 'SEO' : 'SEO Analysis',
      icon: '🎯',
      color: '#4facfe',
      description: 'Competitor analysis'
    },
    {
      id: 'crm-dashboard',
      label: isMobile ? 'CRM' : 'Customer CRM',
      icon: '👥',
      color: '#a8edea',
      description: 'Revenue attribution'
    },
    {
      id: 'leadmagnet',
      label: isMobile ? 'Lead Gen' : 'Lead Magnets',
      icon: '🧲',
      color: '#ffc3a0',
      description: 'Lead generation tools'
    }
  ];

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const unifiedInsights = generateUnifiedInsights();
        setInsights(unifiedInsights);
      } catch (error) {
        console.error('Error loading insights:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 1000); // Smooth loading
      }
    };

    loadInsights();
  }, [data, generateUnifiedInsights]);

  const handleMetricClick = (index) => {
    const metric = metrics[index];
    trackFeatureClick(`metric_${metric.id}`, {
      source: 'dashboard_card',
      metric_value: metric.value,
      is_mobile: isMobile
    });
    
    // Enhanced mobile analytics
    trackMobileEvent('metric_card_click', {
      metric_id: metric.id,
      metric_value: metric.value,
      action: activeMetric === index ? 'collapse' : 'expand',
      user_id: user?.id || 'anonymous'
    });
    
    setActiveMetric(activeMetric === index ? null : index);
  };

  const handleActionClick = (actionId) => {
    trackToolStart(actionId, {
      source: 'dashboard_quick_actions',
      is_mobile: isMobile
    });
    
    // Enhanced mobile analytics
    trackMobileEvent('dashboard_action_click', {
      action_id: actionId,
      source: 'quick_actions',
      user_id: user?.id || 'anonymous'
    });
    
    onNavigateToTab(actionId);
  };

  return (
    <div 
      className="mobile-dashboard"
      style={{
        padding: isMobile ? '1rem' : '1.5rem',
        paddingBottom: isMobile ? '80px' : '1.5rem', // Account for bottom tabs
        minHeight: '100vh',
        background: 'var(--bg-primary, #0a0b0f)'
      }}
    >
      {/* Hero Section */}
      <div className="dashboard-hero" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 
          className="hero-title"
          style={{
            fontSize: isMobile ? '1.75rem' : '2.5rem',
            fontWeight: 700,
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: '#fff' // Fallback for browsers that don't support gradient text
          }}
        >
          {isMobile ? 'Dashboard' : 'Attribution Intelligence Dashboard'}
        </h1>
        <p 
          className="hero-subtitle"
          style={{
            fontSize: isMobile ? '1rem' : '1.125rem',
            color: '#9ca3af',
            margin: 0
          }}
        >
          Real-time marketing performance insights
        </p>
      </div>

      {/* Featured Keyword Intelligence Callout - Mobile Optimized */}
      {!user?.hasUsedKeywordIntelligence && (
        <MobileCard
          className="mb-6"
          style={{
            background: 'linear-gradient(135deg, #667eea 10%, #764ba2 100%)',
            border: 'none',
            color: '#fff'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚀</div>
            <h3 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              NEW: Unlimited Keyword Intelligence
            </h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: '0 0 1rem 0' }}>
              {isMobile 
                ? 'AI-powered research with no credit limits' 
                : 'Research unlimited keywords with multi-model AI analysis - no credit limits like Keywords Everywhere'
              }
            </p>
            <MobileButton
              variant="outline"
              onClick={() => handleActionClick('keyword-intelligence')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#fff'
              }}
            >
              Try Keyword Intelligence
            </MobileButton>
          </div>
        </MobileCard>
      )}

      {/* Metrics Grid */}
      <DynamicGrid minCardWidth={250} gap="responsive">
        {metrics.map((metric, index) => (
          <TouchFeedback 
            key={metric.id}
            onTouch={() => trackMobileEvent('metric_card_touch', { metric_id: metric.id })}
          >
            <MobileCard
              interactive={true}
              className={`metric-card ${activeMetric === index ? 'expanded' : ''}`}
              onClick={() => handleMetricClick(index)}
              style={{
                transform: activeMetric === index ? 'scale(1.02)' : 'scale(1)',
                boxShadow: activeMetric === index 
                  ? '0 12px 40px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: activeMetric === index ? 10 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {/* Metric Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <span style={{ 
                fontSize: '1.5rem',
                color: metric.color 
              }}>
                {metric.icon}
              </span>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                padding: '0.25rem 0.5rem',
                borderRadius: '6px',
                background: metric.trend === 'up' ? '#dcfce7' : '#fef2f2',
                color: metric.trend === 'up' ? '#166534' : '#dc2626'
              }}>
                {metric.change}
              </span>
            </div>

            {/* Metric Content */}
            <div style={{ textAlign: 'center' }}>
              <h3 style={{
                fontSize: isMobile ? '2rem' : '2.5rem',
                fontWeight: 700,
                color: '#fff',
                margin: 0
              }}>
                {metric.value}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
                margin: '0.5rem 0 0 0'
              }}>
                {metric.title}
              </p>
            </div>

            {/* Expanded Details */}
            {activeMetric === index && (
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #374151',
                animation: 'slideDown 0.3s ease-out'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '1rem',
                  background: '#1f2937',
                  borderRadius: '8px',
                  color: '#9ca3af',
                  fontSize: '0.875rem'
                }}>
                  {metric.description}
                  <br />
                  📈 Performance trending upward
                </div>
              </div>
            )}
          </MobileCard>
          </TouchFeedback>
        ))}
      </DynamicGrid>

      {/* Quick Actions */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#fff',
          margin: '0 0 1rem 0'
        }}>
          Quick Actions
        </h2>
        <DynamicGrid minCardWidth={200} gap="responsive">
          {quickActions.map(action => (
            <TouchFeedback 
              key={action.id}
              onTouch={() => trackMobileEvent('quick_action_touch', { action_id: action.id })}
            >
              <MobileCard
                interactive={true}
                onClick={() => handleActionClick(action.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  minHeight: isMobile ? '80px' : '100px',
                  textAlign: 'center'
                }}
              >
              <span style={{ fontSize: '1.5rem' }}>{action.icon}</span>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#fff'
              }}>
                {action.label}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginTop: '0.25rem'
              }}>
                {action.description}
              </span>
            </MobileCard>
            </TouchFeedback>
          ))}
        </DynamicGrid>
      </div>

      {/* Mobile Status Indicator */}
      <MobileStatusIndicator show={isMobile || isTablet} />

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MobileUnifiedDashboard;
