import React, { useState, useEffect } from 'react';
import './WeatherAnalytics.css';

const WeatherAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(false);

  // Mock data for weather correlation analysis
  const weatherCorrelationData = {
    revenue: {
      sunny: { correlation: 0.78, impact: '+23%', confidence: 94 },
      rainy: { correlation: -0.42, impact: '-15%', confidence: 87 },
      cloudy: { correlation: 0.12, impact: '+3%', confidence: 72 },
      hot: { correlation: 0.85, impact: '+31%', confidence: 96 },
      cold: { correlation: -0.38, impact: '-18%', confidence: 89 }
    },
    traffic: {
      sunny: { correlation: 0.72, impact: '+28%', confidence: 91 },
      rainy: { correlation: -0.35, impact: '-12%', confidence: 84 },
      cloudy: { correlation: 0.08, impact: '+1%', confidence: 68 },
      hot: { correlation: 0.81, impact: '+35%', confidence: 94 },
      cold: { correlation: -0.44, impact: '-22%', confidence: 86 }
    },
    conversions: {
      sunny: { correlation: 0.69, impact: '+19%', confidence: 88 },
      rainy: { correlation: -0.28, impact: '-8%', confidence: 79 },
      cloudy: { correlation: 0.15, impact: '+4%', confidence: 74 },
      hot: { correlation: 0.76, impact: '+25%', confidence: 92 },
      cold: { correlation: -0.31, impact: '-12%', confidence: 81 }
    }
  };

  const performanceByWeather = [
    {
      condition: 'Sunny',
      icon: '☀️',
      days: 18,
      revenue: 89250,
      traffic: 12450,
      conversions: 298,
      avgOrderValue: 127,
      costPerAcquisition: 42,
      roi: 312
    },
    {
      condition: 'Partly Cloudy',
      icon: '⛅',
      days: 8,
      revenue: 42300,
      traffic: 6800,
      conversions: 156,
      avgOrderValue: 115,
      costPerAcquisition: 38,
      roi: 285
    },
    {
      condition: 'Rainy',
      icon: '🌧️',
      days: 3,
      revenue: 15600,
      traffic: 3200,
      conversions: 78,
      avgOrderValue: 98,
      costPerAcquisition: 52,
      roi: 198
    },
    {
      condition: 'Hot (85°F+)',
      icon: '🔥',
      days: 1,
      revenue: 8900,
      traffic: 1850,
      conversions: 45,
      avgOrderValue: 142,
      costPerAcquisition: 35,
      roi: 425
    }
  ];

  const weatherTrends = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Sunny Days Revenue',
        data: [18500, 22300, 28900, 19550],
        color: '#fbbf24'
      },
      {
        label: 'Rainy Days Revenue',
        data: [12200, 8900, 14600, 11100],
        color: '#3b82f6'
      },
      {
        label: 'Hot Days Revenue',
        data: [35200, 28900, 42100, 38600],
        color: '#ef4444'
      }
    ]
  };

  const seasonalInsights = [
    {
      season: 'Spring',
      optimalWeather: 'Mild & Sunny',
      avgTempRange: '65-75°F',
      revenueBoost: '+18%',
      recommendations: [
        'Increase outdoor product advertising',
        'Launch spring collection campaigns',
        'Optimize for mobile shopping'
      ]
    },
    {
      season: 'Summer',
      optimalWeather: 'Hot & Clear',
      avgTempRange: '80-90°F',
      revenueBoost: '+34%',
      recommendations: [
        'Boost cooling product ads',
        'Maximize weekend campaigns',
        'Focus on vacation-related products'
      ]
    },
    {
      season: 'Fall',
      optimalWeather: 'Cool & Crisp',
      avgTempRange: '55-65°F',
      revenueBoost: '+12%',
      recommendations: [
        'Promote fall fashion',
        'Increase indoor activity ads',
        'Prepare holiday campaigns'
      ]
    },
    {
      season: 'Winter',
      optimalWeather: 'Cold & Clear',
      avgTempRange: '35-45°F',
      revenueBoost: '+8%',
      recommendations: [
        'Focus on indoor products',
        'Boost holiday shopping ads',
        'Promote comfort items'
      ]
    }
  ];

  const CorrelationAnalysis = () => (
    <div className="correlation-analysis">
      <div className="analysis-header">
        <h2>Weather Correlation Analysis</h2>
        <div className="metric-selector">
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="metric-select"
          >
            <option value="revenue">Revenue Impact</option>
            <option value="traffic">Traffic Impact</option>
            <option value="conversions">Conversion Impact</option>
          </select>
        </div>
      </div>

      <div className="correlation-grid">
        {Object.entries(weatherCorrelationData[selectedMetric]).map(([condition, data]) => (
          <div key={condition} className="correlation-card">
            <div className="correlation-header">
              <span className="weather-condition">
                {condition === 'sunny' ? '☀️' : 
                 condition === 'rainy' ? '🌧️' : 
                 condition === 'cloudy' ? '☁️' : 
                 condition === 'hot' ? '🔥' : '❄️'}
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
              </span>
            </div>
            
            <div className="correlation-metrics">
              <div className="correlation-score">
                <span className="score-label">Correlation</span>
                <span className={`correlation-value ${data.correlation > 0 ? 'positive' : 'negative'}`}>
                  {data.correlation > 0 ? '+' : ''}{data.correlation}
                </span>
              </div>
              
              <div className="impact-score">
                <span className="score-label">Impact</span>
                <span className={`impact-value ${data.impact.includes('+') ? 'positive' : 'negative'}`}>
                  {data.impact}
                </span>
              </div>
              
              <div className="confidence-score">
                <span className="score-label">Confidence</span>
                <div className="confidence-bar-container">
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${data.confidence}%` }}
                    ></div>
                  </div>
                  <span className="confidence-percentage">{data.confidence}%</span>
                </div>
              </div>
            </div>
            
            <div className="correlation-strength">
              <span className="strength-label">
                {Math.abs(data.correlation) > 0.7 ? 'Strong' : 
                 Math.abs(data.correlation) > 0.4 ? 'Moderate' : 'Weak'} Correlation
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="insights-panel">
        <h3>Key Insights</h3>
        <div className="insights-list">
          <div className="insight">
            <span className="insight-icon">🎯</span>
            <div className="insight-content">
              <h4>Strongest Positive Correlation</h4>
              <p>Hot weather shows the strongest positive correlation with {selectedMetric}, indicating optimal conditions for increased marketing spend.</p>
            </div>
          </div>
          <div className="insight">
            <span className="insight-icon">⚠️</span>
            <div className="insight-content">
              <h4>Weather Risk Factor</h4>
              <p>Rainy weather shows consistent negative impact across all metrics. Consider defensive strategies during extended rain periods.</p>
            </div>
          </div>
          <div className="insight">
            <span className="insight-icon">📈</span>
            <div className="insight-content">
              <h4>Optimization Opportunity</h4>
              <p>Sunny weather conditions offer reliable performance gains. Increase budget allocation by 20-30% during forecasted sunny periods.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PerformanceBreakdown = () => (
    <div className="performance-breakdown">
      <div className="breakdown-header">
        <h2>Performance by Weather Condition</h2>
        <div className="time-range-selector">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-select"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      <div className="performance-table">
        <table>
          <thead>
            <tr>
              <th>Weather Condition</th>
              <th>Days</th>
              <th>Revenue</th>
              <th>Traffic</th>
              <th>Conversions</th>
              <th>AOV</th>
              <th>CPA</th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>
            {performanceByWeather.map((row, index) => (
              <tr key={index}>
                <td>
                  <div className="condition-cell">
                    <span className="condition-icon">{row.icon}</span>
                    <span className="condition-name">{row.condition}</span>
                  </div>
                </td>
                <td>{row.days}</td>
                <td className="revenue-cell">${row.revenue.toLocaleString()}</td>
                <td>{row.traffic.toLocaleString()}</td>
                <td>{row.conversions}</td>
                <td>${row.avgOrderValue}</td>
                <td>${row.costPerAcquisition}</td>
                <td className="roi-cell">
                  <span className={`roi-value ${row.roi > 300 ? 'excellent' : row.roi > 250 ? 'good' : 'average'}`}>
                    {row.roi}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="performance-summary">
        <div className="summary-cards">
          <div className="summary-card">
            <h4>Best Performing Weather</h4>
            <div className="best-weather">
              <span className="weather-icon">🔥</span>
              <div className="weather-details">
                <span className="weather-name">Hot Weather (85°F+)</span>
                <span className="weather-metric">425% ROI Average</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card">
            <h4>Most Consistent</h4>
            <div className="consistent-weather">
              <span className="weather-icon">☀️</span>
              <div className="weather-details">
                <span className="weather-name">Sunny Conditions</span>
                <span className="weather-metric">18 days tracked</span>
              </div>
            </div>
          </div>
          
          <div className="summary-card">
            <h4>Opportunity Gap</h4>
            <div className="gap-weather">
              <span className="weather-icon">🌧️</span>
              <div className="weather-details">
                <span className="weather-name">Rainy Days</span>
                <span className="weather-metric">-15% performance gap</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SeasonalInsights = () => (
    <div className="seasonal-insights">
      <div className="insights-header">
        <h2>Seasonal Weather Intelligence</h2>
        <p>Long-term weather patterns and seasonal optimization strategies</p>
      </div>

      <div className="seasonal-grid">
        {seasonalInsights.map((season, index) => (
          <div key={index} className="seasonal-card">
            <div className="seasonal-header">
              <h3>{season.season}</h3>
              <div className="season-icon">
                {season.season === 'Spring' ? '🌸' : 
                 season.season === 'Summer' ? '☀️' : 
                 season.season === 'Fall' ? '🍂' : '❄️'}
              </div>
            </div>
            
            <div className="seasonal-details">
              <div className="detail-row">
                <span className="detail-label">Optimal Weather:</span>
                <span className="detail-value">{season.optimalWeather}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Temperature Range:</span>
                <span className="detail-value">{season.avgTempRange}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Revenue Boost:</span>
                <span className={`detail-value ${season.revenueBoost.includes('+') ? 'positive' : 'negative'}`}>
                  {season.revenueBoost}
                </span>
              </div>
            </div>
            
            <div className="recommendations-section">
              <h4>Recommended Strategies:</h4>
              <ul>
                {season.recommendations.map((rec, recIndex) => (
                  <li key={recIndex}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="yearly-overview">
        <h3>Annual Weather Performance Overview</h3>
        <div className="yearly-stats">
          <div className="yearly-stat">
            <span className="stat-icon">📊</span>
            <div className="stat-content">
              <span className="stat-value">+18.5%</span>
              <span className="stat-label">Average Weather Impact</span>
            </div>
          </div>
          <div className="yearly-stat">
            <span className="stat-icon">🎯</span>
            <div className="stat-content">
              <span className="stat-value">127 days</span>
              <span className="stat-label">Optimal Weather Days</span>
            </div>
          </div>
          <div className="yearly-stat">
            <span className="stat-icon">💰</span>
            <div className="stat-content">
              <span className="stat-value">$285K</span>
              <span className="stat-label">Weather-Attributed Revenue</span>
            </div>
          </div>
          <div className="yearly-stat">
            <span className="stat-icon">⚡</span>
            <div className="stat-content">
              <span className="stat-value">92%</span>
              <span className="stat-label">Forecast Accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="weather-analytics">
      <div className="analytics-header">
        <h1>Advanced Weather Analytics</h1>
        <p>Deep dive into weather correlation patterns and performance optimization opportunities</p>
      </div>

      <div className="analytics-nav">
        <button 
          className={`nav-button ${selectedMetric === 'revenue' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('revenue')}
        >
          📊 Correlation Analysis
        </button>
        <button 
          className={`nav-button ${timeRange === '30d' ? 'active' : ''}`}
          onClick={() => setTimeRange('30d')}
        >
          📈 Performance Breakdown
        </button>
        <button className="nav-button">
          🗓️ Seasonal Insights
        </button>
      </div>

      <div className="analytics-content">
        <CorrelationAnalysis />
        <PerformanceBreakdown />
        <SeasonalInsights />
      </div>
    </div>
  );
};

export default WeatherAnalytics;