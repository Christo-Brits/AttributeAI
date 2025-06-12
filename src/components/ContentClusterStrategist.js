import React, { useState, useEffect, useRef } from 'react';
import { 
  PenTool, FileText, Target, CheckCircle, Clock, Search, Zap, 
  Brain, TrendingUp, Users, Globe, Sparkles, Video, Layers,
  Link, BarChart3, Map, GitBranch, Workflow, Key, AlertCircle
} from 'lucide-react';
import EnhancedContentService from '../services/EnhancedContentService';
import KeywordResearchEngine from '../services/KeywordResearchEngine';
import ContentPolishModal from './ContentPolishModal';
import VideoGenerationModal from './VideoGenerationModal';

const ContentClusterStrategist = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('cluster-planning'); // New default tab
  const [contentClusters, setContentClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  
  // Keyword Research State
  const [keywordResearch, setKeywordResearch] = useState(null);
  const [isResearching, setIsResearching] = useState(false);
  const [researchStage, setResearchStage] = useState('');
  const [keywordClusters, setKeywordClusters] = useState([]);
  
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
  const keywordResearchEngine = new KeywordResearchEngine();

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

  const performKeywordResearch = async () => {
    if (!clusterTopic.trim()) {
      alert('Please enter a cluster topic for keyword research');
      return;
    }

    setIsResearching(true);
    setResearchStage('Starting keyword research...');

    try {
      const stages = [
        'Analyzing seed keyword...',
        'Generating keyword variations...',
        'Calculating search volumes...',
        'Assessing keyword difficulty...',
        'Determining search intent...',
        'Clustering related keywords...',
        'Identifying opportunities...',
        'Finalizing research...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setResearchStage(stages[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Perform actual keyword research
      const researchOptions = {
        maxKeywords: clusterSize === 'small' ? 25 : clusterSize === 'medium' ? 50 : 100,
        includeQuestions: true,
        includeRelated: true,
        minSearchVolume: 10
      };

      const researchResults = await keywordResearchEngine.performKeywordResearch(
        clusterTopic, 
        researchOptions
      );

      setKeywordResearch(researchResults);

      // Perform keyword clustering
      if (researchResults.success && researchResults.keywords.length > 0) {
        setResearchStage('Clustering keywords...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const clusteringResults = await keywordResearchEngine.clusterKeywords(
          researchResults.keywords,
          {
            maxClusters: clusterSize === 'small' ? 3 : clusterSize === 'medium' ? 5 : 8,
            minClusterSize: 3,
            similarity: 0.6
          }
        );

        setKeywordClusters(clusteringResults.clusters || []);
      }

      setResearchStage('Keyword research completed!');
      setTimeout(() => {
        setIsResearching(false);
        setResearchStage('');
      }, 2000);

    } catch (error) {
      console.error('Error performing keyword research:', error);
      setResearchStage('Error during keyword research. Please try again.');
      setTimeout(() => {
        setIsResearching(false);
        setResearchStage('');
      }, 3000);
    }
  };

  const generateContentCluster = async () => {
    if (!clusterTopic.trim()) {
      alert('Please enter a cluster topic');
      return;
    }

    // Check if we have keyword research data
    if (!keywordResearch || !keywordResearch.success) {
      alert('Please perform keyword research first');
      return;
    }

    setIsGenerating(true);
    setGenerationStage('Planning content cluster...');

    try {
      // Enhanced cluster generation process using keyword research
      const stages = [
        'Analyzing keyword clusters...',
        'Planning article structure...',
        'Creating pillar content outline...',
        'Generating supporting articles...',
        'Setting up internal linking strategy...',
        'Optimizing for search intent...',
        'Finalizing cluster...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setGenerationStage(stages[i]);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Create enhanced cluster data using keyword research
      const newCluster = {
        id: Date.now(),
        topic: clusterTopic,
        size: clusterSize,
        audience: targetAudience,
        type: contentType,
        status: 'generated',
        articles: generateEnhancedClusterArticles(),
        createdAt: new Date().toISOString(),
        keywords: keywordResearch.keywords,
        keywordClusters: keywordClusters,
        pillarArticle: null, // Will be set to main article ID
        totalSearchVolume: keywordResearch.keywords.reduce((sum, kw) => sum + kw.searchVolume, 0),
        avgDifficulty: Math.round(keywordResearch.keywords.reduce((sum, kw) => sum + kw.difficulty, 0) / keywordResearch.keywords.length),
        opportunities: this.extractUniqueOpportunities(keywordResearch.keywords)
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

  const generateEnhancedClusterArticles = () => {
    const sizes = { small: 5, medium: 10, large: 30 };
    const articleCount = sizes[clusterSize];
    const articles = [];

    // Use keyword clusters to generate targeted articles
    if (keywordClusters.length > 0) {
      keywordClusters.forEach((cluster, index) => {
        if (index < articleCount) {
          articles.push({
            id: `article-${Date.now()}-${index}`,
            title: cluster.primaryKeyword.keyword,
            type: index === 0 ? 'pillar' : 'supporting',
            status: 'planned',
            wordCount: index === 0 ? 3000 : 1500,
            keywords: cluster.keywords.map(kw => kw.keyword),
            targetKeyword: cluster.primaryKeyword.keyword,
            searchVolume: cluster.totalVolume,
            difficulty: cluster.avgDifficulty,
            intent: cluster.intent,
            opportunities: cluster.opportunities,
            internalLinks: [],
            externalLinks: []
          });
        }
      });
    }

    // Fill remaining slots with top keywords if needed
    const remainingSlots = articleCount - articles.length;
    if (remainingSlots > 0 && keywordResearch?.keywords) {
      const topKeywords = keywordResearch.keywords
        .filter(kw => !articles.some(article => article.targetKeyword === kw.keyword))
        .slice(0, remainingSlots);

      topKeywords.forEach((keyword, index) => {
        articles.push({
          id: `article-${Date.now()}-${articles.length + index}`,
          title: keyword.keyword,
          type: 'supporting',
          status: 'planned',
          wordCount: 1500,
          keywords: [keyword.keyword],
          targetKeyword: keyword.keyword,
          searchVolume: keyword.searchVolume,
          difficulty: keyword.difficulty,
          intent: keyword.intent,
          opportunities: keyword.opportunities,
          internalLinks: [],
          externalLinks: []
        });
      });
    }

    return articles;
  };

  const extractUniqueOpportunities = (keywords) => {
    const allOpportunities = keywords.flatMap(kw => kw.opportunities);
    return [...new Set(allOpportunities)];
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

        <div className="mt-6 space-y-4">
          {/* Keyword Research Button */}
          <div className="flex space-x-4">
            <button
              onClick={performKeywordResearch}
              disabled={isResearching || !clusterTopic.trim()}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isResearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Researching Keywords...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Research Keywords
                </>
              )}
            </button>

            <button
              onClick={generateContentCluster}
              disabled={isGenerating || !keywordResearch?.success}
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
          </div>
          
          {/* Status Messages */}
          {researchStage && (
            <p className="text-sm text-purple-600 flex items-center">
              <Search className="h-4 w-4 mr-2" />
              {researchStage}
            </p>
          )}
          
          {generationStage && (
            <p className="text-sm text-blue-600 flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              {generationStage}
            </p>
          )}

          {/* Keyword Research Results */}
          {keywordResearch?.success && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-green-600" />
                Keyword Research Results
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Total Keywords:</span>
                  <p className="font-medium">{keywordResearch.keywords.length}</p>
                </div>
                <div>
                  <span className="text-gray-500">Keyword Clusters:</span>
                  <p className="font-medium">{keywordClusters.length}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Volume:</span>
                  <p className="font-medium">
                    {keywordResearch.keywords.reduce((sum, kw) => sum + kw.searchVolume, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Avg Difficulty:</span>
                  <p className="font-medium">
                    {Math.round(keywordResearch.keywords.reduce((sum, kw) => sum + kw.difficulty, 0) / keywordResearch.keywords.length)}%
                  </p>
                </div>
              </div>

              {/* Top Keywords Preview */}
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Top Keywords:</h5>
                <div className="flex flex-wrap gap-2">
                  {keywordResearch.keywords.slice(0, 8).map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {keyword.keyword}
                      <span className="ml-1 text-blue-600">({keyword.searchVolume})</span>
                    </span>
                  ))}
                  {keywordResearch.keywords.length > 8 && (
                    <span className="text-xs text-gray-500">+{keywordResearch.keywords.length - 8} more</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {!keywordResearch && !isResearching && clusterTopic && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Keyword Research Required</p>
                <p className="text-sm text-yellow-700">Perform keyword research first to generate data-driven content clusters.</p>
              </div>
            </div>
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