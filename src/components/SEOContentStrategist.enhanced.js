import React, { useState, useEffect } from 'react';
import { 
  Search, FileText, Download, Star, Target, TrendingUp, Users, Eye, 
  BarChart3, Lightbulb, CheckCircle, Clock, AlertTriangle, RefreshCw,
  Zap, Brain, Activity, PieChart, LineChart, Calendar, Plus, Grid,
  Layers, ArrowRight, Edit3, Copy, Share2, Filter, Settings,
  Globe, Hash, Award, Database, Cpu, Gauge, CalendarDays, Timer,
  ChevronLeft, ChevronRight, Edit2
} from 'lucide-react';
import { Button, Card, ProgressIndicator } from './ui/DesignSystem';
import { useAuth } from './auth/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';

const SEOContentStrategist = () => {
  const { user } = useAuth();
  const { trackPage, trackTool, trackFeature } = useAnalytics();
  const [activeTab, setActiveTab] = useState('clusters');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    trackPage('SEO Content Strategist', 'content_strategy');
  }, [trackPage]);

  const tabs = [
    { id: 'clusters', name: 'Content Clusters', icon: Grid, description: 'Strategic topic clusters' },
    { id: 'articles', name: 'Single Articles', icon: FileText, description: 'Individual content pieces' },
    { id: 'analytics', name: 'Cluster Analytics', icon: BarChart3, description: 'Performance insights' },
    { id: 'calendar', name: 'Content Calendar', icon: Calendar, description: 'Publishing schedule' }
  ];

  // Sample data for content clusters
  const contentClusters = [
    {
      id: 1,
      name: 'SEO Optimization',
      pillarTitle: 'Complete SEO Optimization Guide 2024',
      articles: 12,
      keywords: 45,
      difficulty: 'Medium',
      traffic: '15.2k',
      status: 'Active',
      completion: 75,
      color: 'blue'
    },
    {
      id: 2,
      name: 'Content Marketing',
      pillarTitle: 'Content Marketing Strategy Mastery',
      articles: 8,
      keywords: 32,
      difficulty: 'Easy',
      traffic: '8.7k',
      status: 'Planning',
      completion: 25,
      color: 'green'
    },
    {
      id: 3,
      name: 'Digital Analytics',
      pillarTitle: 'Digital Analytics and Data-Driven Marketing',
      articles: 15,
      keywords: 58,
      difficulty: 'Hard',
      traffic: '22.1k',
      status: 'Active',
      completion: 90,
      color: 'purple'
    }
  ];

  // Sample data for single articles
  const singleArticles = [
    {
      id: 1,
      title: 'Local SEO Best Practices for Small Businesses',
      status: 'Published',
      wordCount: 2400,
      seoScore: 94,
      traffic: '1.2k',
      publishDate: '2024-06-10',
      keywords: ['local SEO', 'small business SEO', 'Google My Business']
    },
    {
      id: 2,
      title: 'Voice Search Optimization: The Future of SEO',
      status: 'Draft',
      wordCount: 1850,
      seoScore: 87,
      traffic: '0',
      publishDate: 'Scheduled',
      keywords: ['voice search', 'SEO trends', 'mobile optimization']
    }
  ];

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

  const renderContentClusters = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Clusters</h2>
          <p className="text-gray-400 mt-1">Strategic topic clusters for maximum SEO impact</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Create New Cluster
        </Button>
      </div>

      {/* Cluster Creation */}
      <Card className="p-6 border-2 border-dashed border-gray-600 hover:border-blue-400 transition-colors">
        <div className="text-center">
          <Lightbulb className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Quick Cluster Generator</h3>
          <p className="text-gray-400 mb-4">Enter a topic to automatically generate a content cluster</p>
          <div className="max-w-md mx-auto flex space-x-3">
            <input
              type="text"
              placeholder="e.g., Email Marketing"
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button onClick={() => generateCluster('Email Marketing')}>
              <Brain className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>
      </Card>

      {/* Generation Progress */}
      {isGenerating && (
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Generating Content Cluster...</h3>
            <ProgressIndicator progress={progress} />
            <p className="text-sm text-gray-400 mt-2">AI analyzing topic and creating strategic content plan</p>
          </div>
        </Card>
      )}

      {/* Existing Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contentClusters.map((cluster) => (
          <Card key={cluster.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-${cluster.color}-500`}></div>
                  <span className={`text-xs px-2 py-1 rounded-full bg-${cluster.color}-100 text-${cluster.color}-800`}>
                    {cluster.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{cluster.name}</h3>
                <p className="text-sm text-gray-400">{cluster.pillarTitle}</p>
              </div>
              <button className="text-gray-500 hover:text-gray-300">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">{cluster.articles}</div>
                <div className="text-xs text-gray-400">Articles</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{cluster.keywords}</div>
                <div className="text-xs text-gray-400">Keywords</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{cluster.traffic}</div>
                <div className="text-xs text-gray-400">Monthly Traffic</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Completion</span>
                <span className="font-medium text-white">{cluster.completion}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className={`bg-${cluster.color}-500 h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${cluster.completion}%` }}
                ></div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="outline">
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSingleArticles = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Single Articles</h2>
          <p className="text-gray-400 mt-1">Create individual optimized articles outside of content clusters</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Quick Article Generator */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
          <Zap className="w-5 h-5 mr-2 text-green-400" />
          Quick Article Generator
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Article Topic</label>
            <input
              type="text"
              placeholder="e.g., Instagram Marketing for Beginners"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Target Keyword</label>
            <input
              type="text"
              placeholder="e.g., instagram marketing"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
            <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500">
              <option>How-to Guide</option>
              <option>List Article</option>
              <option>Ultimate Guide</option>
              <option>Case Study</option>
              <option>Comparison</option>
            </select>
          </div>
        </div>
        <Button className="w-full">
          <Brain className="w-4 h-4 mr-2" />
          Generate Article Outline
        </Button>
      </Card>

      {/* Articles List */}
      <div className="space-y-4">
        {singleArticles.map((article) => (
          <Card key={article.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    article.status === 'Published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status}
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <span>{article.wordCount} words</span>
                  <span>SEO Score: {article.seoScore}/100</span>
                  <span>Traffic: {article.traffic}</span>
                  <span>Published: {article.publishDate}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {article.keywords.map((keyword, index) => (
                    <span key={index} className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderClusterAnalytics = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Cluster Analytics</h2>
        <p className="text-gray-400 mt-1">Performance insights and optimization recommendations</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">45.7k</div>
          <div className="text-sm text-gray-400">Total Organic Traffic</div>
          <div className="text-xs text-green-400 mt-1">↗ +23% this month</div>
        </Card>

        <Card className="p-6 text-center">
          <Hash className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">247</div>
          <div className="text-sm text-gray-400">Ranking Keywords</div>
          <div className="text-xs text-green-400 mt-1">↗ +18 new rankings</div>
        </Card>

        <Card className="p-6 text-center">
          <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">68</div>
          <div className="text-sm text-gray-400">Top 10 Rankings</div>
          <div className="text-xs text-green-400 mt-1">↗ +12 improved</div>
        </Card>

        <Card className="p-6 text-center">
          <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">94.2</div>
          <div className="text-sm text-gray-400">Avg SEO Score</div>
          <div className="text-xs text-green-400 mt-1">↗ +5.3 points</div>
        </Card>
      </div>

      {/* Cluster Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
          Cluster Performance Comparison
        </h3>
        <div className="space-y-4">
          {contentClusters.map((cluster) => (
            <div key={cluster.id} className="border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{cluster.name}</h4>
                <span className="text-sm text-gray-600">{cluster.traffic} monthly traffic</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Articles: </span>
                  <span className="font-medium">{cluster.articles}</span>
                </div>
                <div>
                  <span className="text-gray-600">Keywords: </span>
                  <span className="font-medium">{cluster.keywords}</span>
                </div>
                <div>
                  <span className="text-gray-600">Difficulty: </span>
                  <span className={`font-medium ${
                    cluster.difficulty === 'Easy' ? 'text-green-600' :
                    cluster.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {cluster.difficulty}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Performance Score</span>
                  <span className="font-medium">{cluster.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${cluster.completion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Optimization Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
          AI-Powered Optimization Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">High Priority:</span>
              <span className="text-gray-700 ml-2">Add 3-4 supporting articles to the "SEO Optimization" cluster to improve topical authority</span>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Opportunity:</span>
              <span className="text-gray-700 ml-2">Target "voice search optimization" in Content Marketing cluster for 2.3k monthly searches</span>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Optimization:</span>
              <span className="text-gray-700 ml-2">Update internal linking structure in Digital Analytics cluster to boost ranking potential</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderContentCalendar = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Calendar</h2>
          <p className="text-gray-600 mt-1">Strategic publishing schedule and content planning</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Content
          </Button>
        </div>
      </div>

      {/* Calendar Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
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
      </div>

      {/* Content Calendar */}
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Content Calendar</h3>
            <p className="text-gray-400">Strategic publishing schedule and content planning</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
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
            <CalendarDays className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-sm text-gray-400">Scheduled This Month</div>
          </Card>

          <Card className="p-6 text-center">
            <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">3</div>
            <div className="text-sm text-gray-400">Publishing This Week</div>
          </Card>

          <Card className="p-6 text-center">
            <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">7</div>
            <div className="text-sm text-gray-400">In Review</div>
          </Card>

          <Card className="p-6 text-center">
            <Timer className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-sm text-gray-400">Overdue</div>
          </Card>
        </div>

        {/* Calendar View */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-white">June 2024</h4>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">Today</Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 border-b">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const isToday = day === 14;
              const hasContent = [5, 8, 12, 15, 18, 22, 25, 28].includes(day);
              
              return (
                <div key={day} className={`min-h-[100px] p-2 border border-gray-200 ${
                  isToday ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
                } cursor-pointer transition-colors`}>
                  <div className={`text-sm font-medium mb-2 ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day}
                  </div>
                  {hasContent && (
                    <div className="space-y-1">
                      {day === 5 && (
                        <div className="text-xs p-1 bg-green-100 text-green-800 rounded truncate">
                          SEO Guide Launch
                        </div>
                      )}
                      {day === 8 && (
                        <div className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate">
                          Blog Review
                        </div>
                      )}
                      {day === 12 && (
                        <div className="text-xs p-1 bg-purple-100 text-purple-800 rounded truncate">
                          Social Content
                        </div>
                      )}
                      {day === 15 && (
                        <>
                          <div className="text-xs p-1 bg-green-100 text-green-800 rounded truncate">
                            Article Publish
                          </div>
                          <div className="text-xs p-1 bg-yellow-100 text-yellow-800 rounded truncate">
                            Draft Due
                          </div>
                        </>
                      )}
                      {day === 18 && (
                        <div className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate">
                          Email Campaign
                        </div>
                      )}
                      {day === 22 && (
                        <div className="text-xs p-1 bg-green-100 text-green-800 rounded truncate">
                          Weekly Report
                        </div>
                      )}
                      {day === 25 && (
                        <div className="text-xs p-1 bg-purple-100 text-purple-800 rounded truncate">
                          Video Script
                        </div>
                      )}
                      {day === 28 && (
                        <div className="text-xs p-1 bg-yellow-100 text-yellow-800 rounded truncate">
                          Content Review
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h4>
          <div className="space-y-3">
            {[
              { title: 'Technical SEO Guide', type: 'Publish', date: '2024-06-15', priority: 'high', cluster: 'SEO Optimization' },
              { title: 'Content Marketing ROI Article', type: 'Review', date: '2024-06-16', priority: 'medium', cluster: 'Content Marketing' },
              { title: 'Analytics Dashboard Tutorial', type: 'Draft Due', date: '2024-06-18', priority: 'high', cluster: 'Digital Analytics' },
              { title: 'Lead Generation Checklist', type: 'Publish', date: '2024-06-20', priority: 'medium', cluster: 'Lead Generation' },
              { title: 'Mobile SEO Best Practices', type: 'Review', date: '2024-06-22', priority: 'low', cluster: 'SEO Optimization' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.cluster}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.type === 'Publish' ? 'bg-green-100 text-green-800' :
                    item.type === 'Review' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</span>
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Publishing Workflow */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Publishing Workflow</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Edit3 className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Draft</div>
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Review</div>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Scheduled</div>
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900">Published</div>
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
          </div>
        </Card>

        {/* Content Performance Forecast */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Content Performance Forecast</h4>
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
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          📝 SEO Content Strategist
        </h1>
        <p className="text-lg text-gray-600">
          Strategic content planning with AI-powered cluster optimization
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
    </div>
  );
};

export default SEOContentStrategist;