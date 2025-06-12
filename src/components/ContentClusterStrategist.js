import React, { useState, useEffect, useRef } from 'react';
import { 
  PenTool, FileText, Target, CheckCircle, Clock, Search, Zap, 
  Brain, TrendingUp, Users, Globe, Sparkles, Video, Layers,
  Link, BarChart3, Map, GitBranch, Workflow
} from 'lucide-react';
import EnhancedContentService from '../services/EnhancedContentService';
import ContentPolishModal from './ContentPolishModal';
import VideoGenerationModal from './VideoGenerationModal';

const ContentClusterStrategist = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('cluster-planning'); // New default tab
  const [contentClusters, setContentClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  
  // Cluster Creation State
  const [clusterTopic, setClusterTopic] = useState('');
  const [clusterSize, setClusterSize] = useState('medium'); // small (5), medium (10), large (30)
  const [targetAudience, setTargetAudience] = useState('');
  const [contentType, setContentType] = useState('informational');
  
  // Single Article State (for backward compatibility)
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [contentResults, setContentResults] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportSuccess, setExportSuccess] = useState('');
  const [showPolishModal, setShowPolishModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  const exportMenuRef = useRef(null);
  const enhancedContentService = new EnhancedContentService();

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = () => {
      try {
        const storedUser = localStorage.getItem('attributeai_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserProfile(userData);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tabs = [
    { id: 'cluster-planning', name: 'Content Clusters', icon: Layers, description: 'Build topical authority with content clusters' },
    { id: 'single-article', name: 'Single Articles', icon: FileText, description: 'Create individual optimized articles' },
    { id: 'cluster-analytics', name: 'Cluster Analytics', icon: BarChart3, description: 'Track cluster performance' },
    { id: 'content-calendar', name: 'Content Calendar', icon: Map, description: 'Plan and schedule content' }
  ];

  const clusterSizes = [
    { id: 'small', name: 'Small Cluster', articles: 5, description: 'Perfect for niche topics or testing' },
    { id: 'medium', name: 'Medium Cluster', articles: 10, description: 'Balanced approach for most topics' },
    { id: 'large', name: 'Large Cluster', articles: 30, description: 'Comprehensive topical authority' }
  ];

  const generateContentCluster = async () => {
    if (!clusterTopic.trim()) {
      alert('Please enter a cluster topic');
      return;
    }

    setIsGenerating(true);
    setGenerationStage('Planning content cluster...');

    try {
      // Simulate cluster generation process (to be implemented with real AI)
      const stages = [
        'Analyzing topic and competition...',
        'Performing keyword research...',
        'Clustering related keywords...',
        'Planning article structure...',
        'Creating pillar content...',
        'Generating supporting articles...',
        'Setting up internal linking...',
        'Finalizing cluster...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setGenerationStage(stages[i]);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Create mock cluster data (to be replaced with real generation)
      const newCluster = {
        id: Date.now(),
        topic: clusterTopic,
        size: clusterSize,
        audience: targetAudience,
        type: contentType,
        status: 'generated',
        articles: generateMockClusterArticles(),
        createdAt: new Date().toISOString(),
        keywords: generateMockKeywords(),
        pillarArticle: null // Will be set to main article ID
      };

      setContentClusters(prev => [...prev, newCluster]);
      setSelectedCluster(newCluster);
      setGenerationStage('Content cluster generated successfully!');
      
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStage('');
      }, 2000);

    } catch (error) {
      console.error('Error generating content cluster:', error);
      setGenerationStage('Error generating cluster. Please try again.');
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStage('');
      }, 3000);
    }
  };

  const generateMockClusterArticles = () => {
    const sizes = { small: 5, medium: 10, large: 30 };
    const articleCount = sizes[clusterSize];
    const articles = [];

    for (let i = 0; i < articleCount; i++) {
      articles.push({
        id: `article-${Date.now()}-${i}`,
        title: `${clusterTopic} - Article ${i + 1}`,
        type: i === 0 ? 'pillar' : 'supporting',
        status: 'planned',
        wordCount: i === 0 ? 3000 : 1500,
        keywords: [`keyword-${i + 1}`, `keyword-${i + 2}`],
        internalLinks: [],
        externalLinks: []
      });
    }

    return articles;
  };

  const generateMockKeywords = () => {
    return [
      { keyword: clusterTopic, volume: 5000, difficulty: 65, intent: 'informational' },
      { keyword: `${clusterTopic} guide`, volume: 2000, difficulty: 45, intent: 'informational' },
      { keyword: `${clusterTopic} tips`, volume: 1500, difficulty: 40, intent: 'informational' },
      { keyword: `best ${clusterTopic}`, volume: 3000, difficulty: 60, intent: 'commercial' },
      { keyword: `${clusterTopic} strategy`, volume: 1000, difficulty: 50, intent: 'informational' }
    ];
  };

  const renderClusterPlanningTab = () => (
    <div className="space-y-6">
      {/* Cluster Creation Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Layers className="h-5 w-5 mr-2 text-blue-600" />
          Create Content Cluster
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cluster Topic
            </label>
            <input
              type="text"
              value={clusterTopic}
              onChange={(e) => setClusterTopic(e.target.value)}
              placeholder="e.g., Digital Marketing for SaaS"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., SaaS marketers, small business owners"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="informational">Informational</option>
              <option value="commercial">Commercial</option>
              <option value="transactional">Transactional</option>
              <option value="mixed">Mixed Intent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cluster Size
            </label>
            <select
              value={clusterSize}
              onChange={(e) => setClusterSize(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {clusterSizes.map(size => (
                <option key={size.id} value={size.id}>
                  {size.name} ({size.articles} articles)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={generateContentCluster}
            disabled={isGenerating || !clusterTopic.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Cluster...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content Cluster
              </>
            )}
          </button>
          
          {generationStage && (
            <p className="mt-2 text-sm text-blue-600">{generationStage}</p>
          )}
        </div>
      </div>

      {/* Existing Clusters */}
      {contentClusters.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GitBranch className="h-5 w-5 mr-2 text-green-600" />
            Your Content Clusters
          </h3>
          
          <div className="grid gap-4">
            {contentClusters.map(cluster => (
              <div
                key={cluster.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                onClick={() => setSelectedCluster(cluster)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{cluster.topic}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {cluster.articles.length} articles • {cluster.type} content
                    </p>
                    <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                      <span>Created: {new Date(cluster.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                        {cluster.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {cluster.size} cluster
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cluster Details */}
      {selectedCluster && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Workflow className="h-5 w-5 mr-2 text-purple-600" />
            Cluster: {selectedCluster.topic}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Articles ({selectedCluster.articles.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedCluster.articles.map(article => (
                  <div key={article.id} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{article.title}</span>
                      <div className="text-xs text-gray-500">
                        {article.type === 'pillar' ? '📄 Pillar' : '📋 Supporting'} • {article.wordCount} words
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      article.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                      article.status === 'generated' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Target Keywords</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedCluster.keywords.map((kw, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                    <span className="text-sm text-gray-900">{kw.keyword}</span>
                    <div className="text-xs text-gray-500">
                      Vol: {kw.volume} • Diff: {kw.difficulty}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSingleArticleTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FileText className="h-5 w-5 mr-2 text-blue-600" />
        Single Article Generation
      </h3>
      <p className="text-gray-600 mb-4">
        Create individual optimized articles outside of content clusters.
      </p>
      
      {/* Existing single article functionality would go here */}
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Single article generation coming soon...</p>
        <p className="text-sm mt-2">Focus on content clusters for maximum SEO impact!</p>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
        Cluster Performance Analytics
      </h3>
      <p className="text-gray-600 mb-4">
        Track how your content clusters are performing in search results.
      </p>
      
      <div className="text-center py-8 text-gray-500">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Cluster analytics coming soon...</p>
        <p className="text-sm mt-2">Create your first cluster to see performance data!</p>
      </div>
    </div>
  );

  const renderContentCalendarTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Map className="h-5 w-5 mr-2 text-purple-600" />
        Content Calendar
      </h3>
      <p className="text-gray-600 mb-4">
        Plan and schedule your content cluster publication timeline.
      </p>
      
      <div className="text-center py-8 text-gray-500">
        <Map className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Content calendar coming soon...</p>
        <p className="text-sm mt-2">Schedule your cluster articles for optimal impact!</p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Cluster Strategist</h1>
          <p className="text-lg text-gray-600">
            Build topical authority with AI-powered content clusters
          </p>
          {userProfile?.websiteUrl && (
            <p className="text-sm text-blue-600 mt-2">
              Optimizing for: {userProfile.websiteUrl}
            </p>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-screen">
          {activeTab === 'cluster-planning' && renderClusterPlanningTab()}
          {activeTab === 'single-article' && renderSingleArticleTab()}
          {activeTab === 'cluster-analytics' && renderAnalyticsTab()}
          {activeTab === 'content-calendar' && renderContentCalendarTab()}
        </div>
      </div>

      {/* Modals */}
      {showPolishModal && (
        <ContentPolishModal 
          onClose={() => setShowPolishModal(false)}
          content={contentResults}
        />
      )}

      {showVideoModal && (
        <VideoGenerationModal 
          onClose={() => setShowVideoModal(false)}
          topic={selectedTopic || customTopic}
        />
      )}
    </div>
  );
};

export default ContentClusterStrategist;