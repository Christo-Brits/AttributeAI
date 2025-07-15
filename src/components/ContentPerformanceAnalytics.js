import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Eye, Globe, Share2, Heart,
  ArrowUp, ArrowDown, Filter, Calendar, Download, RefreshCw, AlertCircle,
  Zap, Award, Star, Link, X, FileText
} from 'lucide-react';
import ContentAttributionService from '../services/ContentAttributionService';

const ContentPerformanceAnalytics = ({ isOpen, onClose, contentData = null }) => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('30d');

  const contentAttributionService = new ContentAttributionService();

  useEffect(() => {
    if (isOpen) {
      loadPerformanceData();
    }
  }, [isOpen, timeframe]);

  const loadPerformanceData = async () => {
    setLoading(true);
    try {
      let contentList = contentAttributionService.getContentList();
      if (contentList.length === 0) {
        contentList = contentAttributionService.initializeSampleData();
      }

      const processedData = contentList.map(item => ({
        ...item,
        performanceScore: contentAttributionService.calculatePerformanceScore(item),
        trends: {
          viewsChange: Math.random() * 40 - 20,
          engagementChange: Math.random() * 30 - 15,
          rankingChange: Math.floor(Math.random() * 6) - 3,
          conversionChange: Math.random() * 20 - 10
        },
        engagement: {
          comments: Math.floor(Math.random() * 50),
          likes: Math.floor(Math.random() * 200),
          saves: Math.floor(Math.random() * 100),
          emailSignups: item.leads || Math.floor(Math.random() * 50),
          socialShares: item.socialShares || Math.floor(Math.random() * 300)
        },
        metrics: {
          views: item.views,
          uniqueVisitors: item.uniqueVisitors,
          avgTimeOnPage: item.avgTimeOnPage,
          bounceRate: item.bounceRate,
          socialShares: item.socialShares,
          backlinks: item.backlinks,
          organicTraffic: item.organicTraffic,
          conversionRate: item.conversionRate,
          leads: item.leads,
          emailSignups: item.leads
        }
      }));

      const summary = contentAttributionService.generatePerformanceSummary(contentList);
      const insights = contentAttributionService.generateContentInsights(processedData);

      setPerformanceData({
        overview: {
          totalContent: summary.totalContent,
          avgPerformanceScore: summary.avgPerformanceScore,
          totalViews: summary.totalViews,
          totalEngagement: processedData.reduce((sum, item) => 
            sum + (item.engagement.comments + item.engagement.likes), 0
          ),
          topPerformer: summary.topPerformer
        },
        contentItems: processedData,
        insights: insights
      });

    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Content Performance Analytics</h2>
                <p className="text-blue-100">Track, analyze, and optimize your content performance</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select 
                  value={timeframe} 
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={loadPerformanceData}
                className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading performance data...</p>
              </div>
            </div>
          ) : performanceData ? (
            <div className="space-y-6">
              {/* Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Content</p>
                      <p className="text-2xl font-bold text-blue-900">{performanceData.overview.totalContent}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Avg Performance</p>
                      <p className="text-2xl font-bold text-green-900">{performanceData.overview.avgPerformanceScore}</p>
                    </div>
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Total Views</p>
                      <p className="text-2xl font-bold text-orange-900">{formatNumber(performanceData.overview.totalViews)}</p>
                    </div>
                    <Eye className="w-8 h-8 text-orange-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Total Engagement</p>
                      <p className="text-2xl font-bold text-purple-900">{formatNumber(performanceData.overview.totalEngagement)}</p>
                    </div>
                    <Heart className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Top Performer Highlight */}
              {performanceData.overview.topPerformer && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Top Performer</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Title</p>
                      <p className="font-medium">{performanceData.overview.topPerformer.title}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Performance Score</p>
                      <p className="font-bold text-green-600">{performanceData.overview.topPerformer.score}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Views</p>
                      <p className="font-medium">{formatNumber(performanceData.overview.topPerformer.views)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Leads</p>
                      <p className="font-medium">{formatNumber(performanceData.overview.topPerformer.leads || 0)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Insights */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                <div className="space-y-4">
                  {performanceData.insights.map((insight, index) => (
                    <div key={index} className={`flex items-start gap-3 p-4 rounded-lg ${
                      insight.type === 'success' ? 'bg-green-50 border border-green-200' :
                      insight.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className={`mt-0.5 ${
                        insight.type === 'success' ? 'text-green-600' :
                        insight.type === 'warning' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        {insight.type === 'success' && <Zap className="w-5 h-5" />}
                        {insight.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                        {insight.type === 'opportunity' && <TrendingUp className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{insight.description}</p>
                        <p className="text-gray-800 text-sm mt-2 font-medium">Action: {insight.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Performance List */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Content Performance Details</h3>
                </div>

                <div className="divide-y divide-gray-200">
                  {performanceData.contentItems.map((item) => (
                    <div key={item.contentId} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="capitalize">{item.contentType.replace('-', ' ')}</span>
                            <span>{new Date(item.publishDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            {item.performanceScore}
                          </div>
                          <div className="text-xs text-gray-500">Performance Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="font-medium">{formatNumber(item.metrics.views)}</p>
                          <p className="text-xs text-gray-500">Views</p>
                        </div>

                        <div className="text-center">
                          <p className="font-medium">{item.metrics.avgTimeOnPage}</p>
                          <p className="text-xs text-gray-500">Avg Time</p>
                        </div>

                        <div className="text-center">
                          <p className="font-medium">{item.metrics.conversionRate}%</p>
                          <p className="text-xs text-gray-500">Conversion</p>
                        </div>

                        <div className="text-center">
                          <p className="font-medium">{item.metrics.leads}</p>
                          <p className="text-xs text-gray-500">Leads</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <span>Organic: {item.metrics.organicTraffic}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          <span>{formatNumber(item.engagement.socialShares)} shares</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Link className="w-4 h-4" />
                          <span>{item.metrics.backlinks} backlinks</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No performance data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPerformanceAnalytics;