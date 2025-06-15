import DataBridge from '../utils/DataBridge';

class WeatherIntelligenceService {
  constructor() {
    this.weatherApiKey = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.attributeai.app'
      : 'http://localhost:3001';
  }

  // Get current weather data and marketing impact
  async getCurrentWeatherImpact(location = 'auto') {
    try {
      const response = await fetch(`${this.baseUrl}/api/weather/current`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location })
      });

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store in DataBridge for cross-component access
      DataBridge.setData('weatherData', {
        current: data.current,
        impact: data.marketingImpact,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Weather Intelligence Service Error:', error);
      return this.getMockWeatherData();
    }
  }

  // Get weather forecast with marketing recommendations
  async getWeatherForecast(days = 7) {
    try {
      const response = await fetch(`${this.baseUrl}/api/weather/forecast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days })
      });

      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store forecast data
      DataBridge.setData('weatherForecast', {
        forecast: data.forecast,
        recommendations: data.recommendations,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Weather Forecast Error:', error);
      return this.getMockForecastData();
    }
  }

  // Generate spend optimization recommendations
  async generateSpendRecommendations(industry = 'retail', currentSpend = 5000) {
    try {
      const response = await fetch(`${this.baseUrl}/api/weather/spend-optimization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          industry, 
          currentSpend,
          forecastDays: 7
        })
      });

      if (!response.ok) {
        throw new Error(`Spend optimization error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store recommendations
      DataBridge.setData('spendRecommendations', {
        recommendations: data.recommendations,
        totalAdjustment: data.totalAdjustment,
        confidence: data.confidence,
        industry,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Spend Recommendations Error:', error);
      return this.getMockSpendRecommendations(industry, currentSpend);
    }
  }

  // Analyze weather correlation with performance data
  async analyzeWeatherCorrelation(metric = 'revenue', timeRange = '30d') {
    try {
      const response = await fetch(`${this.baseUrl}/api/weather/correlation-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          metric, 
          timeRange,
          includeSeasonality: true
        })
      });

      if (!response.ok) {
        throw new Error(`Correlation analysis error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store correlation data
      DataBridge.setData('weatherCorrelation', {
        correlations: data.correlations,
        insights: data.insights,
        metric,
        timeRange,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Weather Correlation Error:', error);
      return this.getMockCorrelationData(metric);
    }
  }

  // Get industry-specific weather strategies
  async getIndustryStrategies(industry) {
    const strategies = {
      retail: {
        name: 'Retail & E-commerce',
        weatherSensitivity: 'High',
        keyFactors: ['Temperature', 'Precipitation', 'Seasonal Events'],
        strategies: {
          sunny: {
            spendMultiplier: 1.3,
            recommendations: [
              'Increase outdoor product advertising by 30%',
              'Boost social media campaigns for lifestyle brands',
              'Target "outdoor activities" and "summer gear" keywords',
              'Extend ad scheduling to capture evening shopping'
            ]
          },
          rainy: {
            spendMultiplier: 1.2,
            recommendations: [
              'Focus on indoor and comfort products',
              'Increase delivery service promotions',
              'Target "indoor entertainment" keywords',
              'Boost email marketing for at-home shopping'
            ]
          },
          hot: {
            spendMultiplier: 1.4,
            recommendations: [
              'Promote cooling products and summer essentials',
              'Increase mobile ad spend (higher mobile usage)',
              'Target "cool down" and "air conditioning" keywords',
              'Launch flash sales for summer inventory'
            ]
          },
          cold: {
            spendMultiplier: 0.8,
            recommendations: [
              'Focus on essential products and winter gear',
              'Reduce outdoor activity advertising',
              'Target "warm up" and "comfort" keywords',
              'Promote indoor hobbies and entertainment'
            ]
          }
        }
      },
      restaurant: {
        name: 'Food & Restaurants',
        weatherSensitivity: 'Very High',
        keyFactors: ['Temperature', 'Precipitation', 'Wind Speed'],
        strategies: {
          sunny: {
            spendMultiplier: 1.5,
            recommendations: [
              'Boost outdoor dining and patio promotions',
              'Increase local search and "near me" campaigns',
              'Target "outdoor dining" and "patio" keywords',
              'Promote refreshing drinks and light meals'
            ]
          },
          rainy: {
            spendMultiplier: 0.7,
            recommendations: [
              'Focus on delivery and takeout services',
              'Promote comfort foods and warm beverages',
              'Target "food delivery" and "cozy dining" keywords',
              'Increase indoor seating promotions'
            ]
          }
        }
      },
      travel: {
        name: 'Travel & Tourism',
        weatherSensitivity: 'Extreme',
        keyFactors: ['Temperature', 'Precipitation', 'Seasonal Patterns'],
        strategies: {
          sunny: {
            spendMultiplier: 1.6,
            recommendations: [
              'Promote outdoor destinations and activities',
              'Increase vacation and leisure travel ads',
              'Target "sunny destinations" and "outdoor adventures"',
              'Boost last-minute travel deals'
            ]
          },
          rainy: {
            spendMultiplier: 0.6,
            recommendations: [
              'Focus on indoor attractions and museums',
              'Promote covered or indoor destinations',
              'Target "rainy day activities" keywords',
              'Offer travel insurance and flexible bookings'
            ]
          }
        }
      },
      fitness: {
        name: 'Fitness & Wellness',
        weatherSensitivity: 'High',
        keyFactors: ['Temperature', 'Daylight Hours', 'Seasonal Motivation'],
        strategies: {
          sunny: {
            spendMultiplier: 1.4,
            recommendations: [
              'Promote outdoor fitness equipment and gear',
              'Increase running and cycling product ads',
              'Target "outdoor workout" and "fitness gear" keywords',
              'Boost nutrition and hydration products'
            ]
          },
          rainy: {
            spendMultiplier: 1.1,
            recommendations: [
              'Focus on indoor workout equipment',
              'Promote gym memberships and classes',
              'Target "home gym" and "indoor fitness" keywords',
              'Increase virtual training and app subscriptions'
            ]
          }
        }
      }
    };

    return strategies[industry] || strategies.retail;
  }

  // Mock data for development and fallback
  getMockWeatherData() {
    return {
      current: {
        temperature: 72,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 8,
        pressure: 30.12,
        uvIndex: 6,
        icon: '⛅'
      },
      marketingImpact: {
        conversionBoost: 15,
        trafficIncrease: 22,
        recommendedSpendAdjustment: 1.3,
        confidence: 87
      }
    };
  }

  getMockForecastData() {
    return {
      forecast: [
        { day: 'Today', high: 78, low: 65, condition: 'Partly Cloudy', precipitation: 10, icon: '⛅' },
        { day: 'Tomorrow', high: 82, low: 68, condition: 'Sunny', precipitation: 0, icon: '☀️' },
        { day: 'Wednesday', high: 75, low: 62, condition: 'Rainy', precipitation: 80, icon: '🌧️' },
        { day: 'Thursday', high: 70, low: 58, condition: 'Thunderstorms', precipitation: 90, icon: '⛈️' },
        { day: 'Friday', high: 85, low: 70, condition: 'Sunny', precipitation: 5, icon: '☀️' },
        { day: 'Saturday', high: 88, low: 72, condition: 'Hot', precipitation: 0, icon: '🔥' },
        { day: 'Sunday', high: 76, low: 64, condition: 'Cloudy', precipitation: 20, icon: '☁️' }
      ],
      recommendations: [
        {
          day: 'Tomorrow',
          action: 'Increase spend by 30%',
          reason: 'Sunny weather expected to boost conversions',
          confidence: 94
        }
      ]
    };
  }

  getMockSpendRecommendations(industry, currentSpend) {
    const recommendations = [];
    const forecast = this.getMockForecastData().forecast;
    
    forecast.forEach((day, index) => {
      let multiplier = 1.0;
      let reason = 'Maintain current spend';
      
      if (day.condition.includes('Sunny')) {
        multiplier = 1.3;
        reason = 'Sunny weather increases conversion rates';
      } else if (day.condition.includes('Hot')) {
        multiplier = 1.4;
        reason = 'Hot weather drives higher engagement';
      } else if (day.condition.includes('Rain')) {
        multiplier = 0.8;
        reason = 'Rainy weather may reduce traffic';
      }
      
      const recommendedSpend = Math.round(currentSpend * multiplier);
      const change = recommendedSpend - currentSpend;
      
      recommendations.push({
        day: day.day,
        currentSpend,
        recommendedSpend,
        change,
        multiplier,
        reason,
        confidence: Math.round(85 + Math.random() * 10),
        weather: day.condition,
        icon: day.icon
      });
    });
    
    return {
      recommendations,
      totalAdjustment: recommendations.reduce((sum, rec) => sum + rec.change, 0),
      confidence: 87,
      industry
    };
  }

  getMockCorrelationData(metric) {
    return {
      correlations: {
        sunny: { correlation: 0.78, impact: '+23%', confidence: 94 },
        rainy: { correlation: -0.42, impact: '-15%', confidence: 87 },
        cloudy: { correlation: 0.12, impact: '+3%', confidence: 72 },
        hot: { correlation: 0.85, impact: '+31%', confidence: 96 },
        cold: { correlation: -0.38, impact: '-18%', confidence: 89 }
      },
      insights: [
        'Hot weather shows strongest positive correlation with performance',
        'Rainy weather consistently reduces engagement across all metrics',
        'Sunny conditions provide reliable 20%+ performance boost'
      ]
    };
  }

  // Export data in various formats
  async exportWeatherData(format = 'csv') {
    const weatherData = DataBridge.getData('weatherData');
    const forecasts = DataBridge.getData('weatherForecast');
    const recommendations = DataBridge.getData('spendRecommendations');
    
    const exportData = {
      timestamp: new Date().toISOString(),
      current_weather: weatherData,
      forecast: forecasts,
      spend_recommendations: recommendations
    };
    
    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    }
    
    if (format === 'csv') {
      // Convert to CSV format
      let csv = 'Date,Weather,Temperature,Condition,Current_Spend,Recommended_Spend,Change,Confidence\n';
      
      recommendations?.recommendations?.forEach(rec => {
        csv += `${rec.day},${rec.weather},${rec.temperature || 'N/A'},${rec.condition || 'N/A'},${rec.currentSpend},${rec.recommendedSpend},${rec.change},${rec.confidence}%\n`;
      });
      
      return csv;
    }
    
    return exportData;
  }
}

export default new WeatherIntelligenceService();