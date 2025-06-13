import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Send,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  RefreshCw,
  Settings,
  Download,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import CMSIntegrationService from '../services/CMSIntegrationService';

const PublishingDashboard = ({ userProfile }) => {
  const [analytics, setAnalytics] = useState(null);
  const [scheduledContent, setScheduledContent] = useState([]);
  const [recentPublications, setRecentPublications] = useState([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const cmsService = new CMSIntegrationService();

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange, selectedPlatform]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load analytics
      const analyticsData = await cmsService.getPublishingAnalytics(selectedTimeRange);
      setAnalytics(analyticsData);

      // Load platforms
      const platforms = await cmsService.getAvailablePlatforms();
      setConnectedPlatforms(platforms.filter(p => p.connected));

      // Mock scheduled content
      const scheduled = [
        {
          id: 'sched-1',
          title: 'AI Marketing Trends 2025',
          platforms: ['wordpress', 'medium'],
          publishDate: '2025-06-15T10:00:00Z',
          status: 'scheduled',
          type: 'blog-post'
        },
        {
          id: 'sched-2',
          title: 'Content Strategy Guide',
          platforms: ['linkedin', 'ghost'],
          publishDate: '2025-06-16T14:30:00Z',
          status: 'scheduled',
          type: 'guide'
        }
      ];
      setScheduledContent(scheduled);

      // Mock recent publications
      const recent = [
        {
          id: 'pub-1',
          title: 'SEO Best Practices',
          platform: 'wordpress',
          publishedAt: '2025-06-13T09:00:00Z',
          status: 'published',
          stats: { views: 1245, likes: 89, shares: 23, comments: 15 }
        },
        {
          id: 'pub-2',
          title: 'Digital Marketing ROI',
          platform: 'medium',
          publishedAt: '2025-06-12T16:30:00Z',
          status: 'published',
          stats: { views: 892, likes: 67, shares: 34, comments: 8 }
        },
        {
          id: 'pub-3',
          title: 'Content Creation Tips',
          platform: 'linkedin',
          publishedAt: '2025-06-11T11:15:00Z',
          status: 'published',
          stats: { views: 654, likes: 45, shares: 12, comments: 22 }
        }
      ];
      setRecentPublications(recent);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      wordpress: '📝',
      medium: '📰',
      linkedin: '💼',
      ghost: '👻',
      webflow: '🎨',
      shopify: '🛍️'
    };
    return icons[platform] || '🌐';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverviewStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Total Published</p>
            <p className="text-3xl font-bold">{analytics?.totalPublished || 0}</p>
            <p className="text-blue-100 text-sm">this month</p>
          </div>
          <Send className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Success Rate</p>
            <p className="text-3xl font-bold">{analytics?.successRate || 0}%</p>
            <p className="text-green-100 text-sm">publishing success</p>
          </div>
          <CheckCircle className="h-12 w-12 text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Platforms</p>
            <p className="text-3xl font-bold">{connectedPlatforms.length}</p>
            <p className="text-purple-100 text-sm">connected</p>
          </div>
          <Globe className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm">Scheduled</p>
            <p className="text-3xl font-bold">{scheduledContent.length}</p>
            <p className="text-orange-100 text-sm">upcoming posts</p>
          </div>
          <Calendar className="h-12 w-12 text-orange-200" />
        </div>
      </div>
    </div>
  );

  const renderPlatformPerformance = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Platform Performance</h2>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={loadDashboardData}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {analytics?.platforms && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(analytics.platforms).map(([platformId, stats]) => (
            <div key={platformId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getPlatformIcon(platformId)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{platformId}</h3>
                    <p className="text-sm text-gray-600">{stats.published} published</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{stats.success}%</p>
                  <p className="text-xs text-gray-500">success</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Time:</span>
                  <span className="font-medium">{stats.avgTime}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${stats.success}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderScheduledContent = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Scheduled Publications</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Content
        </button>
      </div>

      {scheduledContent.length > 0 ? (
        <div className="space-y-4">
          {scheduledContent.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(item.publishDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(item.publishDate).toLocaleTimeString()}
                    </div>
                    <span className="capitalize">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.platforms.map((platform) => (
                      <span key={platform} className="text-lg" title={platform}>
                        {getPlatformIcon(platform)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No scheduled content</p>
          <p className="text-sm">Schedule your next post to see it here</p>
        </div>
      )}
    </div>
  );

  const renderRecentPublications = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Publications</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Platforms</option>
            <option value="wordpress">WordPress</option>
            <option value="medium">Medium</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {recentPublications.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <span className="text-lg">{getPlatformIcon(item.platform)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </div>
                  <div className="capitalize">{item.platform}</div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {item.stats.views.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {item.stats.likes}
                  </div>
                  <div className="flex items-center">
                    <Share2 className="h-4 w-4 mr-1" />
                    {item.stats.shares}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {item.stats.comments}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                  <BarChart3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mr-3" />
          <span className="text-gray-600">Loading publishing dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Publishing Dashboard</h1>
          <p className="text-gray-600">Monitor your content publishing performance across all platforms</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      {renderOverviewStats()}

      {/* Platform Performance */}
      {renderPlatformPerformance()}

      {/* Content Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          {renderScheduledContent()}
        </div>
        <div>
          {renderRecentPublications()}
        </div>
      </div>
    </div>
  );
};

export default PublishingDashboard;