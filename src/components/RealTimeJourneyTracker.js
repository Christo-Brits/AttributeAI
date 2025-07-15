import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Clock, Target, MapPin, Smartphone, Monitor, Tablet, Cloud, Activity, Plus } from 'lucide-react';

const RealTimeJourneyTracker = () => {
  const [activeSessions, setActiveSessions] = useState([]);
  const [recentTouchpoints, setRecentTouchpoints] = useState([]);
  const [journeyStats, setJourneyStats] = useState({
    totalSessions: 0,
    averageJourneyLength: 0,
    conversionRate: 0,
    realTimeVisitors: 0
  });
  const [weatherData, setWeatherData] = useState({
    current: 'Partly Cloudy',
    temperature: '72°F',
    conditions: 'Normal'
  });

  // Simulate real-time session tracking
  useEffect(() => {
    const sessionInterval = setInterval(() => {
      // Simulate new sessions and touchpoints
      const newSession = generateRandomSession();
      const newTouchpoint = generateRandomTouchpoint();
      
      setActiveSessions(prev => {
        const updated = [...prev, newSession].slice(-10); // Keep last 10 sessions
        return updated;
      });
      
      setRecentTouchpoints(prev => {
        const updated = [newTouchpoint, ...prev].slice(0, 20); // Keep last 20 touchpoints
        return updated;
      });
      
      // Update journey stats
      setJourneyStats(prev => ({
        totalSessions: prev.totalSessions + 1,
        averageJourneyLength: Math.random() * 5 + 2,
        conversionRate: Math.random() * 15 + 5,
        realTimeVisitors: Math.floor(Math.random() * 50) + 10
      }));
      
    }, 3000); // New data every 3 seconds

    return () => clearInterval(sessionInterval);
  }, []);

  const generateRandomSession = () => {
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    const sources = ['Google Ads', 'Facebook', 'Email', 'Direct', 'Organic Search'];
    
    return {
      id: `S${Date.now()}${Math.floor(Math.random() * 1000)}`,
      device: devices[Math.floor(Math.random() * devices.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      startTime: new Date(),
      touchpoints: Math.floor(Math.random() * 4) + 1,
      weather: weatherData.current,
      isActive: true,
      customerType: Math.random() > 0.7 ? 'Returning' : 'New'
    };
  };

  const generateRandomTouchpoint = () => {
    const channels = ['Google Ads', 'Facebook', 'Email', 'Direct', 'Organic Search', 'YouTube'];
    const campaigns = ['Emergency Plumbing', 'Drain Cleaning', 'Brand Awareness', 'Storm Prep', 'Winter Service'];
    const pages = ['/services', '/contact', '/emergency', '/about', '/pricing'];
    
    return {
      id: `TP${Date.now()}${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date(),
      channel: channels[Math.floor(Math.random() * channels.length)],
      campaign: campaigns[Math.floor(Math.random() * campaigns.length)],
      page: pages[Math.floor(Math.random() * pages.length)],
      weather: weatherData.current,
      attribution: Math.floor(Math.random() * 500) + 50,
      sessionId: `S${Date.now() - Math.floor(Math.random() * 10000)}`,
      device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)]
    };
  };

  // Real-time journey analytics
  const journeyAnalytics = recentTouchpoints.reduce((acc, tp) => {
    const hour = tp.timestamp.getHours();
    const hourKey = `${hour}:00`;
    
    if (!acc[hourKey]) {
      acc[hourKey] = { hour: hourKey, touchpoints: 0, attribution: 0 };
    }
    
    acc[hourKey].touchpoints += 1;
    acc[hourKey].attribution += tp.attribution;
    
    return acc;
  }, {});

  const analyticsData = Object.values(journeyAnalytics).sort((a, b) => 
    parseInt(a.hour) - parseInt(b.hour)
  );

  // Device breakdown
  const deviceData = activeSessions.reduce((acc, session) => {
    if (!acc[session.device]) {
      acc[session.device] = { device: session.device, count: 0, percentage: 0 };
    }
    acc[session.device].count += 1;
    return acc;
  }, {});

  // Calculate percentages
  const totalSessions = activeSessions.length;
  Object.values(deviceData).forEach(device => {
    device.percentage = totalSessions > 0 ? ((device.count / totalSessions) * 100).toFixed(1) : 0;
  });

  const deviceArray = Object.values(deviceData);

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Desktop': return <Monitor className="h-4 w-4" />;
      case 'Mobile': return <Smartphone className="h-4 w-4" />;
      case 'Tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Real-Time Journey Tracking</h1>
              <p className="text-gray-600">Live customer session monitoring with weather intelligence</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-1" />
                Live Tracking
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Cloud className="h-4 w-4 mr-1" />
                {weatherData.current} {weatherData.temperature}
              </div>
            </div>
          </div>
        </div>
        {/* Real-Time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{journeyStats.realTimeVisitors}</p>
                <p className="text-xs text-green-600">Live now</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{journeyStats.conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-blue-600">Weather correlated</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Journey Length</p>
                <p className="text-2xl font-bold text-gray-900">{journeyStats.averageJourneyLength.toFixed(1)}</p>
                <p className="text-xs text-gray-600">touchpoints</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{journeyStats.totalSessions}</p>
                <p className="text-xs text-gray-600">since start</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Real-Time Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-Time Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'touchpoints' ? `${value} touchpoints` : `$${value}`,
                    name === 'touchpoints' ? 'Touchpoints' : 'Attribution'
                  ]} 
                />
                <Line type="monotone" dataKey="touchpoints" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="attribution" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deviceArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="device" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Bar dataKey="percentage" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Active Sessions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {activeSessions.length} Live
            </span>
          </div>
          <div className="overflow-hidden">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getDeviceIcon(session.device)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {session.customerType} Customer
                      </p>
                      <p className="text-xs text-gray-600">
                        {session.source} • {session.location} • {session.device}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {session.touchpoints} touchpoints
                    </p>
                    <p className="text-xs text-gray-600">
                      Started {formatTime(session.startTime)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Live</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Touchpoints */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Touchpoints</h3>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Real-time updates</span>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentTouchpoints.map((touchpoint, index) => (
                <div 
                  key={touchpoint.id} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-500 ${
                    index === 0 ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {touchpoint.channel} → {touchpoint.page}
                      </p>
                      <p className="text-xs text-gray-600">
                        {touchpoint.campaign} • {touchpoint.device} • {touchpoint.weather}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${touchpoint.attribution}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatTime(touchpoint.timestamp)}
                    </p>
                  </div>
                  {index === 0 && (
                    <div className="flex items-center space-x-1">
                      <Plus className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-600 font-medium">New</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeJourneyTracker;