import React, { useState, useEffect } from 'react';
import {
  TrendingUp, DollarSign, Users, Target, Clock, BarChart3,
  ArrowRight, Share2, Eye, MousePointer, Calendar, Download,
  RefreshCw, Filter, X, ChevronDown, ChevronUp, Zap, AlertCircle,
  Award, Globe, Mail, Search, MessageSquare, ExternalLink
} from 'lucide-react';
import ContentAttributionBridge from '../services/ContentAttributionBridge';

const AttributionIntegrationDashboard = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [attributionData, setAttributionData] = useState(null);
  const [selectedModel, setSelectedModel] = useState('linear');

  const attributionBridge = new ContentAttributionBridge();

  useEffect(() => {
    if (isOpen) {
      loadAttributionData();
    }
  }, [isOpen]);

  const loadAttributionData = async () => {
    setLoading(true);
    try {
      let data = attributionBridge.getAttributionIntegrationData();
      if (!data) {
        data = await attributionBridge.initializeAttributionIntegration();
      }
      setAttributionData(data);
    } catch (error) {
      console.error('Error loading attribution data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const exportData = () => {
    try {
      const data = attributionBridge.exportAttributionAnalysis('json');
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attribution-analysis-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Content Attribution Integration</h2>
                <p className="text-indigo-100">Multi-touch attribution analysis for content performance</p>
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
                <Filter className="w-4 h-4 text-gray-500" />
                <select 
                  value={selectedModel} 
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="linear">Linear Attribution</option>
                  <option value="firstTouch">First-Touch Attribution</option>
                  <option value="lastTouch">Last-Touch Attribution</option>
                  <option value="timeDecay">Time-Decay Attribution</option>
                  <option value="positionBased">Position-Based Attribution</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={loadAttributionData}
                className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              
              <button 
                onClick={exportData}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading attribution data...</p>
              </div>
            </div>
          ) : attributionData ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(attributionData.overall?.totalRevenue || 0)}
                      </p>
                      <p className="text-xs text-green-700 mt-1">From content attribution</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Touchpoints</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {attributionData.overall?.totalTouchpoints || 0}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">Content interactions</p>
                    </div>
                    <MousePointer className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Customer Journeys</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {attributionData.overall?.totalCustomers || 0}
                      </p>
                      <p className="text-xs text-purple-700 mt-1">Analyzed journeys</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 text-sm font-medium">Avg Journey Length</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {Math.round(attributionData.overall?.averageJourneyLength || 0)}
                      </p>
                      <p className="text-xs text-orange-700 mt-1">Touchpoints per journey</p>
                    </div>
                    <ArrowRight className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Attribution Model Comparison */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attribution Model Comparison</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {attributionData.overall?.attributionModelComparison && Object.entries(attributionData.overall.attributionModelComparison).map(([model, revenue]) => (
                    <div key={model} className={`p-4 rounded-lg border ${selectedModel === model ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 capitalize">{model.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-xl font-bold text-indigo-600 mt-1">{formatCurrency(revenue)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {Math.round((revenue / attributionData.overall.totalRevenue) * 100)}% of total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Performance Ranking */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Content Attribution Ranking</h3>
                  <p className="text-sm text-gray-600 mt-1">Ranked by {selectedModel.replace(/([A-Z])/g, ' $1').toLowerCase()} attribution revenue</p>
                </div>

                <div className="divide-y divide-gray-200">
                  {attributionData.overall?.contentPerformanceRanking?.map((content, index) => (
                    <div key={content.contentId} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{content.title}</h4>
                            <p className="text-sm text-gray-600">ID: {content.contentId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{formatCurrency(content.totalRevenue)}</p>
                          <p className="text-xs text-gray-500">Total Revenue</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="font-medium">{content.totalTouchpoints}</p>
                          <p className="text-xs text-gray-500">Touchpoints</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{content.uniqueCustomers}</p>
                          <p className="text-xs text-gray-500">Customers</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{formatDuration(Math.round(content.averageEngagement))}</p>
                          <p className="text-xs text-gray-500">Avg Engagement</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">{content.conversionInfluence.toFixed(1)}%</p>
                          <p className="text-xs text-gray-500">Conversion Rate</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attribution Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                    <Award className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">High Revenue Attribution</h4>
                      <p className="text-gray-600 text-sm mt-1">Multi-touch attribution reveals significant revenue from content touchpoints</p>
                      <p className="text-gray-800 text-sm mt-2 font-medium">Action: Invest more in high-performing content formats</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Journey Complexity</h4>
                      <p className="text-gray-600 text-sm mt-1">Customer journeys show strong content influence across multiple touchpoints</p>
                      <p className="text-gray-800 text-sm mt-2 font-medium">Action: Create content sequences that guide customers through the journey</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Attribution Model Insights</h4>
                      <p className="text-gray-600 text-sm mt-1">Different attribution models show varying revenue attribution</p>
                      <p className="text-gray-800 text-sm mt-2 font-medium">Action: Use multiple models for comprehensive attribution view</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No attribution data available</p>
              <button
                onClick={loadAttributionData}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Initialize Attribution Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttributionIntegrationDashboard;