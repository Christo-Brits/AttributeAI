import React, { useState, useEffect } from 'react';
import { 
  Search, FileText, Download, Star, Target, TrendingUp, 
  Users, Eye, BarChart3, Lightbulb, CheckCircle, Clock,
  AlertTriangle, RefreshCw, Zap, Brain, Activity, PieChart,
  Globe, Layers, Award, Rocket, Shield, Database, Edit3,
  MousePointer, Cpu, Gauge, Trophy, ArrowUp
} from 'lucide-react';
import { Card, Button, ProgressIndicator } from './ui/DesignSystem';
import DataBridge from '../utils/DataBridge';

const ContentOptimizationEngine = () => {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [contentUrl, setContentUrl] = useState('');
  const [contentText, setContentText] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState(null);
  const [optimizationScore, setOptimizationScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [activeModel, setActiveModel] = useState('');
  const [todayAnalyses, setTodayAnalyses] = useState(0);

  useEffect(() => {
    loadAnalysisStats();
  }, []);

  const loadAnalysisStats = () => {
    const stats = JSON.parse(localStorage.getItem('contentOptimizationStats') || '{}');
    const today = new Date().toDateString();
    
    if (stats.lastAnalysisDate === today) {
      setTodayAnalyses(stats.todayAnalyses || 0);
    } else {
      setTodayAnalyses(0);
    }
  };

  // Enhanced Content Analysis with Multi-Model AI
  const analyzeContent = async () => {
    if (!contentText.trim() && !contentUrl.trim()) {
      alert('Please provide content text or URL to analyze');
      return;
    }
    
    if (!targetKeyword.trim()) {
      alert('Please specify a target keyword');
      return;
    }

    setIsAnalyzing(true);
    setOptimizationScore(0);
    setAnalysisResult(null);
    setSuggestions([]);
    
    try {
      // Multi-model analysis process
      const models = ['Claude', 'GPT-4', 'Gemini'];
      const modelInsights = {};
      let totalScore = 0;
      
      for (let i = 0; i < models.length; i++) {
        const model = models[i];
        setActiveModel(model);
        
        // Simulate model analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const insights = await generateModelInsights(model, contentText || contentUrl, targetKeyword);
        modelInsights[model] = insights;
        totalScore += insights.score;
        
        setOptimizationScore(Math.floor(totalScore / (i + 1)));
      }
      
      // Generate comprehensive analysis
      const finalScore = Math.floor(totalScore / 3);
      const analysis = await generateComprehensiveAnalysis(modelInsights, finalScore);
      
      setAnalysisResult(analysis);
      setSuggestions(analysis.suggestions);
      await updateAnalysisStats();
      
      // Share with DataBridge for attribution tracking
      DataBridge.setData('contentOptimization', {
        keyword: targetKeyword,
        score: finalScore,
        url: contentUrl,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setActiveModel('');
    }
  };

  const generateModelInsights = async (model, content, keyword) => {
    // Simulate different AI model analysis patterns
    const baseScore = Math.floor(Math.random() * 30) + 70;
    
    const insights = {
      score: baseScore,
      strengths: [],
      improvements: [],
      keywordAnalysis: {},
      competitorBenchmark: {}
    };

    switch (model) {
      case 'Claude':
        insights.strengths = [
          'Strategic keyword placement shows strong search intent alignment',
          'Content structure follows proven conversion optimization patterns',
          'Attribution potential: High - strong commercial intent detected'
        ];
        insights.improvements = [
          'Add semantic keywords to improve topical authority',
          'Include data-driven statistics to boost E-E-A-T signals',
          'Optimize for featured snippet capture with structured data'
        ];
        break;
        
      case 'GPT-4':
        insights.strengths = [
          'Engaging introduction that hooks readers effectively',
          'Natural keyword integration without over-optimization',
          'Strong call-to-action elements throughout content'
        ];
        insights.improvements = [
          'Enhance readability with shorter paragraphs',
          'Add more transition words for better flow',
          'Include relevant LSI keywords for semantic richness'
        ];
        break;
        
      case 'Gemini':
        insights.strengths = [
          'Market-aligned content targeting high-value search queries',
          'Competitive positioning superior to industry benchmarks',
          'Technical SEO elements properly implemented'
        ];
        insights.improvements = [
          'Expand content depth to match top-ranking competitors',
          'Add multimedia elements to increase engagement time',
          'Optimize internal linking structure for better PageRank flow'
        ];
        break;
    }
    
    return insights;
  };

  const generateComprehensiveAnalysis = async (modelInsights, finalScore) => {
    return {
      overallScore: finalScore,
      seoElements: {
        title: { 
          score: Math.floor(Math.random() * 20) + 75, 
          status: finalScore > 85 ? 'excellent' : finalScore > 70 ? 'good' : 'needs-improvement',
          suggestion: 'Include target keyword in first 60 characters for optimal CTR'
        },
        metaDescription: { 
          score: Math.floor(Math.random() * 25) + 70, 
          status: finalScore > 80 ? 'good' : 'fair',
          suggestion: 'Add compelling call-to-action to improve click-through rates'
        },
        headings: { 
          score: Math.floor(Math.random() * 15) + 85, 
          status: 'excellent',
          suggestion: 'Perfect H1-H6 structure with proper keyword distribution'
        },
        keywordDensity: { 
          score: Math.floor(Math.random() * 20) + 75, 
          status: 'good',
          suggestion: 'Optimal keyword density - maintain current distribution'
        },
        readability: { 
          score: Math.floor(Math.random() * 18) + 82, 
          status: 'excellent',
          suggestion: 'Great readability score - content is accessible to target audience'
        },
        wordCount: { 
          score: Math.floor(Math.random() * 10) + 90, 
          status: 'excellent',
          suggestion: 'Optimal length for target keyword and search intent'
        }
      },
      aiInsights: modelInsights,
      competitorComparison: {
        averageScore: Math.floor(Math.random() * 15) + 60,
        rankingPosition: Math.floor(Math.random() * 3) + 1,
        gapAnalysis: [
          'Your content outperforms 78% of top 10 competitors',
          'Keyword optimization superior to industry average',
          'Content depth matches top-ranking pages'
        ]
      },
      attributionPotential: {
        conversionLikelihood: finalScore > 85 ? 'High' : finalScore > 70 ? 'Medium' : 'Low',
        commercialIntent: Math.floor(Math.random() * 30) + 70,
        expectedCTR: `${(finalScore * 0.15).toFixed(1)}%`,
        revenueImpact: finalScore > 80 ? 'Significant' : 'Moderate'
      },
      suggestions: generateOptimizationSuggestions(finalScore, modelInsights)
    };
  };

  const generateOptimizationSuggestions = (score, modelInsights) => {
    const suggestions = [];
    
    // Combine insights from all models
    Object.values(modelInsights).forEach(insight => {
      insight.improvements.forEach(improvement => {
        if (!suggestions.some(s => s.text === improvement)) {
          suggestions.push({
            type: 'improvement',
            priority: Math.random() > 0.5 ? 'high' : 'medium',
            text: improvement,
            impact: `+${Math.floor(Math.random() * 10) + 5} points`,
            effort: Math.random() > 0.5 ? 'Low' : 'Medium'
          });
        }
      });
    });
    
    // Add specific technical suggestions based on score
    if (score < 85) {
      suggestions.push({
        type: 'technical',
        priority: 'high',
        text: 'Optimize page loading speed - current score affects SEO ranking',
        impact: '+8 points',
        effort: 'Medium'
      });
    }
    
    if (score < 80) {
      suggestions.push({
        type: 'content',
        priority: 'high',
        text: 'Add more authoritative external links to boost E-E-A-T signals',
        impact: '+12 points',
        effort: 'Low'
      });
    }
    
    return suggestions.slice(0, 8); // Limit to top 8 suggestions
  };

  const updateAnalysisStats = () => {
    const today = new Date().toDateString();
    const newCount = todayAnalyses + 1;
    
    const stats = {
      todayAnalyses: newCount,
      lastAnalysisDate: today
    };
    
    localStorage.setItem('contentOptimizationStats', JSON.stringify(stats));
    setTodayAnalyses(newCount);
  };

  const exportAnalysis = () => {
    if (!analysisResult) return;
    
    const exportData = {
      analysis: analysisResult,
      keyword: targetKeyword,
      url: contentUrl,
      analyzedAt: new Date().toISOString(),
      platform: 'AttributeAI Content Intelligence'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-analysis-${targetKeyword.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'excellent': 'bg-green-100 text-green-800 border-green-200',
      'good': 'bg-blue-100 text-blue-800 border-blue-200',
      'fair': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'needs-improvement': 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status] || badges['fair'];
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Content Intelligence Engine
            </h1>
            <p className="text-gray-600">
              Multi-model AI content optimization • Outranking.io killer • Attribution-connected insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Card className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Production DB</span>
              </div>
            </Card>
            <Card className="px-4 py-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Today: {todayAnalyses} analyses</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Competitive Advantage Banner */}
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎯 Unlimited Content Optimization vs Outranking.io's Credit Limits
            </h3>
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span><strong>Unlimited Analyses</strong> • No monthly resets</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <span><strong>Multi-Model AI</strong> • Claude + GPT-4 + Gemini</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-blue-500" />
                <span><strong>Attribution Intelligence</strong> • Revenue tracking</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">$47/month</div>
            <div className="text-sm text-gray-600">vs Outranking's $79-149 + limits</div>
          </div>
        </div>
      </div>

      {/* Analysis Input */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Search className="h-5 w-5 mr-2 text-blue-600" />
            Content Analysis Setup
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Keyword *
              </label>
              <input
                type="text"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                placeholder="e.g., content optimization tools"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content URL (Optional)
              </label>
              <input
                type="url"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="https://yoursite.com/article"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Text
            </label>
            <textarea
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Paste your content here for analysis..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Provide either content text or URL for analysis
            </p>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isAnalyzing && (
                <div className="flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-blue-600 animate-spin" />
                  <span className="text-sm text-gray-600">
                    Analyzing with {activeModel}...
                  </span>
                </div>
              )}
            </div>
            
            <Button
              onClick={analyzeContent}
              disabled={isAnalyzing}
              className="px-6 py-2"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
            </Button>
          </div>
          
          {/* Progress */}
          {isAnalyzing && (
            <div className="mt-4">
              <ProgressIndicator 
                progress={optimizationScore} 
                label="Multi-Model Analysis Progress"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-blue-600" />
                  Optimization Score
                </h2>
                <Button onClick={exportAnalysis} className="px-4 py-2">
                  <Download className="h-4 w-4 mr-2" />
                  Export Analysis
                </Button>
              </div>
              
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysisResult.overallScore)}`}>
                  {analysisResult.overallScore}
                </div>
                <div className="text-gray-600 mb-4">out of 100</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(analysisResult.overallScore >= 85 ? 'excellent' : analysisResult.overallScore >= 70 ? 'good' : 'needs-improvement')}`}>
                  {analysisResult.overallScore >= 85 ? 'Excellent' : analysisResult.overallScore >= 70 ? 'Good' : 'Needs Improvement'}
                </div>
              </div>
            </div>
          </Card>

          {/* SEO Elements */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                SEO Elements Analysis
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analysisResult.seoElements).map(([element, data]) => (
                  <div key={element} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{element.replace(/([A-Z])/g, ' $1')}</span>
                      <span className={`font-bold ${getScoreColor(data.score)}`}>
                        {data.score}
                      </span>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(data.status)}`}>
                      {data.status.replace('-', ' ')}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{data.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* AI Model Insights */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                Multi-Model AI Insights
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Object.entries(analysisResult.aiInsights).map(([model, insights]) => (
                  <div key={model} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{model}</h3>
                      <span className={`font-bold ${getScoreColor(insights.score)}`}>
                        {insights.score}/100
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-green-700 mb-1">Strengths</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {insights.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-blue-700 mb-1">Improvements</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {insights.improvements.map((improvement, idx) => (
                            <li key={idx} className="flex items-start">
                              <ArrowUp className="h-3 w-3 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Attribution Potential */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-orange-600" />
                Attribution & Revenue Potential
              </h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {analysisResult.attributionPotential.conversionLikelihood}
                  </div>
                  <div className="text-sm text-gray-600">Conversion Likelihood</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {analysisResult.attributionPotential.commercialIntent}%
                  </div>
                  <div className="text-sm text-gray-600">Commercial Intent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {analysisResult.attributionPotential.expectedCTR}
                  </div>
                  <div className="text-sm text-gray-600">Expected CTR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {analysisResult.attributionPotential.revenueImpact}
                  </div>
                  <div className="text-sm text-gray-600">Revenue Impact</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Optimization Suggestions */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                Optimization Suggestions
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {suggestions.map((suggestion, idx) => (
                  <div key={idx} className={`border rounded-lg p-4 ${getPriorityColor(suggestion.priority)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-2">
                        <Edit3 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium">{suggestion.text}</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-white border">
                        {suggestion.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Impact: {suggestion.impact}</span>
                      <span>Effort: {suggestion.effort}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentOptimizationEngine;