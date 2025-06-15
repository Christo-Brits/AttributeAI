import React, { useState, useEffect } from 'react';

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    try {
      // Simple fetch from our minimal API
      const response = await fetch('/api/weather/dashboard');
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      }
    } catch (error) {
      console.log('Weather data unavailable');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="weather-widget loading">
        <div className="spinner"></div>
        <span>Loading weather insights...</span>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather-widget offline">
        <div className="offline-icon">🌤️</div>
        <span>Weather Intelligence Available</span>
        <button onClick={fetchWeatherData}>Enable Weather Insights</button>
      </div>
    );
  }

  return (
    <div className="weather-widget active">
      <div className="weather-header">
        <span className="weather-icon">{weatherData.current?.icon || '🌤️'}</span>
        <div className="weather-info">
          <h3>Weather Intelligence</h3>
          <p>{weatherData.current?.condition || 'Analyzing conditions...'}</p>
        </div>
      </div>

      {weatherData.recommendation && (
        <div className="spend-recommendation">
          <div className="recommendation-header">
            <span className="rec-icon">💰</span>
            <span className="rec-title">Spend Recommendation</span>
          </div>
          <div className="recommendation-details">
            <div className="adjustment">
              <span className={`change ${weatherData.recommendation.change > 0 ? 'positive' : 'negative'}`}>
                {weatherData.recommendation.change > 0 ? '+' : ''}{weatherData.recommendation.change}%
              </span>
              <span className="reason">{weatherData.recommendation.reason}</span>
            </div>
            <div className="confidence">
              <span className="confidence-label">Confidence:</span>
              <span className="confidence-value">{weatherData.recommendation.confidence}%</span>
            </div>
          </div>
        </div>
      )}

      {weatherData.alerts && weatherData.alerts.length > 0 && (
        <div className="weather-alerts">
          {weatherData.alerts.slice(0, 2).map((alert, index) => (
            <div key={index} className={`alert ${alert.type}`}>
              <span className="alert-icon">{alert.icon}</span>
              <span className="alert-text">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      <div className="last-updated">
        Last updated: {new Date(weatherData.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default WeatherWidget;