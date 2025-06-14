import React, { useState, useEffect } from 'react';
import { 
  Search, FileText, Download, Star, Target, TrendingUp, Users, Eye, 
  BarChart3, Lightbulb, CheckCircle, Clock, AlertTriangle, RefreshCw,
  Zap, Brain, Activity, PieChart, LineChart, Calendar, Plus, Grid,
  Layers, ArrowRight, Edit3, Copy, Share2, Filter, Settings,
  Globe, Hash, Award, Database, Cpu, Gauge, ChevronRight, 
  ExternalLink, Bookmark, PlayCircle, PauseCircle, MoreHorizontal,
  Trash2, Edit2, Archive, Tag, Link, MapPin, TrendingDown,
  CalendarDays, Timer, ChevronLeft, ChevronDown, BookOpen,
  MousePointer, Heart, MessageCircle, Repeat2, ThumbsUp
} from 'lucide-react';
import { Button, Card, ProgressIndicator } from './ui/DesignSystem';
import { useAuth } from './auth/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';

const ContentClusterStrategist = () => {
  const { user } = useAuth();
  const { trackPage, trackTool, trackFeature } = useAnalytics();
  const [activeTab, setActiveTab] = useState('clusters');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('performance');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    trackPage('Content Cluster Strategist', 'content_clusters');
  }, [trackPage]);

  const tabs = [
    { id: 'clusters', name: 'Content Clusters', icon: Grid, description: 'Strategic topic clusters' },
    { id: 'articles', name: 'Single Articles', icon: FileText, description: 'Individual content pieces' },
    { id: 'analytics', name: 'Cluster Analytics', icon: BarChart3, description: 'Performance insights' },
    { id: 'calendar', name: 'Content Calendar', icon: Calendar, description: 'Publishing schedule' }
  ];

  // Enhanced content clusters data
  const contentClusters = [
    {
      id: 1,
      name: 'SEO Optimization',
      pillarTitle: 'Complete SEO Optimization Guide 2024',
      description: 'Comprehensive guide covering technical SEO, on-page optimization, and ranking strategies',
      articles: 12,
      completed: 9,
      keywords: 45,
      targetKeywords: ['SEO optimization', 'search engine optimization', 'SEO strategy'],
      difficulty: 'Medium',
      traffic: 15200,
      projectedTraffic: 25000,
      status: 'Active',
      completion: 75,
      color: 'blue',
      lastUpdated: '2024-06-12',
      performance: {
        impressions: 125000,
        clicks: 8900,
        ctr: 7.1,
        avgPosition: 3.2,
        conversions: 45
      },
      supportingArticles: [
        { title: 'Technical SEO Checklist', status: 'Published', traffic: 2100 },
        { title: 'On-Page SEO Best Practices', status: 'Published', traffic: 3200 },
        { title: 'Link Building Strategies', status: 'Draft', traffic: 0 },
        { title: 'Local SEO Guide', status: 'In Review', traffic: 0 }
      ]
    },
    {
      id: 2,
      name: 'Content Marketing',
      pillarTitle: 'Content Marketing Strategy Mastery',
      description: 'Building brand authority through strategic content creation and distribution',
      articles: 8,
      completed: 2,
      keywords: 32,
      targetKeywords: ['content marketing', 'content strategy', 'brand awareness'],
      difficulty: 'Easy',
      traffic: 8700,
      projectedTraffic: 18000,
      status: 'Planning',
      completion: 25,
      color: 'green',
      lastUpdated: '2024-06-10',
      performance: {
        impressions: 67000,
        clicks: 4200,
        ctr: 6.3,
        avgPosition: 4.8,
        conversions: 28
      },
      supportingArticles: [
        { title: 'Content Types That Convert', status: 'Published', traffic: 1800 },
        { title: 'Video Marketing Guide', status: 'Published', traffic: 2300 },
        { title: 'Social Media Content Calendar', status: 'Planning', traffic: 0 }
      ]
    },
    {
      id: 3,
      name: 'Digital Analytics',
      pillarTitle: 'Digital Analytics and Data-Driven Marketing',
      description: 'Comprehensive analytics strategy for measuring and optimizing marketing performance',
      articles: 15,
      completed: 13,
      keywords: 58,
      targetKeywords: ['digital analytics', 'google analytics', 'data-driven marketing'],
      difficulty: 'Hard',
      traffic: 22100,
      projectedTraffic: 35000,
      status: 'Active',
      completion: 90,
      color: 'purple',
      lastUpdated: '2024-06-14',
      performance: {
        impressions: 185000,
        clicks: 12500,
        ctr: 6.8,
        avgPosition: 2.9,
        conversions: 67
      },
      supportingArticles: [
        { title: 'Google Analytics 4 Setup Guide', status: 'Published', traffic: 4200 },
        { title: 'Attribution Modeling Explained', status: 'Published', traffic: 3800 },
        { title: 'Custom Dashboard Creation', status: 'Published', traffic: 2900 }
      ]
    },
    {
      id: 4,
      name: 'Lead Generation',
      pillarTitle: 'Modern Lead Generation Strategies',
      description: 'Converting visitors into qualified leads through strategic content and optimization',
      articles: 10,
      completed: 4,
      keywords: 38,
      targetKeywords: ['lead generation', 'lead magnets', 'conversion optimization'],
      difficulty: 'Medium',
      traffic: 12800,
      projectedTraffic: 28000,
      status: 'Active',
      completion: 40,
      color: 'orange',
      lastUpdated: '2024-06-11',
      performance: {
        impressions: 95000,
        clicks: 6400,
        ctr: 6.7,
        avgPosition: 3.8,
        conversions: 52
      },
      supportingArticles: [
        { title: 'High-Converting Lead Magnets', status: 'Published', traffic: 2900 },
        { title: 'Landing Page Optimization', status: 'Published', traffic: 3100 },
        { title: 'Email Capture Strategies', status: 'Draft', traffic: 0 }
      ]
    }
  ];

  // Enhanced single articles data
  const singleArticles = [
    {
      id: 1,
      title: 'Local SEO Best Practices for Small Businesses',
      status: 'Published',
      wordCount: 2400,
      seoScore: 94,
      traffic: 1200,
      publishDate: '2024-06-10',
      lastUpdated: '2024-06-12',
      keywords: ['local SEO', 'small business SEO', 'Google My Business'],
      cluster: null,
      performance: {
        impressions: 15000,
        clicks: 890,
        ctr: 5.9,
        avgPosition: 4.2,
        conversions: 12
      },
      author: 'AI Assistant',
      category: 'SEO',
      priority: 'high',
      nextReview: '2024-07-10'
    },
    {
      id: 2,
      title: 'Voice Search Optimization: The Future of SEO',
      status: 'Draft',
      wordCount: 1850,
      seoScore: 87,
      traffic: 0,
      publishDate: 'Scheduled',
      lastUpdated: '2024-06-14',
      keywords: ['voice search', 'SEO trends', 'mobile optimization'],
      cluster: 1,
      performance: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        avgPosition: 0,
        conversions: 0
      },
      author: 'AI Assistant',
      category: 'SEO',
      priority: 'medium',
      nextReview: '2024-06-20'
    },
    {
      id: 3,
      title: 'Email Marketing Automation Workflows',
      status: 'In Review',
      wordCount: 3200,
      seoScore: 91,
      traffic: 0,
      publishDate: '2024-06-18',
      lastUpdated: '2024-06-13',
      keywords: ['email marketing', 'automation', 'marketing workflows'],
      cluster: 2,
      performance: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        avgPosition: 0,
        conversions: 0
      },
      author: 'AI Assistant',
      category: 'Marketing',
      priority: 'high',
      nextReview: '2024-06-16'
    }
  ];

  // Calendar data for content calendar
  const calendarData = {
    '2024-06': {
      '15': [
        { title: 'Technical SEO Audit Guide', type: 'publish', cluster: 1, priority: 'high' },
        { title: 'Content Calendar Template', type: 'review', cluster: 2, priority: 'medium' }
      ],
      '18': [
        { title: 'Email Marketing Automation', type: 'publish', cluster: 2, priority: 'high' }
      ],
      '20': [
        { title: 'Analytics Dashboard Setup', type: 'draft', cluster: 3, priority: 'medium' },
        { title: 'Lead Scoring Models', type: 'publish', cluster: 4, priority: 'high' }
      ],
      '25': [
        { title: 'Mobile SEO Optimization', type: 'review', cluster: 1, priority: 'medium' }
      ],
      '28': [
        { title: 'Social Media Analytics', type: 'publish', cluster: 3, priority: 'low' }
      ]
    }
  };

  const generateCluster = async (clusterName) => {
    setIsGenerating(true);
    setProgress(0);
    
    const steps = [
      'Analyzing topic relevance...',
      'Researching keywords...',
      'Creating content outline...',
      'Generating pillar content...',
      'Creating supporting articles...',
      'Optimizing for SEO...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(((i + 1) / steps.length) * 100);
    }

    setIsGenerating(false);
    trackFeature('content_cluster_generated', true);
  };

  // Content Clusters Tab
  const renderContentClusters = () => (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Clusters</h2>
          <p className="text-gray-600 mt-1">Strategic topic clusters for maximum SEO impact</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Create New Cluster
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clusters</p>
              <p className="text-2xl font-bold text-gray-900">{contentClusters.length}</p>
            </div>
            <Grid className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">
                {contentClusters.reduce((sum, cluster) => sum + cluster.articles, 0)}
              </p>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Traffic</p>
              <p className="text-2xl font-bold text-gray-900">
                {(contentClusters.reduce((sum, cluster) => sum + cluster.traffic, 0) / 1000).toFixed(1)}k
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Completion</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(contentClusters.reduce((sum, cluster) => sum + cluster.completion, 0) / contentClusters.length)}%
              </p>
            </div>
            <Target className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Cluster Creation */}
      <Card className="p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <div className="text-center">
          <Lightbulb className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Cluster Generator</h3>
          <p className="text-gray-600 mb-4">Enter a topic to automatically generate a content cluster</p>
          <div className="max-w-md mx-auto flex space-x-3">
            <input
              type="text"
              placeholder="e.g., Email Marketing"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button onClick={() => generateCluster('Email Marketing')} disabled={isGenerating}>
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              Generate
            </Button>
          </div>
          {isGenerating && (
            <div className="mt-4 max-w-md mx-auto">
              <ProgressIndicator progress={progress} className="mb-2" />
              <p className="text-sm text-gray-600">Creating your content cluster...</p>
            </div>
          )}
        </div>
      </Card>

      {/* Cluster Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contentClusters.map((cluster) => (
          <Card key={cluster.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedCluster(cluster)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-${cluster.color}-500`}></div>
                  <h3 className="text-lg font-semibold text-gray-900">{cluster.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    cluster.status === 'Active' ? 'bg-green-100 text-green-800' :
                    cluster.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {cluster.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{cluster.description}</p>
                <h4 className="font-medium text-gray-900 mb-2">Pillar: {cluster.pillarTitle}</h4>
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{cluster.completion}%</span>
              </div>
              <ProgressIndicator progress={cluster.completion} />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{cluster.completed}/{cluster.articles}</div>
                <div className="text-xs text-gray-600">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{cluster.keywords}</div>
                <div className="text-xs text-gray-600">Keywords</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{(cluster.traffic / 1000).toFixed(1)}k</div>
                <div className="text-xs text-gray-600">Traffic</div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">CTR: {cluster.performance.ctr}%</span>
                <span className="text-gray-600">Pos: {cluster.performance.avgPosition}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>

            {/* Target Keywords Preview */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {cluster.targetKeywords.slice(0, 3).map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {keyword}
                  </span>
                ))}
                {cluster.targetKeywords.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{cluster.targetKeywords.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Cluster Detail Modal */}
      {selectedCluster && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCluster.name}</h2>
                  <p className="text-gray-600">{selectedCluster.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedCluster(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Cluster Performance */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{selectedCluster.performance.impressions.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Impressions</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{selectedCluster.performance.clicks.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Clicks</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{selectedCluster.performance.ctr}%</div>
                  <div className="text-xs text-gray-600">CTR</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{selectedCluster.performance.avgPosition}</div>
                  <div className="text-xs text-gray-600">Avg Position</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{selectedCluster.performance.conversions}</div>
                  <div className="text-xs text-gray-600">Conversions</div>
                </div>
              </div>

              {/* Supporting Articles */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Articles</h3>
                <div className="space-y-3">
                  {selectedCluster.supportingArticles.map((article, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900">{article.title}</div>
                          <div className="text-sm text-gray-600">
                            {article.traffic > 0 ? `${article.traffic.toLocaleString()} monthly visitors` : 'Not published'}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        article.status === 'Published' ? 'bg-green-100 text-green-800' :
                        article.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                        article.status === 'In Review' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Cluster
                </Button>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Article
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
  // Single Articles Tab
  const renderSingleArticles = () => (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Single Articles</h2>
          <p className="text-gray-600 mt-1">Individual content pieces outside of clusters</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="performance">Performance</option>
              <option value="date">Date</option>
              <option value="traffic">Traffic</option>
              <option value="seo-score">SEO Score</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Status:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
            </select>
          </div>
          <Button className="bg-gradient-to-r from-green-600 to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{singleArticles.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {singleArticles.filter(a => a.status === 'Published').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg SEO Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(singleArticles.reduce((sum, a) => sum + a.seoScore, 0) / singleArticles.length)}
              </p>
            </div>
            <Award className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Traffic</p>
              <p className="text-2xl font-bold text-gray-900">
                {singleArticles.reduce((sum, a) => sum + a.traffic, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Article Creation Prompt */}
      <Card className="p-6 border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors">
        <div className="text-center">
          <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Individual Article</h3>
          <p className="text-gray-600 mb-4">Generate optimized articles outside of content clusters</p>
          <div className="max-w-md mx-auto flex space-x-3">
            <input
              type="text"
              placeholder="e.g., How to improve website speed"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <Button className="bg-gradient-to-r from-green-600 to-blue-600">
              <Brain className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </div>
      </Card>

      {/* Articles List */}
      <div className="space-y-4">
        {singleArticles.map((article) => (
          <Card key={article.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedArticle(article)}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    article.status === 'Published' ? 'bg-green-100 text-green-800' :
                    article.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                    article.status === 'In Review' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {article.status}
                  </span>
                  {article.cluster && (
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                      Cluster {article.cluster}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                  <span>{article.wordCount.toLocaleString()} words</span>
                  <span className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>SEO: {article.seoScore}/100</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{article.traffic.toLocaleString()}/month</span>
                  </span>
                  <span>Updated: {new Date(article.lastUpdated).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {article.keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {keyword}
                    </span>
                  ))}
                </div>

                {article.status === 'Published' && (
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Impressions:</span>
                      <span className="ml-1 font-medium">{article.performance.impressions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Clicks:</span>
                      <span className="ml-1 font-medium">{article.performance.clicks.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">CTR:</span>
                      <span className="ml-1 font-medium">{article.performance.ctr}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Position:</span>
                      <span className="ml-1 font-medium">{article.performance.avgPosition}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Cluster Analytics Tab
  const renderClusterAnalytics = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cluster Analytics</h2>
          <p className="text-gray-600 mt-1">Performance insights and optimization opportunities</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Traffic</h3>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {(contentClusters.reduce((sum, cluster) => sum + cluster.traffic, 0) / 1000).toFixed(1)}k
          </div>
          <div className="text-sm text-green-600">↗ +12.5% vs last month</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Avg CTR</h3>
            <MousePointer className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">6.7%</div>
          <div className="text-sm text-green-600">↗ +0.8% vs last month</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Conversions</h3>
            <Target className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">192</div>
          <div className="text-sm text-green-600">↗ +23% vs last month</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Avg Position</h3>
            <Award className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">3.7</div>
          <div className="text-sm text-red-600">↘ -0.2 vs last month</div>
        </Card>
      </div>

      {/* Cluster Performance Comparison */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cluster Performance Comparison</h3>
        <div className="space-y-4">
          {contentClusters.map((cluster) => (
            <div key={cluster.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full bg-${cluster.color}-500`}></div>
                <div>
                  <div className="font-medium text-gray-900">{cluster.name}</div>
                  <div className="text-sm text-gray-600">{cluster.articles} articles • {cluster.keywords} keywords</div>
                </div>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900">{(cluster.traffic / 1000).toFixed(1)}k</div>
                  <div className="text-gray-600">Traffic</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{cluster.performance.ctr}%</div>
                  <div className="text-gray-600">CTR</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{cluster.performance.avgPosition}</div>
                  <div className="text-gray-600">Position</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{cluster.performance.conversions}</div>
                  <div className="text-gray-600">Conversions</div>
                </div>
                <div className="w-24">
                  <ProgressIndicator progress={cluster.completion} />
                  <div className="text-xs text-gray-600 mt-1">{cluster.completion}% complete</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Performing Articles */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Articles</h3>
        <div className="space-y-3">
          {[
            { title: 'Complete SEO Optimization Guide 2024', traffic: 4200, cluster: 'SEO Optimization', ctr: 8.2 },
            { title: 'Digital Analytics Dashboard Setup', traffic: 3800, cluster: 'Digital Analytics', ctr: 7.1 },
            { title: 'Lead Generation Landing Pages', traffic: 3100, cluster: 'Lead Generation', ctr: 6.9 },
            { title: 'Content Marketing ROI Tracking', traffic: 2900, cluster: 'Content Marketing', ctr: 6.4 },
            { title: 'Technical SEO Audit Checklist', traffic: 2600, cluster: 'SEO Optimization', ctr: 6.2 }
          ].map((article, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-lg font-semibold text-gray-600">#{index + 1}</div>
                <div>
                  <div className="font-medium text-gray-900">{article.title}</div>
                  <div className="text-sm text-gray-600">{article.cluster}</div>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900">{article.traffic.toLocaleString()}</div>
                  <div className="text-gray-600">Monthly Traffic</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{article.ctr}%</div>
                  <div className="text-gray-600">CTR</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Optimization Opportunities */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Opportunities</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Low CTR in Content Marketing Cluster</div>
              <div className="text-sm text-gray-600 mt-1">
                Average CTR of 6.3% is below industry standard. Consider optimizing meta descriptions and titles.
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                View Recommendations
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Missing Internal Links</div>
              <div className="text-sm text-gray-600 mt-1">
                37 opportunities to add internal links between cluster articles for better topic authority.
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Auto-Generate Links
              </Button>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Expand High-Performing Cluster</div>
              <div className="text-sm text-gray-600 mt-1">
                Digital Analytics cluster shows strong performance. Consider adding 5-8 more supporting articles.
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Generate Articles
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  // Content Calendar Tab
  const renderContentCalendar = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Calendar</h2>
          <p className="text-gray-600 mt-1">Strategic content scheduling and publishing workflow</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Calendar Settings
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Content
          </Button>
        </div>
      </div>

      {/* Calendar Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 text-center">
          <CalendarDays className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">12</div>
          <div className="text-sm text-gray-600">Scheduled This Month</div>
        </Card>

        <Card className="p-6 text-center">
          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">3</div>
          <div className="text-sm text-gray-600">Publishing This Week</div>
        </Card>

        <Card className="p-6 text-center">
          <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">7</div>
          <div className="text-sm text-gray-600">In Review</div>
        </Card>

        <Card className="p-6 text-center">
          <Timer className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">5</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </Card>
      </div>

      {/* Content Performance Forecast */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance Forecast</h3>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">+45%</div>
              <div className="text-sm text-gray-600">Projected Traffic Increase</div>
              <div className="text-xs text-gray-500 mt-1">Next 3 months</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">12k</div>
              <div className="text-sm text-gray-600">Additional Monthly Visitors</div>
              <div className="text-xs text-gray-500 mt-1">From scheduled content</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">85</div>
              <div className="text-sm text-gray-600">Expected Conversions</div>
              <div className="text-xs text-gray-500 mt-1">From new articles</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎯 Content Cluster Strategist
        </h1>
        <p className="text-lg text-gray-600">
          Build topical authority with AI-powered content clusters
        </p>
      </div>

      {/* Website Optimization Banner */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Globe className="w-4 h-4 text-blue-600" />
          <span className="text-gray-700">
            Optimizing for: <a href="https://infinitebuildsolutions.co.nz" className="text-blue-600 hover:underline font-medium">https://infinitebuildsolutions.co.nz</a>
          </span>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
                {tab.id === 'articles' && (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    Live
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'clusters' && renderContentClusters()}
        {activeTab === 'articles' && renderSingleArticles()}
        {activeTab === 'analytics' && renderClusterAnalytics()}
        {activeTab === 'calendar' && renderContentCalendar()}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>By {selectedArticle.author}</span>
                    <span>•</span>
                    <span>{selectedArticle.wordCount.toLocaleString()} words</span>
                    <span>•</span>
                    <span>Updated {new Date(selectedArticle.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Article Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{selectedArticle.seoScore}</div>
                  <div className="text-xs text-gray-600">SEO Score</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{selectedArticle.traffic.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Monthly Traffic</div>
                </div>
                {selectedArticle.status === 'Published' && (
                  <>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{selectedArticle.performance.impressions.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Impressions</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{selectedArticle.performance.ctr}%</div>
                      <div className="text-xs text-gray-600">CTR</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{selectedArticle.performance.conversions}</div>
                      <div className="text-xs text-gray-600">Conversions</div>
                    </div>
                  </>
                )}
              </div>

              {/* Keywords */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Article
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live
                </Button>
                <Button variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                {selectedArticle.cluster && (
                  <Button variant="outline">
                    <Link className="w-4 h-4 mr-2" />
                    View Cluster
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Content Cluster</h3>
              <p className="text-gray-600 mb-4">AI is creating your strategic content cluster...</p>
              <ProgressIndicator progress={progress} className="mb-2" />
              <div className="text-sm text-gray-600">{Math.round(progress)}% complete</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentClusterStrategist;
