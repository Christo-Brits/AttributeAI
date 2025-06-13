import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Activity, 
  Lightbulb, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  PieChart,
  LineChart,
  Users,
  Eye,
  DollarSign
} from 'lucide-react';
import { Button, Card, ProgressIndicator } from './ui/DesignSystem';

const MultiModelAIDashboard = () => {
  const [selectedModel, setSelectedModel] = useState('claude');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [optimizations, setOptimizations] = useState([]);
  const [progress, setProgress] = useState(0);

  // AI Models Configuration
  const aiModels = [
    {
      id: 'claude',
      name: 'Claude Sonnet',
      description: 'Advanced reasoning and content analysis',
      capabilities: ['Content Analysis', 'SEO Optimization', 'Strategy Planning'],
      status: 'active',
      accuracy: 94
    },
    {
      id: 'gpt4',
      name: 'GPT-4 Turbo',
      description: 'Creative content generation and optimization',
      capabilities: ['Content Creation', 'Ideation', 'Copywriting'],
      status: 'active',
      accuracy: 91
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: 'Multi-modal analysis and predictions',
      capabilities: ['Predictive Analytics', 'Market Analysis', 'Data Insights'],
      status: 'available',
      accuracy: 89
    }
  ];

  // Sample prediction data
  const samplePredictions = {
    contentPerformance: {
      score: 8.7,
      trend: 'increasing',
      confidence: 94,
      predictions: [
        { metric: 'Traffic Growth', value: '+34%', timeframe: 'Next 3 months' },
        { metric: 'Conversion Rate', value: '+12%', timeframe: 'Next month' },
        { metric: 'Engagement Rate', value: '+18%', timeframe: 'Next 2 weeks' }
      ]
    },
    marketTrends: {
      emerging: ['AI Content Tools', 'Voice Search Optimization', 'Video SEO'],
      declining: ['Keyword Stuffing', 'Guest Post Farms', 'Exact Match Domains'],
      opportunities: ['Interactive Content', 'Personalization', 'Multi-modal Content']
    },
    recommendations: [
      {
        type: 'urgent',
        title: 'Optimize for Featured Snippets',
        description: 'Your content has 73% chance of ranking in position 0',
        impact: 'High',
        effort: 'Medium',
        timeline: '1-2 weeks'
      },
      {
        type: 'opportunity',
        title: 'Expand Video Content',
        description: 'Video content in your niche shows 45% higher engagement',
        impact: 'High',
        effort: 'High',
        timeline: '1-2 months'
      }
    ]
  };

  useEffect(() => {
    setPredictions(samplePredictions);
  }, []);

  const runMultiModelAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);

    try {
      // Simulate multi-model analysis
      for (let i = 1; i <= 7; i++) {
        setProgress((i / 7) * 100);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setAnalysisResults({
        overall_score: 8.7,
        confidence: 94,
        models_used: ['Claude', 'GPT-4', 'Gemini'],
        analysis_time: '12.3s',
        insights_generated: 23
      });

      setOptimizations([
        {
          priority: 'high',
          title: 'Content Structure Optimization',
          description: 'Reorganize content hierarchy for better readability and SEO',
          expected_impact: '+23% engagement',
          implementation: 'Medium effort, 1-2 hours'
        }
      ]);

    } catch (error) {
      console.error('Error running multi-model analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getModelStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'training': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Multi-Model AI Analysis
            </h2>
            <p className="text-gray-600">
              Advanced AI-powered content optimization using multiple models
            </p>
          </div>
          <Button
            onClick={runMultiModelAnalysis}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>

        {/* Progress */}
        {isAnalyzing && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Analysis Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <ProgressIndicator progress={progress} />
          </div>
        )}
      </Card>

      {/* AI Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiModels.map((model) => (
          <Card 
            key={model.id} 
            className={`p-4 cursor-pointer transition-all ${
              selectedModel === model.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{model.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModelStatusColor(model.status)}`}>
                {model.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{model.description}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Accuracy:</span>
                <span className="font-medium">{model.accuracy}%</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {model.capabilities.map((capability, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analysisResults.overall_score}
            </div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analysisResults.confidence}%
            </div>
            <div className="text-sm text-gray-600">Confidence</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {analysisResults.models_used.length}
            </div>
            <div className="text-sm text-gray-600">Models Used</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {analysisResults.insights_generated}
            </div>
            <div className="text-sm text-gray-600">Insights Generated</div>
          </Card>
        </div>
      )}

      {/* Predictions Dashboard */}
      {predictions && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Predictions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Performance Predictions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-semibold text-blue-900">Content Performance Score</div>
                  <div className="text-sm text-blue-700">
                    {predictions.contentPerformance.confidence}% confidence
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {predictions.contentPerformance.score}/10
                </div>
              </div>
              
              {predictions.contentPerformance.predictions.map((pred, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{pred.metric}</div>
                    <div className="text-sm text-gray-600">{pred.timeframe}</div>
                  </div>
                  <div className="text-lg font-semibold text-green-600">
                    {pred.value}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Market Trends */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
              Market Trend Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-900 mb-2">🔥 Emerging Trends</h4>
                <div className="space-y-1">
                  {predictions.marketTrends.emerging.map((trend, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm rounded mr-2 mb-1">
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-red-900 mb-2">📉 Declining Trends</h4>
                <div className="space-y-1">
                  {predictions.marketTrends.declining.map((trend, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-red-100 text-red-800 text-sm rounded mr-2 mb-1">
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-blue-900 mb-2">💡 Opportunities</h4>
                <div className="space-y-1">
                  {predictions.marketTrends.opportunities.map((opp, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded mr-2 mb-1">
                      {opp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* AI Recommendations */}
      {predictions && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
            AI-Powered Recommendations
          </h3>
          <div className="space-y-4">
            {predictions.recommendations.map((rec, index) => (
              <div key={index} className={`border-l-4 p-4 rounded-lg ${getPriorityColor(rec.type)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Impact: {rec.impact}</span>
                    <span className="text-gray-500">•</span>
                    <span className="font-medium">Effort: {rec.effort}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{rec.description}</p>
                <div className="text-sm text-gray-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Timeline: {rec.timeline}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Optimization Suggestions */}
      {optimizations.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-600" />
            Content Optimizations
          </h3>
          <div className="space-y-4">
            {optimizations.map((opt, index) => (
              <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(opt.priority)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{opt.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(opt.priority)}`}>
                    {opt.priority} priority
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{opt.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-medium text-green-700">{opt.expected_impact}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium text-blue-700">{opt.implementation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MultiModelAIDashboard;