import React, { useState, useEffect } from 'react';
import { 
  LineChart, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, 
  Tooltip, Line, Bar 
} from 'recharts';
import { 
  Users, TrendingUp, DollarSign, Target, Calendar, ArrowUp, ArrowDown,
  Activity, Eye, UserCheck, Award
} from 'lucide-react';
import { Card, Button } from './ui/DesignSystem';
import { useAuth } from './auth/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';

const UserAnalyticsDashboard = () => {
  const { user } = useAuth();
  const { trackPage } = useAnalytics();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [conversionFunnel, setConversionFunnel] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    trackPage('User Analytics Dashboard', 'analytics');
    loadDashboardData();
  }, [trackPage]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock analytics data
    const mockData = {
      metrics: {
        totalUsers: 2847,
        activeUsers: 1932,
        newSignups: 156,
        conversionRate: 8.2,
        averageLTV: 487,
        churnRate: 3.1,
        revenueThisMonth: 23450,
        growthRate: 12.5
      },
      trends: {
        dailySignups: [
          { date: '12/09', signups: 23 },
          { date: '12/10', signups: 31 },
          { date: '12/11', signups: 18 },
          { date: '12/12', signups: 42 },
          { date: '12/13', signups: 29 },
          { date: '12/14', signups: 38 },
          { date: '12/15', signups: 45 }
        ],
        dailyRevenue: [
          { date: '12/09', revenue: 1240 },
          { date: '12/10', revenue: 1580 },
          { date: '12/11', revenue: 920 },
          { date: '12/12', revenue: 2100 },
          { date: '12/13', revenue: 1650 },
          { date: '12/14', revenue: 1890 },
          { date: '12/15', revenue: 2340 }
        ],
        featureAdoption: [
          { feature: 'SEO Analysis', percentage: 78 },
          { feature: 'Content Generator', percentage: 65 },
          { feature: 'Attribution Engine', percentage: 52 },
          { feature: 'Lead Magnets', percentage: 41 },
          { feature: 'CRO Analyzer', percentage: 33 }
        ]
      },
      recentActivities: [
        { id: 1, userId: 'U-2847', action: 'subscription_upgraded', timestamp: new Date(), feature: null },
        { id: 2, userId: 'U-2843', action: 'feature_used', timestamp: new Date(Date.now() - 300000), feature: 'seo-analysis' },
        { id: 3, userId: 'U-2841', action: 'login', timestamp: new Date(Date.now() - 600000), feature: null },
        { id: 4, userId: 'U-2839', action: 'feature_used', timestamp: new Date(Date.now() - 900000), feature: 'content-generator' }
      ]
    };

    // Mock conversion funnel
    const mockFunnel = {
      summary: {
        totalVisitors: 12450,
        totalConverted: 287,
        overallConversionRate: 2.3,
        biggestDropoff: {
          stage: 'trial_signup',
          rate: 42
        }
      },
      funnel: [
        { stage: 'visitor', name: 'Website Visitors', count: 12450, conversionRate: null, dropoffRate: 0 },
        { stage: 'signup', name: 'Trial Signup', count: 1847, conversionRate: 14.8, dropoffRate: 85.2 },
        { stage: 'activated', name: 'First Feature Used', count: 1203, conversionRate: 65.1, dropoffRate: 34.9 },
        { stage: 'engaged', name: 'Multiple Features Used', count: 745, conversionRate: 61.9, dropoffRate: 38.1 },
        { stage: 'qualified', name: 'High Engagement Score', count: 456, conversionRate: 61.2, dropoffRate: 38.8 },
        { stage: 'converted', name: 'Paid Customer', count: 287, conversionRate: 62.9, dropoffRate: 37.1 }
      ]
    };

    // Mock user data
    const mockUsers = Array.from({ length: 20 }, (_, i) => ({
      id: `U-${2847 - i}`,
      firstName: ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa'][Math.floor(Math.random() * 6)],
      lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'][Math.floor(Math.random() * 6)],
      email: `user${2847 - i}@example.com`,
      country: ['USA', 'Canada', 'UK', 'Australia', 'Germany'][Math.floor(Math.random() * 5)],
      accountType: ['free', 'professional', 'enterprise'][Math.floor(Math.random() * 3)],
      conversionStage: ['visitor', 'signup', 'activated', 'engaged', 'qualified', 'converted'][Math.floor(Math.random() * 6)],
      engagementScore: Math.floor(Math.random() * 100),
      trialDaysRemaining: Math.random() > 0.3 ? Math.floor(Math.random() * 30) : null,
      featuresUsed: ['seo-analysis', 'content-generator', 'attribution'].slice(0, Math.floor(Math.random() * 3) + 1),
      lifetimeValue: Math.floor(Math.random() * 1000) + 100
    }));

    setDashboardData(mockData);
    setConversionFunnel(mockFunnel);
    setUsers(mockUsers);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner h-12 w-12 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track user behavior, conversion funnels, and business metrics</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: TrendingUp },
                { id: 'funnel', name: 'Conversion Funnel', icon: Target },
                { id: 'users', name: 'User Details', icon: Users },
                { id: 'behavior', name: 'User Behavior', icon: Activity }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Users"
                value={dashboardData.metrics.totalUsers.toLocaleString()}
                change="+12.5% from last month"
                positive={true}
                icon="👥"
              />
              <MetricCard
                title="Monthly Revenue"
                value={`$${dashboardData.metrics.revenueThisMonth.toLocaleString()}`}
                change="+8.2% from last month"
                positive={true}
                icon="💰"
              />
              <MetricCard
                title="Conversion Rate"
                value={`${dashboardData.metrics.conversionRate}%`}
                change="+0.3% from last month"
                positive={true}
                icon="🎯"
              />
              <MetricCard
                title="Average LTV"
                value={`$${dashboardData.metrics.averageLTV}`}
                change="+15.7% from last month"
                positive={true}
                icon="📈"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Signups */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Daily Signups (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dashboardData.trends.dailySignups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="signups" stroke="#0066CC" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Revenue */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Daily Revenue (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dashboardData.trends.dailyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#00AA44" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would continue here with similar structure */}
      </div>
    </div>
  );
};

// Helper Components
const MetricCard = ({ title, value, change, positive, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="ml-4 flex-1">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className={`text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
      </div>
    </div>
  </div>
);

export default UserAnalyticsDashboard;