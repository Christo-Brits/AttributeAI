import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, Clock, Target, Zap, Cloud, Users, DollarSign, MapPin, ArrowRight } from 'lucide-react';
import SEODashboardWidget from './SEODashboardWidget';
import ContentStrategyWidget from './ContentStrategyWidget';

const AttributionEngine = () => {
  const [selectedModel, setSelectedModel] = useState('linear');
  const [timeRange, setTimeRange] = useState('30d');
  const [weatherFilter, setWeatherFilter] = useState('all');

  // Mock customer journey data
  const mockJourneys = [
    {
      customerId: 'C001',
      touchpoints: [
        { timestamp: '2024-05-15T09:00:00Z', channel: 'Google Ads', campaign: 'Emergency Plumbing', cost: 12.50, weather: 'Heavy Rain' },
        { timestamp: '2024-05-15T14:30:00Z', channel: 'Facebook', campaign: 'Brand Awareness', cost: 8.20, weather: 'Heavy Rain' },
        { timestamp: '2024-05-16T10:15:00Z', channel: 'Email', campaign: 'Follow-up', cost: 2.00, weather: 'Cloudy' },
        { timestamp: '2024-05-16T16:45:00Z', channel: 'Direct', campaign: 'Website Visit', cost: 0, weather: 'Sunny' }
      ],
      conversion: { value: 850, timestamp: '2024-05-16T17:00:00Z' }
    },
    {
      customerId: 'C002',
      touchpoints: [
        { timestamp: '2024-05-14T11:00:00Z', channel: 'Google Ads', campaign: 'Drain Cleaning', cost: 15.80, weather: 'Stormy' },
        { timestamp: '2024-05-15T16:20:00Z', channel: 'Organic Search', campaign: 'SEO', cost: 0, weather: 'Heavy Rain' }
      ],
      conversion: { value: 1200, timestamp: '2024-05-15T17:30:00Z' }
    },
    {
      customerId: 'C003',
      touchpoints: [
        { timestamp: '2024-05-13T08:30:00Z', channel: 'Facebook', campaign: 'Storm Prep', cost: 18.50, weather: 'Sunny' },
        { timestamp: '2024-05-14T12:15:00Z', channel: 'Google Ads', campaign: 'Emergency Plumbing', cost: 22.30, weather: 'Heavy Rain' },
        { timestamp: '2024-05-14T19:45:00Z', channel: 'Email', campaign: 'Weather Alert', cost: 1.50, weather: 'Heavy Rain' },
        { timestamp: '2024-05-15T09:30:00Z', channel: 'Direct', campaign: 'Phone Call', cost: 0, weather: 'Cloudy' }
      ],
      conversion: { value: 950, timestamp: '2024-05-15T10:00:00Z' }
    }
  ];

  // Attribution Models
  const calculateAttribution = (journey, model) => {
    const touchpoints = journey.touchpoints;
    const conversionValue = journey.conversion.value;
    
    switch (model) {
      case 'first-click':
        return touchpoints.map((tp, index) => ({
          ...tp,
          attribution: index === 0 ? conversionValue : 0,
          attributionPercent: index === 0 ? 100 : 0
        }));
        
      case 'last-click':
        return touchpoints.map((tp, index) => ({
          ...tp,
          attribution: index === touchpoints.length - 1 ? conversionValue : 0,
          attributionPercent: index === touchpoints.length - 1 ? 100 : 0
        }));        
      case 'linear':
        const linearValue = conversionValue / touchpoints.length;
        const linearPercent = 100 / touchpoints.length;
        return touchpoints.map(tp => ({
          ...tp,
          attribution: linearValue,
          attributionPercent: linearPercent
        }));
        
      case 'time-decay':
        const halfLife = 7; // 7 days half-life
        const now = new Date(journey.conversion.timestamp);
        const weights = touchpoints.map(tp => {
          const daysDiff = (now - new Date(tp.timestamp)) / (1000 * 60 * 60 * 24);
          return Math.pow(0.5, daysDiff / halfLife);
        });
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        return touchpoints.map((tp, index) => ({
          ...tp,
          attribution: (weights[index] / totalWeight) * conversionValue,
          attributionPercent: (weights[index] / totalWeight) * 100
        }));
        
      case 'position-based':
        if (touchpoints.length === 1) {
          return [{...touchpoints[0], attribution: conversionValue, attributionPercent: 100}];
        } else if (touchpoints.length === 2) {
          return [
            {...touchpoints[0], attribution: conversionValue * 0.5, attributionPercent: 50},
            {...touchpoints[1], attribution: conversionValue * 0.5, attributionPercent: 50}
          ];
        } else {
          const firstLast = conversionValue * 0.4;
          const middle = (conversionValue * 0.2) / (touchpoints.length - 2);
          return touchpoints.map((tp, index) => {
            if (index === 0 || index === touchpoints.length - 1) {
              return {...tp, attribution: firstLast, attributionPercent: 40};
            } else {
              return {...tp, attribution: middle, attributionPercent: 20 / (touchpoints.length - 2)};
            }
          });
        }
        
      default:
        return touchpoints.map(tp => ({...tp, attribution: 0, attributionPercent: 0}));
    }
  };

  // Apply attribution model to all journeys
  const applyAttributionModel = (journeys, model) => {
    return journeys.flatMap(journey => 
      calculateAttribution(journey, model).map(tp => ({
        ...tp,
        customerId: journey.customerId,
        conversionValue: journey.conversion.value
      }))
    );
  };

  // Calculate channel data with weather correlation
  const attributedJourneys = applyAttributionModel(mockJourneys, selectedModel);
  const channelData = attributedJourneys.reduce((acc, tp) => {
    if (!acc[tp.channel]) {
      acc[tp.channel] = {
        channel: tp.channel,
        attribution: 0,
        cost: 0,
        touchpoints: 0,
        roas: 0,
        weatherCorrelation: {}
      };
    }
    
    acc[tp.channel].attribution += tp.attribution;
    acc[tp.channel].cost += tp.cost;
    acc[tp.channel].touchpoints += 1;
    
    // Weather correlation
    if (!acc[tp.channel].weatherCorrelation[tp.weather]) {
      acc[tp.channel].weatherCorrelation[tp.weather] = 0;
    }
    acc[tp.channel].weatherCorrelation[tp.weather] += tp.attribution;
    
    return acc;
  }, {});

  // Calculate ROAS
  if (channelData && Object.keys(channelData).length > 0) {
    Object.values(channelData).forEach(channel => {
      channel.roas = channel.cost > 0 ? (channel.attribution / channel.cost).toFixed(2) : 'N/A';
    });
  }

  const channelArray = channelData ? Object.values(channelData) : [];

  // Process journeys for visualization
  const processedJourneys = mockJourneys ? mockJourneys.map(journey => {
    const attributedTouchpoints = calculateAttribution(journey, selectedModel);
    return {
      ...journey,
      attributedTouchpoints
    };
  }) : [];

  // Weather correlation data
  const weatherData = processedJourneys && processedJourneys.length > 0 ? processedJourneys.reduce((acc, journey) => {
    if (journey.attributedTouchpoints && journey.attributedTouchpoints.length > 0) {
      journey.attributedTouchpoints.forEach(tp => {
        if (!acc[tp.weather]) {
          acc[tp.weather] = { weather: tp.weather, attribution: 0, touchpoints: 0 };
        }
        acc[tp.weather].attribution += tp.attribution || 0;
        acc[tp.weather].touchpoints += 1;
      });
    }
    return acc;
  }, {}) : {};

  const weatherArray = Object.values(weatherData);

  // Attribution model comparison
  const modelComparison = ['first-click', 'last-click', 'linear', 'time-decay', 'position-based'].map(model => {
    const totalAttribution = mockJourneys && mockJourneys.length > 0 ? mockJourneys.reduce((sum, journey) => {
      const attributed = calculateAttribution(journey, model);
      return sum + (attributed && attributed.length > 0 ? attributed.reduce((tpSum, tp) => tpSum + (tp.attribution || 0), 0) : 0);
    }, 0) : 0;
    
    const totalCost = channelArray && channelArray.length > 0 ? channelArray.reduce((sum, ch) => sum + (ch.cost || 0), 0) : 1;
    
    return {
      model: model.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: totalAttribution,
      roas: totalCost > 0 ? (totalAttribution / totalCost).toFixed(2) : '0.00'
    };
  });

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Advanced Attribution Engine
          </h1>
          <p className="text-gray-300 text-lg">Multi-touch attribution with weather intelligence correlation</p>
        </div>

        {/* Controls */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Attribution Model</label>
              <select 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
              >
                <option value="first-click">First Click Attribution</option>
                <option value="last-click">Last Click Attribution</option>
                <option value="linear">Linear Attribution</option>
                <option value="time-decay">Time-Decay Attribution</option>
                <option value="position-based">Position-Based Attribution</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full p-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Weather Filter</label>
              <select 
                value={weatherFilter} 
                onChange={(e) => setWeatherFilter(e.target.value)}
                className="w-full p-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50"
              >
                <option value="all">All Weather</option>
                <option value="stormy">Stormy Weather</option>
                <option value="rain">Heavy Rain</option>
                <option value="sunny">Clear Weather</option>
              </select>
            </div>
          </div>
        </div>
        {/* Attribution Model Explanation */}
        <div className="bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <Eye className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-300">
                {selectedModel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Model
              </h3>
              <div className="mt-2 text-sm text-blue-200">
                {selectedModel === 'first-click' && "Gives 100% credit to the first touchpoint in the customer journey."}
                {selectedModel === 'last-click' && "Gives 100% credit to the final touchpoint before conversion."}
                {selectedModel === 'linear' && "Distributes conversion credit equally across all touchpoints."}
                {selectedModel === 'time-decay' && "Gives more credit to touchpoints closer to the conversion time."}
                {selectedModel === 'position-based' && "Gives 40% credit each to first and last touchpoints, 20% to middle touchpoints."}
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  ${(channelArray && channelArray.length > 0 ? channelArray.reduce((sum, ch) => sum + (ch.attribution || 0), 0) : 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Average ROAS</p>
                <p className="text-2xl font-bold text-white">
                  {channelArray && channelArray.length > 0 
                    ? (channelArray.reduce((sum, ch) => sum + parseFloat(ch.roas || 0), 0) / channelArray.length).toFixed(2)
                    : '0.00'}x
                </p>
              </div>
            </div>
          </div>          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-8 w-8 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Touchpoints</p>
                <p className="text-2xl font-bold text-white">
                  {channelArray && channelArray.length > 0 ? channelArray.reduce((sum, ch) => sum + (ch.touchpoints || 0), 0) : 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Cloud className="h-8 w-8 text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Weather Events</p>
                <p className="text-2xl font-bold text-white">
                  {weatherArray.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Intelligence Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SEODashboardWidget />
          <ContentStrategyWidget />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Channel Attribution */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Channel Attribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelArray}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="channel" stroke="#9CA3AF" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Attribution']} />
                <Bar dataKey="attribution" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weather Correlation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Attribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={weatherArray}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="attribution"
                  label={({weather, attribution}) => `${weather}: $${attribution.toFixed(0)}`}
                >
                  {weatherArray.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Attribution']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Attribution Model Comparison */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Attribution Model Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={modelComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="model" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'value' ? `$${value.toLocaleString()}` : `${value}x`,
                  name === 'value' ? 'Total Attribution' : 'ROAS'
                ]}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Bar dataKey="value" fill="#10B981" name="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Journey Visualization */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Customer Journey Analysis</h3>
          <div className="space-y-6">
            {processedJourneys.map((journey, index) => (
              <div key={journey.customerId} className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-medium text-white mb-2">Customer {journey.customerId}</h4>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {journey.attributedTouchpoints.map((tp, tpIndex) => (
                    <div key={tpIndex} className="flex items-center">
                      <div className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-700/50">
                        {tp.channel}
                        <span className="ml-1 text-xs">
                          (${tp.attribution.toFixed(0)})
                        </span>
                      </div>
                      {tpIndex < journey.attributedTouchpoints.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                      )}
                    </div>
                  ))}
                  <div className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-sm font-medium border border-green-700/50">
                    Conversion: ${journey.conversion.value}
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  Journey Length: {journey.touchpoints.length} touchpoints | 
                  Total Attribution: ${journey.attributedTouchpoints.reduce((sum, tp) => sum + tp.attribution, 0).toFixed(0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributionEngine;