import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  FileText, 
  Download, 
  Star, 
  Target, 
  TrendingUp, 
  Users, 
  Eye, 
  BarChart3, 
  Lightbulb,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Zap,
  Brain,
  TrendingDown,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';
import { Button, Card, ProgressIndicator } from './ui/DesignSystem';
import MultiModelAIDashboard from './MultiModelAIDashboard';

const SEOContentStrategist = () => {
  const [activeTab, setActiveTab] = useState('strategy');
  const [topic, setTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keywords, setKeywords] = useState('');
  const [contentLength, setContentLength] = useState('comprehensive');
  const [contentType, setContentType] = useState('blog-post');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [exportFormat, setExportFormat] = useState('html');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [batchJobs, setBatchJobs] = useState([]);
  const [performanceData, setPerformanceData] = useState(null);
  const [showMultiModelAI, setShowMultiModelAI] = useState(false);

  // Sample data
  const sampleClusters = [
    {
      id: 1,
      name: 'Digital Marketing Fundamentals',
      mainKeyword: 'digital marketing',
      keywordCount: 25,
      articles: 8,
      status: 'in-progress',
      priority: 'high',
      estimatedTraffic: 12500,
      difficulty: 'medium',
      articles_list: [
        { title: 'Complete Guide to Digital Marketing', status: 'published', traffic: 2500 },
        { title: 'Digital Marketing Strategies for 2024', status: 'draft', traffic: 0 }
      ]
    }
  ];

  const samplePerformanceData = {
    totalArticles: 247,
    totalViews: 125680,
    averageTimeOnPage: '3:24',
    bounceRate: '42%',
    conversionRate: '2.8%',
    topPerformers: [
      { title: 'Complete Guide to Digital Marketing', views: 12450, conversions: 89 }
    ],
    recentActivity: [
      { date: '2024-06-12', articles: 3, views: 1240, conversions: 8 }
    ]
  };

  useEffect(() => {
    setClusters(sampleClusters);
    setPerformanceData(samplePerformanceData);
  }, []);

  const generateContent = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic for content generation.');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentStep('Initializing content generation...');

    try {
      // Simulate progress
      for (let i = 1; i <= 7; i++) {
        setProgress((i / 7) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setGeneratedContent({
        title: `Complete Guide to ${topic}`,
        content: `<h1>Complete Guide to ${topic}</h1><p>This is a comprehensive guide about ${topic}.</p>`,
        metadata: {
          wordCount: 425,
          readingTime: '2 min',
          keywordDensity: '2.3%',
          seoScore: 85
        }
      });
      setCurrentStep('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    { id: 'strategy', label: 'Content Strategy', icon: Target },
    { id: 'clusters', label: 'Content Clusters', icon: BarChart3 },
    { id: 'batch', label: 'Batch Generation', icon: Zap },
    { id: 'analytics', label: 'Performance', icon: TrendingUp },
    { id: 'attribution', label: 'Attribution', icon: Activity },
    { id: 'ai-models', label: 'Multi-Model AI', icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Content Marketing Hub
          </h1>
          <p className="text-gray-600">
            Enterprise-grade content creation with multi-touch attribution and advanced AI
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Strategy Tab */}
        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Content Generation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic/Title
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter your content topic..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    placeholder="e.g., Marketing professionals..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={generateContent}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowMultiModelAI(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Optimize
                </Button>
              </div>
            </Card>

            {/* Progress Indicator */}
            {isGenerating && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Generating Content
                  </h3>
                  <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                </div>
                <ProgressIndicator progress={progress} className="mb-3" />
                <p className="text-sm text-gray-600">{currentStep}</p>
              </Card>
            )}

            {/* Generated Content */}
            {generatedContent && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Generated Content
                </h3>
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white">
                  <div dangerouslySetInnerHTML={{ __html: generatedContent.content }} />
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Multi-Model AI Tab */}
        {activeTab === 'ai-models' && (
          <MultiModelAIDashboard />
        )}

        {/* Other tabs would go here with similar simplified structure */}
        {activeTab !== 'strategy' && activeTab !== 'ai-models' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {tabs.find(t => t.id === activeTab)?.label} - Coming Soon
            </h2>
            <p className="text-gray-600">
              This feature is under development and will be available soon.
            </p>
          </Card>
        )}

        {/* Multi-Model AI Modal */}
        {showMultiModelAI && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Multi-Model AI Content Optimization
                  </h2>
                  <button
                    onClick={() => setShowMultiModelAI(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <MultiModelAIDashboard />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOContentStrategist;