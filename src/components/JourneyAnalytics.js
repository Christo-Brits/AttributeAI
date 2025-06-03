import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Users, Clock, Target, Filter, Download } from 'lucide-react';

const JourneyAnalytics = () => {
  const [journeyData, setJourneyData] = useState([]);
  const [conversionPaths, setConversionPaths] = useState([]);
  const [timeFilter, setTimeFilter] = useState('24h');
  const [deviceFilter, setDeviceFilter] = useState('all');

  useEffect(() => {
    // Generate sample journey analytics data
    const generateJourneyAnalytics = () => {
      const data = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - (i * 60 * 60 * 1000));
        data.push({
          time: hour.getHours() + ':00',
          sessions: Math.floor(Math.random() * 50) + 10,
          conversions: Math.floor(Math.random() * 8) + 1,
          averageJourneyLength: Math.random() * 3 + 2,
          weatherImpact: Math.random() * 40 + 60, // 60-100% baseline
          conversionRate: ((Math.floor(Math.random() * 8) + 1) / (Math.floor(Math.random() * 50) + 10)) * 100
        });
      }
      
      setJourneyData(data);
    };

    const generateConversionPaths = () => {
      const paths = [
        { 
          path: 'Google Ads → Landing Page → Contact Form',
          frequency: 45,
          conversionRate: 12.5,
          averageValue: 850,
          journeyLength: 3,
          weather: 'Heavy Rain'
        },
        {
          path: 'Facebook → About Page → Services → Contact',
          frequency: 32,
          conversionRate: 8.7,
          averageValue: 720,
          journeyLength: 4,
          weather: 'Sunny'
        },
        {
          path: 'Email → Emergency Page → Phone Call',
          frequency: 28,
          conversionRate: 18.2,
          averageValue: 1200,
          journeyLength: 3,
          weather: 'Stormy'
        },
        {
          path: 'Organic Search → Services → Pricing → Contact',
          frequency: 24,
          conversionRate: 6.4,
          averageValue: 650,
          journeyLength: 4,
          weather: 'Cloudy'
        },
        {
          path: 'Direct → Emergency → Contact Form',
          frequency: 19,
          conversionRate: 22.1,
          averageValue: 950,
          journeyLength: 3,
          weather: 'Heavy Rain'
        }
      ];
      
      setConversionPaths(paths);
    };

    generateJourneyAnalytics();
    generateConversionPaths();

    // Update data every 30 seconds
    const interval = setInterval(() => {
      generateJourneyAnalytics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const totalSessions = journeyData.reduce((sum, item) => sum + item.sessions, 0);
  const totalConversions = journeyData.reduce((sum, item) => sum + item.conversions, 0);
  const overallConversionRate = totalSessions > 0 ? (totalConversions / totalSessions * 100).toFixed(2) : 0;
  const avgJourneyLength = journeyData.length > 0 ? 
    (journeyData.reduce((sum, item) => sum + item.averageJourneyLength, 0) / journeyData.length).toFixed(1) : 0;

  const weatherColors = {
    'Heavy Rain': '#3B82F6',
    'Stormy': '#8B5CF6', 
    'Cloudy': '#6B7280',
    'Sunny': '#F59E0B'
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Journey Analytics</h1>
          <p className="text-gray-600">Deep insights into customer behavior and conversion paths</p>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <select 
                value={deviceFilter} 
                onChange={(e) => setDeviceFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Devices</option>
                <option value="desktop">Desktop</option>
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
              </select>
            </div>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{totalSessions.toLocaleString()}</p>
                <p className="text-xs text-green-600">↑ 12% vs yesterday</p>
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
                <p className="text-2xl font-bold text-gray-900">{overallConversionRate}%</p>
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
                <p className="text-2xl font-bold text-gray-900">{avgJourneyLength}</p>
                <p className="text-xs text-gray-600">touchpoints</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{totalConversions}</p>
                <p className="text-xs text-green-600">↑ 8% vs yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyAnalytics;