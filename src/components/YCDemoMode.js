import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Brain, 
  Globe, 
  Users,
  ArrowRight,
  CheckCircle,
  Crown,
  Sparkles,
  Award,
  X
} from 'lucide-react';

const YCDemoMode = ({ onNavigate }) => {
  const [currentMetric, setCurrentMetric] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentMetric(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const demoMetrics = [
    { 
      label: "Attribution Accuracy",
      value: "94.7%",
      change: "+12.3%",
      icon: Target,
      color: "#10b981"
    },
    { 
      label: "Customer Journey Visibility", 
      value: "100%",
      change: "+47%",
      icon: BarChart3,
      color: "#3b82f6"
    },
    { 
      label: "AI Prediction Confidence",
      value: "97.2%", 
      change: "+23.1%",
      icon: Brain,
      color: "#8b5cf6"
    },
    { 
      label: "Revenue Attribution",
      value: "$2.3M",
      change: "+156%",
      icon: TrendingUp,
      color: "#ec4899"
    }
  ];

  const keyFeatures = [
    {
      title: "Unlimited Keyword Research",
      description: "Keywords Everywhere killer - no more credit limits",
      icon: Globe,
      highlight: "10x better value"
    },
    {
      title: "Multi-Model AI Intelligence", 
      description: "Claude + GPT-4 + Gemini working together",
      icon: Brain,
      highlight: "Industry first"
    },
    {
      title: "Real Attribution Modeling",
      description: "Track every touchpoint to actual revenue",
      icon: Target,
      highlight: "HubSpot alternative"
    },
    {
      title: "Predictive Analytics",
      description: "Performance forecasting with 94% accuracy",
      icon: Sparkles,
      highlight: "Enterprise ready"
    }
  ];

  const competitorComparison = [
    { feature: "Attribution Modeling", us: true, competitor1: false, competitor2: "Basic" },
    { feature: "Multi-AI Integration", us: true, competitor1: false, competitor2: false },
    { feature: "Unlimited Research", us: true, competitor1: "Credits", competitor2: "Credits" },
    { feature: "Revenue Tracking", us: true, competitor1: false, competitor2: "Manual" },
    { feature: "Predictive Analytics", us: true, competitor1: false, competitor2: false },
    { feature: "Price/Month", us: "$197", competitor1: "$800", competitor2: "$149" }
  ];

  return (
    <div className={`yc-demo-container ${isVisible ? 'fade-in' : ''}`} style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
        borderRadius: '16px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: '1rem',
          background: '#fbbf24',
          color: '#1f2937',
          padding: '0.5rem 1rem',
          borderRadius: '0 0 8px 8px',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Crown size={16} />
          YC DEMO MODE
        </div>
        
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 800,
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #ffffff, #f1f5f9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AttributeAI
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          opacity: 0.9,
          marginBottom: '2rem',
          maxWidth: '800px',
          margin: '0 auto 2rem'
        }}>
          The first AI-native marketing attribution platform. See exactly which keywords, content, and campaigns drive real revenue - not just traffic.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => onNavigate('keyword-intelligence')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            Try Keyword Intelligence <ArrowRight size={16} />
          </button>
          
          <button
            onClick={() => onNavigate('attribution-engine')}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              color: '#1f2937',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
          >
            See Attribution Demo <BarChart3 size={16} />
          </button>
        </div>
      </div>

      {/* Live Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {demoMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const isActive = currentMetric === index;
          return (
            <div
              key={index}
              style={{
                background: '#ffffff',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: isActive ? `2px solid ${metric.color}` : '1px solid #e5e7eb',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <Icon size={24} style={{ color: metric.color }} />
                <span style={{
                  fontSize: '0.875rem',
                  color: '#10b981',
                  fontWeight: 600
                }}>
                  {metric.change}
                </span>
              </div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '0.25rem'
              }}>
                {metric.value}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                {metric.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Features */}
      <div style={{
        background: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        marginBottom: '3rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#1f2937'
        }}>
          Why AttributeAI Wins
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {keyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#fbbf24',
                  color: '#1f2937',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {feature.highlight}
                </div>
                
                <Icon size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: '#1f2937'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: 1.5
                }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Competitor Comparison */}
      <div style={{
        background: '#ffffff',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#1f2937'
        }}>
          vs. Competition
        </h2>
        
        <div style={{
          overflow: 'auto',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  Feature
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#3b82f6', fontWeight: 700 }}>
                  AttributeAI
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                  HubSpot
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                  Keywords Everywhere
                </th>
              </tr>
            </thead>
            <tbody>
              {competitorComparison.map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{row.feature}</td>
                  <td style={{ 
                    padding: '1rem', 
                    textAlign: 'center',
                    background: '#f0f9ff',
                    color: row.feature === 'Price/Month' ? '#059669' : '#3b82f6',
                    fontWeight: 600
                  }}>
                    {typeof row.us === 'boolean' ? (
                      row.us ? <CheckCircle size={20} style={{ color: '#10b981' }} /> : <X size={20} style={{ color: '#ef4444' }} />
                    ) : row.us}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {typeof row.competitor1 === 'boolean' ? (
                      row.competitor1 ? <CheckCircle size={20} style={{ color: '#10b981' }} /> : <X size={20} style={{ color: '#ef4444' }} />
                    ) : row.competitor1}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {typeof row.competitor2 === 'boolean' ? (
                      row.competitor2 ? <CheckCircle size={20} style={{ color: '#10b981' }} /> : <X size={20} style={{ color: '#ef4444' }} />
                    ) : row.competitor2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default YCDemoMode;
