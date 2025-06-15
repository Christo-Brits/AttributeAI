import React, { useState, useEffect } from 'react';
import './WeatherIntelligence.css';

const WeatherIntelligence = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIndustry, setSelectedIndustry] = useState('retail');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [spendRecommendations, setSpendRecommendations] = useState([]);

  // Mock weather data - in production this would come from weather APIs
  const mockWeatherData = {
    current: {
      temperature: 72,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 8,
      pressure: 30.12,
      uvIndex: 6,
      icon: '⛅'
    },
    forecast: [
      { day: 'Today', high: 78, low: 65, condition: 'Partly Cloudy', precipitation: 10, icon: '⛅' },
      { day: 'Tomorrow', high: 82, low: 68, condition: 'Sunny', precipitation: 0, icon: '☀️' },
      { day: 'Wednesday', high: 75, low: 62, condition: 'Rainy', precipitation: 80, icon: '🌧️' },
      { day: 'Thursday', high: 70, low: 58, condition: 'Thunderstorms', precipitation: 90, icon: '⛈️' },
      { day: 'Friday', high: 85, low: 70, condition: 'Sunny', precipitation: 5, icon: '☀️' },
      { day: 'Saturday', high: 88, low: 72, condition: 'Hot', precipitation: 0, icon: '🔥' },
      { day: 'Sunday', high: 76, low: 64, condition: 'Cloudy', precipitation: 20, icon: '☁️' }
    ],
    historicalImpact: {
      sunny: { conversionBoost: 15, trafficIncrease: 22, avgOrderValue: 128 },
      rainy: { conversionBoost: -8, trafficIncrease: -12, avgOrderValue: 95 },
      cloudy: { conversionBoost: 2, trafficIncrease: -3, avgOrderValue: 105 },
      hot: { conversionBoost: 25, trafficIncrease: 35, avgOrderValue: 145 },
      cold: { conversionBoost: -15, trafficIncrease: -20, avgOrderValue: 85 }
    }
  };

  const industryProfiles = {
    retail: {
      name: 'Retail & E-commerce',
      weatherSensitivity: 'High',
      keyFactors: ['Temperature', 'Precipitation', 'Seasonal Events'],
      peakConditions: ['Hot Weather', 'Holiday Seasons', 'Rainy Days (Online)'],
      spendAdjustments: {
        sunny: { multiplier: 1.3, reason: 'Increased outdoor shopping activity' },
        rainy: { multiplier: 1.2, reason: 'Higher online shopping during indoor time' },
        hot: { multiplier: 1.4, reason: 'Cooling products and summer gear demand' },
        cold: { multiplier: 0.8, reason: 'Reduced foot traffic, focus on essentials' }
      }
    },
    restaurant: {
      name: 'Food & Restaurants',
      weatherSensitivity: 'Very High',
      keyFactors: ['Temperature', 'Precipitation', 'Wind Speed'],
      peakConditions: ['Mild Weather', 'Weekend Sunny Days', 'Post-Storm Recovery'],
      spendAdjustments: {
        sunny: { multiplier: 1.5, reason: 'Outdoor dining and increased foot traffic' },
        rainy: { multiplier: 0.7, reason: 'Reduced outdoor dining, focus on delivery' },
        hot: { multiplier: 1.2, reason: 'Cold drinks and AC dining demand' },
        cold: { multiplier: 0.9, reason: 'Comfort food focus, reduced outdoor dining' }
      }
    },
    travel: {
      name: 'Travel & Tourism',
      weatherSensitivity: 'Extreme',
      keyFactors: ['Temperature', 'Precipitation', 'Seasonal Patterns'],
      peakConditions: ['Perfect Weather', 'Seasonal Transitions', 'Weather Events'],
      spendAdjustments: {
        sunny: { multiplier: 1.6, reason: 'Peak travel motivation and booking activity' },
        rainy: { multiplier: 0.6, reason: 'Reduced travel interest, focus on deals' },
        hot: { multiplier: 1.3, reason: 'Vacation and cooling destination demand' },
        cold: { multiplier: 1.1, reason: 'Warm destination travel planning' }
      }
    },
    fitness: {
      name: 'Fitness & Wellness',
      weatherSensitivity: 'High',
      keyFactors: ['Temperature', 'Daylight Hours', 'Seasonal Motivation'],
      peakConditions: ['Mild Weather', 'New Year', 'Spring Motivation'],
      spendAdjustments: {
        sunny: { multiplier: 1.4, reason: 'Outdoor fitness motivation and gear demand' },
        rainy: { multiplier: 1.1, reason: 'Indoor workout equipment interest' },
        hot: { multiplier: 1.2, reason: 'Hydration and cooling products demand' },
        cold: { multiplier: 0.9, reason: 'Gym memberships but reduced outdoor gear' }
      }
    }
  };

  // Generate dynamic spend recommendations
  useEffect(() => {
    const generateRecommendations = () => {
      const recommendations = [];
      const currentIndustry = industryProfiles[selectedIndustry];
      
      mockWeatherData.forecast.forEach((day, index) => {
        const condition = day.condition.toLowerCase();
        let adjustment = currentIndustry.spendAdjustments.sunny; // default
        
        if (condition.includes('rain') || condition.includes('storm')) {
          adjustment = currentIndustry.spendAdjustments.rainy;
        } else if (condition.includes('hot') || day.high > 85) {
          adjustment = currentIndustry.spendAdjustments.hot;
        } else if (day.high < 60) {
          adjustment = currentIndustry.spendAdjustments.cold;
        }
        
        const currentSpend = 5000; // Mock current daily spend
        const recommendedSpend = Math.round(currentSpend * adjustment.multiplier);
        const change = recommendedSpend - currentSpend;
        
        recommendations.push({
          day: day.day,
          currentSpend,
          recommendedSpend,
          change,
          multiplier: adjustment.multiplier,
          reason: adjustment.reason,
          confidence: Math.round(85 + Math.random() * 10),
          weather: day.condition,
          icon: day.icon
        });
      });
      
      setSpendRecommendations(recommendations);
    };

    generateRecommendations();
  }, [selectedIndustry]);

  useEffect(() => {
    setWeatherData(mockWeatherData);
  }, []);

  const WeatherDashboard = () => (
    <div className="weather-dashboard">
      <div className="dashboard-grid">
        {/* Current Weather Card */}
        <div className="weather-card current-weather">
          <div className="card-header">
            <h3>Current Conditions</h3>
            <span className="weather-icon large">{weatherData?.current.icon}</span>
          </div>
          <div className="weather-details">
            <div className="temperature">{weatherData?.current.temperature}°F</div>
            <div className="condition">{weatherData?.current.condition}</div>
            <div className="metrics-grid">
              <div className="metric">
                <span className="label">Humidity</span>
                <span className="value">{weatherData?.current.humidity}%</span>
              </div>
              <div className="metric">
                <span className="label">Wind</span>
                <span className="value">{weatherData?.current.windSpeed} mph</span>
              </div>
              <div className="metric">
                <span className="label">UV Index</span>
                <span className="value">{weatherData?.current.uvIndex}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Industry Impact Card */}
        <div className="weather-card industry-impact">
          <div className="card-header">
            <h3>Industry Impact</h3>
            <select 
              value={selectedIndustry} 
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="industry-select"
            >
              {Object.entries(industryProfiles).map(([key, profile]) => (
                <option key={key} value={key}>{profile.name}</option>
              ))}
            </select>
          </div>
          <div className="impact-details">
            <div className="sensitivity-indicator">
              <span className="label">Weather Sensitivity:</span>
              <span className={`sensitivity ${industryProfiles[selectedIndustry].weatherSensitivity.toLowerCase().replace(' ', '-')}`}>
                {industryProfiles[selectedIndustry].weatherSensitivity}
              </span>
            </div>
            <div className="key-factors">
              <h4>Key Weather Factors:</h4>
              <div className="factors-list">
                {industryProfiles[selectedIndustry].keyFactors.map((factor, index) => (
                  <span key={index} className="factor-tag">{factor}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Impact */}
        <div className="weather-card performance-impact">
          <div className="card-header">
            <h3>Weather Performance Impact</h3>
          </div>
          <div className="impact-metrics">
            {Object.entries(weatherData?.historicalImpact || {}).map(([condition, impact]) => (
              <div key={condition} className="impact-row">
                <div className="condition-name">
                  <span className="condition-icon">
                    {condition === 'sunny' ? '☀️' : 
                     condition === 'rainy' ? '🌧️' : 
                     condition === 'cloudy' ? '☁️' : 
                     condition === 'hot' ? '🔥' : '❄️'}
                  </span>
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </div>
                <div className="impact-stats">
                  <span className={`conversion-impact ${impact.conversionBoost > 0 ? 'positive' : 'negative'}`}>
                    {impact.conversionBoost > 0 ? '+' : ''}{impact.conversionBoost}% Conv
                  </span>
                  <span className={`traffic-impact ${impact.trafficIncrease > 0 ? 'positive' : 'negative'}`}>
                    {impact.trafficIncrease > 0 ? '+' : ''}{impact.trafficIncrease}% Traffic
                  </span>
                  <span className="aov-impact">${impact.avgOrderValue} AOV</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Recommendations */}
        <div className="weather-card quick-recommendations">
          <div className="card-header">
            <h3>Today's Recommendations</h3>
          </div>
          <div className="recommendations-list">
            <div className="recommendation">
              <div className="rec-icon">📈</div>
              <div className="rec-content">
                <h4>Increase Ad Spend</h4>
                <p>Weather conditions favor 30% higher conversion rates. Boost daily budget from $5,000 to $6,500.</p>
              </div>
            </div>
            <div className="recommendation">
              <div className="rec-icon">🎯</div>
              <div className="rec-content">
                <h4>Target Weather Keywords</h4>
                <p>Add "summer cooling" and "outdoor gear" keywords for increased relevance.</p>
              </div>
            </div>
            <div className="recommendation">
              <div className="rec-icon">⏰</div>
              <div className="rec-content">
                <h4>Optimize Ad Scheduling</h4>
                <p>Peak shopping hours shifted 2 hours earlier due to weather patterns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SpendOptimization = () => (
    <div className="spend-optimization">
      <div className="optimization-header">
        <h2>Weather-Based Spend Optimization</h2>
        <p>AI-powered budget recommendations based on weather forecasts and historical performance</p>
      </div>

      <div className="spend-summary">
        <div className="summary-card">
          <h3>Weekly Spend Adjustment</h3>
          <div className="spend-change">
            <span className="change-amount positive">+$12,400</span>
            <span className="change-percentage">+18% recommended increase</span>
          </div>
          <p>Based on favorable weather conditions and historical performance patterns</p>
        </div>
        <div className="summary-card">
          <h3>Confidence Score</h3>
          <div className="confidence-score">
            <span className="score">87%</span>
            <span className="score-label">High Confidence</span>
          </div>
          <p>Recommendations based on 2+ years of weather correlation data</p>
        </div>
      </div>

      <div className="recommendations-table">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Weather</th>
              <th>Current Spend</th>
              <th>Recommended</th>
              <th>Change</th>
              <th>Confidence</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {spendRecommendations.map((rec, index) => (
              <tr key={index}>
                <td>
                  <div className="day-cell">
                    <span className="day-name">{rec.day}</span>
                  </div>
                </td>
                <td>
                  <div className="weather-cell">
                    <span className="weather-icon">{rec.icon}</span>
                    <span className="weather-condition">{rec.weather}</span>
                  </div>
                </td>
                <td>${rec.currentSpend.toLocaleString()}</td>
                <td className="recommended-spend">
                  ${rec.recommendedSpend.toLocaleString()}
                </td>
                <td>
                  <span className={`spend-change ${rec.change > 0 ? 'positive' : 'negative'}`}>
                    {rec.change > 0 ? '+' : ''}${Math.abs(rec.change).toLocaleString()}
                  </span>
                </td>
                <td>
                  <div className="confidence-indicator">
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill" 
                        style={{ width: `${rec.confidence}%` }}
                      ></div>
                    </div>
                    <span className="confidence-text">{rec.confidence}%</span>
                  </div>
                </td>
                <td className="reason-cell">{rec.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="automation-controls">
        <h3>Automation Settings</h3>
        <div className="automation-options">
          <label className="automation-checkbox">
            <input type="checkbox" />
            <span className="checkmark"></span>
            Auto-adjust spend based on weather forecasts
          </label>
          <label className="automation-checkbox">
            <input type="checkbox" defaultChecked />
            <span className="checkmark"></span>
            Send alerts for significant weather changes
          </label>
          <label className="automation-checkbox">
            <input type="checkbox" />
            <span className="checkmark"></span>
            Automatically pause campaigns during severe weather
          </label>
        </div>
      </div>
    </div>
  );

  const WeatherForecast = () => (
    <div className="weather-forecast">
      <div className="forecast-header">
        <h2>7-Day Weather Forecast & Marketing Impact</h2>
        <p>Detailed weather predictions with marketing performance implications</p>
      </div>

      <div className="forecast-grid">
        {weatherData?.forecast.map((day, index) => (
          <div key={index} className="forecast-card">
            <div className="forecast-day">
              <h3>{day.day}</h3>
              <div className="weather-icon-large">{day.icon}</div>
              <div className="temperature-range">
                <span className="high">{day.high}°</span>
                <span className="low">{day.low}°</span>
              </div>
              <div className="condition">{day.condition}</div>
              <div className="precipitation">
                <span className="precip-icon">💧</span>
                {day.precipitation}% chance
              </div>
            </div>

            <div className="marketing-impact">
              <h4>Marketing Impact</h4>
              <div className="impact-indicators">
                <div className="impact-item">
                  <span className="impact-label">Conversion Rate:</span>
                  <span className={`impact-value ${
                    day.condition.includes('Sunny') || day.condition.includes('Hot') ? 'positive' : 
                    day.condition.includes('Rain') || day.condition.includes('Storm') ? 'negative' : 'neutral'
                  }`}>
                    {day.condition.includes('Sunny') ? '+15%' : 
                     day.condition.includes('Hot') ? '+25%' : 
                     day.condition.includes('Rain') ? '-8%' : 
                     day.condition.includes('Storm') ? '-15%' : '+2%'}
                  </span>
                </div>
                <div className="impact-item">
                  <span className="impact-label">Traffic:</span>
                  <span className={`impact-value ${
                    day.condition.includes('Sunny') || day.condition.includes('Hot') ? 'positive' : 
                    day.condition.includes('Rain') || day.condition.includes('Storm') ? 'negative' : 'neutral'
                  }`}>
                    {day.condition.includes('Sunny') ? '+22%' : 
                     day.condition.includes('Hot') ? '+35%' : 
                     day.condition.includes('Rain') ? '-12%' : 
                     day.condition.includes('Storm') ? '-20%' : '-3%'}
                  </span>
                </div>
                <div className="impact-item">
                  <span className="impact-label">AOV:</span>
                  <span className="impact-value neutral">
                    ${day.condition.includes('Hot') ? '145' : 
                      day.condition.includes('Sunny') ? '128' : 
                      day.condition.includes('Rain') ? '95' : 
                      day.condition.includes('Storm') ? '85' : '105'}
                  </span>
                </div>
              </div>

              <div className="recommendations">
                <h5>Recommendations:</h5>
                <ul>
                  {day.condition.includes('Sunny') && (
                    <>
                      <li>Increase outdoor product ads</li>
                      <li>Boost social media budget</li>
                    </>
                  )}
                  {day.condition.includes('Hot') && (
                    <>
                      <li>Promote cooling products</li>
                      <li>Increase mobile ad spend</li>
                    </>
                  )}
                  {day.condition.includes('Rain') && (
                    <>
                      <li>Focus on indoor activities</li>
                      <li>Boost delivery service ads</li>
                    </>
                  )}
                  {day.condition.includes('Storm') && (
                    <>
                      <li>Reduce outdoor event promotion</li>
                      <li>Focus on essential products</li>
                    </>
                  )}
                  {day.condition.includes('Cloudy') && (
                    <>
                      <li>Maintain baseline spending</li>
                      <li>Test new creative variations</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="weather-intelligence">
      <div className="weather-intelligence-header">
        <div className="header-content">
          <h1>Weather Intelligence</h1>
          <p>Optimize marketing spend and strategy based on real-time weather data and predictions</p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-value">+23%</span>
            <span className="stat-label">Avg ROI Improvement</span>
          </div>
          <div className="stat">
            <span className="stat-value">87%</span>
            <span className="stat-label">Prediction Accuracy</span>
          </div>
          <div className="stat">
            <span className="stat-value">$48K</span>
            <span className="stat-label">Monthly Savings</span>
          </div>
        </div>
      </div>

      <div className="weather-intelligence-nav">
        <button 
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          🌤️ Weather Dashboard
        </button>
        <button 
          className={`nav-button ${activeTab === 'spend' ? 'active' : ''}`}
          onClick={() => setActiveTab('spend')}
        >
          💰 Spend Optimization
        </button>
        <button 
          className={`nav-button ${activeTab === 'forecast' ? 'active' : ''}`}
          onClick={() => setActiveTab('forecast')}
        >
          📅 7-Day Forecast
        </button>
      </div>

      <div className="weather-intelligence-content">
        {activeTab === 'dashboard' && <WeatherDashboard />}
        {activeTab === 'spend' && <SpendOptimization />}
        {activeTab === 'forecast' && <WeatherForecast />}
      </div>
    </div>
  );
};

export default WeatherIntelligence;