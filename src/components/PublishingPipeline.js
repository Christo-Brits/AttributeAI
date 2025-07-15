import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Calendar, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Zap,
  BarChart3,
  RefreshCw,
  Plus,
  Edit3,
  Eye,
  Share2,
  Target,
  Layers,
  Upload,
  Download,
  X
} from 'lucide-react';
import CMSIntegrationService from '../services/CMSIntegrationService';

const PublishingPipeline = ({ content, onPublishComplete, onClose }) => {
  const [activeTab, setActiveTab] = useState('platforms');
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [publishingOptions, setPublishingOptions] = useState({
    status: 'draft',
    schedulePublish: false,
    publishDate: '',
    crossPost: true,
    generateSocialPosts: false,
    notifyFollowers: true
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingProgress, setPublishingProgress] = useState(0);
  const [publishingStage, setPublishingStage] = useState('');
  const [publishResults, setPublishResults] = useState(null);
  const [contentValidation, setContentValidation] = useState({});
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [publishingAnalytics, setPublishingAnalytics] = useState(null);

  const cmsService = new CMSIntegrationService();

  useEffect(() => {
    loadPlatforms();
    loadScheduledPosts();
    loadPublishingAnalytics();
  }, []);

  useEffect(() => {
    if (content && selectedPlatforms.length > 0) {
      validateContentForPlatforms();
    }
  }, [content, selectedPlatforms]);

  const loadPlatforms = async () => {
    try {
      const availablePlatforms = await cmsService.getAvailablePlatforms();
      setPlatforms(availablePlatforms);
      
      // Auto-select connected platforms
      const connectedPlatforms = availablePlatforms
        .filter(p => p.connected)
        .map(p => p.id);
      setSelectedPlatforms(connectedPlatforms);
    } catch (error) {
      console.error('Failed to load platforms:', error);
    }
  };

  const loadScheduledPosts = async () => {
    try {
      // Mock scheduled posts - would be real API call
      const scheduled = [
        {
          id: 'sched-1',
          title: 'SEO Best Practices 2025',
          platforms: ['wordpress', 'medium'],
          publishDate: '2025-06-15T10:00:00Z',
          status: 'scheduled'
        }
      ];
      setScheduledPosts(scheduled);
    } catch (error) {
      console.error('Failed to load scheduled posts:', error);
    }
  };

  const loadPublishingAnalytics = async () => {
    try {
      const analytics = await cmsService.getPublishingAnalytics();
      setPublishingAnalytics(analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const validateContentForPlatforms = () => {
    const validation = {};
    selectedPlatforms.forEach(platformId => {
      validation[platformId] = cmsService.validateContent(content, platformId);
    });
    setContentValidation(validation);
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform to publish to');
      return;
    }

    setIsPublishing(true);
    setPublishingProgress(0);
    setPublishingStage('Preparing content for publishing...');

    try {
      if (publishingOptions.schedulePublish) {
        // Schedule content
        setPublishingStage('Scheduling content...');
        const scheduleResult = await cmsService.scheduleContent(content, {
          publishDate: publishingOptions.publishDate,
          platforms: selectedPlatforms,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        
        setPublishResults({
          type: 'scheduled',
          result: scheduleResult,
          message: `Content scheduled for ${new Date(publishingOptions.publishDate).toLocaleString()}`
        });
      } else {
        // Immediate publishing
        setPublishingStage('Publishing to selected platforms...');
        
        const batchResult = await cmsService.batchPublish(
          selectedPlatforms,
          content,
          publishingOptions
        );
        
        setPublishResults({
          type: 'published',
          result: batchResult,
          message: `Published to ${batchResult.summary.successful}/${batchResult.summary.total} platforms`
        });
      }
      
      setPublishingProgress(100);
      setPublishingStage('Publishing completed!');
      
      if (onPublishComplete) {
        onPublishComplete(publishResults);
      }
      
      // Refresh data
      await loadScheduledPosts();
      await loadPublishingAnalytics();
      
    } catch (error) {
      console.error('Publishing failed:', error);
      setPublishResults({
        type: 'error',
        error: error.message,
        message: 'Publishing failed'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const renderPlatformSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Select Publishing Platforms</h3>
        <button
          onClick={loadPlatforms}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          const validation = contentValidation[platform.id];
          
          return (
            <div
              key={platform.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : platform.connected 
                    ? 'border-gray-200 hover:border-gray-300' 
                    : 'border-gray-100 bg-gray-50'
              }`}
              onClick={() => platform.connected && togglePlatform(platform.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{platform.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                    <div className="flex items-center text-sm">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        platform.connected ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className={platform.connected ? 'text-green-600' : 'text-gray-500'}>
                        {platform.connected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                  </div>
                </div>
                {isSelected && platform.connected && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
              
              <div className="text-xs text-gray-600 mb-2">
                Features: {platform.features.join(', ')}
              </div>
              
              {!platform.connected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Connect to ${platform.name}`);
                  }}
                  className="mt-2 w-full bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Connect {platform.name}
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedPlatforms.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm font-medium">
            Selected {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} for publishing
          </p>
        </div>
      )}
    </div>
  );

  const renderPublishingOptions = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Publishing Options</h3>
      
      {/* Publishing Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Publication Status
        </label>
        <select
          value={publishingOptions.status}
          onChange={(e) => setPublishingOptions(prev => ({ ...prev, status: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="draft">Save as Draft</option>
          <option value="published">Publish Immediately</option>
          <option value="pending">Pending Review</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* Schedule Publishing */}
      <div>
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="schedulePublish"
            checked={publishingOptions.schedulePublish}
            onChange={(e) => setPublishingOptions(prev => ({ 
              ...prev, 
              schedulePublish: e.target.checked 
            }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="schedulePublish" className="ml-2 text-sm font-medium text-gray-700">
            Schedule for later publishing
          </label>
        </div>
        
        {publishingOptions.schedulePublish && (
          <input
            type="datetime-local"
            value={publishingOptions.publishDate}
            onChange={(e) => setPublishingOptions(prev => ({ 
              ...prev, 
              publishDate: e.target.value 
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={new Date().toISOString().slice(0, 16)}
          />
        )}
      </div>
    </div>
  );

  const renderPublishingProgress = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Publishing Content</h3>
          <p className="text-gray-600 mb-4">{publishingStage}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${publishingProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{Math.round(publishingProgress)}% complete</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Publishing Pipeline</h1>
          <p className="text-gray-600">Distribute your content across multiple platforms</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('platforms')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'platforms' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Globe className="h-4 w-4 mr-2 inline" />
            Platforms
          </button>
          <button
            onClick={() => setActiveTab('options')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'options' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Settings className="h-4 w-4 mr-2 inline" />
            Options
          </button>
        </div>
      </div>

      {/* Content Preview */}
      {content && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Content Preview</h3>
          <div className="text-sm text-gray-600">
            <p><strong>Title:</strong> {content.title || 'Untitled'}</p>
            <p><strong>Word Count:</strong> {content.content ? content.content.split(' ').length : 0} words</p>
            <p><strong>Type:</strong> {content.type || 'Article'}</p>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'platforms' && renderPlatformSelection()}
        {activeTab === 'options' && renderPublishingOptions()}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePublish}
            disabled={selectedPlatforms.length === 0 || isPublishing}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
              selectedPlatforms.length === 0 || isPublishing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : publishingOptions.schedulePublish
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isPublishing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : publishingOptions.schedulePublish ? (
              <Calendar className="h-4 w-4 mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {isPublishing 
              ? 'Publishing...' 
              : publishingOptions.schedulePublish 
                ? 'Schedule Publication' 
                : 'Publish Now'
            }
          </button>
        </div>
      </div>

      {/* Publishing Progress Modal */}
      {isPublishing && renderPublishingProgress()}
    </div>
  );
};

export default PublishingPipeline;