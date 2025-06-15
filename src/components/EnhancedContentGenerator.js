import React, { useState, useEffect } from 'react';
import { 
  PenTool, Brain, Zap, Target, TrendingUp, Globe, Users, 
  Download, Share2, Copy, RefreshCw, CheckCircle, Clock,
  Lightbulb, BarChart3, Award, Star, Cpu, Database,
  ArrowRight, FileText, Edit3, Eye, Hash, Calendar
} from 'lucide-react';
import { Card, Button, ProgressIndicator } from './ui/DesignSystem';
import { useAuth } from './auth/AuthContext';
import { useAnalytics } from '../hooks/useAnalytics';

const EnhancedContentGenerator = () => {
  const { user } = useAuth();
  const { trackPage, trackTool, trackFeature } = useAnalytics();
  
  const [contentType, setContentType] = useState('blog-post');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentLength, setContentLength] = useState('2000');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeModel, setActiveModel] = useState('');
  const [selectedModels, setSelectedModels] = useState(['claude', 'gpt4', 'gemini']);

  // Track generation stats
  const [todayGenerations, setTodayGenerations] = useState(0);
  const [totalGenerations, setTotalGenerations] = useState(0);

  useEffect(() => {
    trackPage('Enhanced Content Generator', 'content_creation');
    loadGenerationStats();
  }, [trackPage]);

  const loadGenerationStats = () => {
    try {
      const stats = JSON.parse(localStorage.getItem('contentGenerationStats') || '{}');
      const today = new Date().toDateString();
      
      if (stats.lastGenerationDate === today) {
        setTodayGenerations(stats.todayGenerations || 0);
      } else {
        setTodayGenerations(0);
      }
      setTotalGenerations(stats.totalGenerations || 0);
    } catch (error) {
      console.error('Error loading generation stats:', error);
    }
  };

  const updateGenerationStats = () => {
    const today = new Date().toDateString();
    const newTodayCount = todayGenerations + 1;
    const newTotalCount = totalGenerations + 1;
    
    const stats = {
      todayGenerations: newTodayCount,
      totalGenerations: newTotalCount,
      lastGenerationDate: today
    };
    
    localStorage.setItem('contentGenerationStats', JSON.stringify(stats));
    setTodayGenerations(newTodayCount);
    setTotalGenerations(newTotalCount);
  };

  const generateContent = async () => {
    if (!targetKeyword.trim()) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    trackTool('content_generation', 'started', { 
      keyword: targetKeyword, 
      type: contentType,
      models: selectedModels 
    });

    // Simulate multi-model generation process
    const models = ['claude', 'gpt4', 'gemini'];
    let currentStep = 0;
    
    for (const model of models) {
      if (selectedModels.includes(model)) {
        setActiveModel(model);
        await new Promise(resolve => setTimeout(resolve, 1500));
        currentStep++;
        setGenerationProgress((currentStep / selectedModels.length) * 100);
      }
    }

    // Generate mock content
    const mockContent = generateMockContent();
    setGeneratedContent(mockContent);
    setIsGenerating(false);
    setActiveModel('');
    updateGenerationStats();
    trackFeature('content_generated', true);
  };

  const generateMockContent = () => {
    const contentTypes = {
      'blog-post': 'Ultimate Guide',
      'landing-page': 'Converting Landing Page',
      'product-description': 'Compelling Product Description',
      'email-sequence': 'Email Marketing Series',
      'social-media': 'Social Media Campaign',
      'press-release': 'Press Release'
    };

    const title = `${contentTypes[contentType]}: ${targetKeyword}`;
    const wordCount = parseInt(contentLength);
    
    return {
      title,
      content: `# ${title}\n\n## Introduction\n\nThis is a professionally generated ${contentType.replace('-', ' ')} targeting "${targetKeyword}" for ${targetAudience}...\n\n[Generated ${wordCount} words of premium content]\n\n## Key Points\n\n- SEO-optimized for "${targetKeyword}"\n- Tailored for ${targetAudience}\n- ${tone} tone throughout\n- Multi-model AI enhancement\n\n## Conclusion\n\nThis content provides comprehensive coverage of ${targetKeyword} with strategic insights and actionable recommendations.`,
      wordCount,
      seoScore: Math.floor(Math.random() * 20) + 80,
      readabilityScore: Math.floor(Math.random() * 15) + 85,
      keywordDensity: (Math.random() * 2 + 1).toFixed(1),
      modelInsights: {
        claude: {
          confidence: 94,
          focus: "Strategic depth and authoritative tone",
          suggestions: ["Add case studies", "Include data points", "Strengthen conclusion"]
        },
        gpt4: {
          confidence: 91,
          focus: "Creative engagement and flow",
          suggestions: ["Enhance introduction hook", "Add storytelling elements", "Improve transitions"]
        },
        gemini: {
          confidence: 88,
          focus: "Market relevance and trends",
          suggestions: ["Include current trends", "Add market statistics", "Reference competitors"]
        }
      },
      exportFormats: ['HTML', 'Markdown', 'Word', 'PDF', 'JSON'],
      estimatedReadTime: Math.ceil(wordCount / 200)
    };
  };

  const contentTypeOptions = [
    { value: 'blog-post', label: 'Blog Post', icon: FileText, description: 'SEO-optimized articles' },
    { value: 'landing-page', label: 'Landing Page', icon: Globe, description: 'High-converting pages' },
    { value: 'product-description', label: 'Product Description', icon: Target, description: 'Compelling product copy' },
    { value: 'email-sequence', label: 'Email Sequence', icon: Users, description: 'Nurturing email series' },
    { value: 'social-media', label: 'Social Media', icon: Share2, description: 'Engaging social content' },
    { value: 'press-release', label: 'Press Release', icon: Award, description: 'Professional announcements' }
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Authoritative and credible' },
    { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable' },
    { value: 'technical', label: 'Technical', description: 'Expert and detailed' },
    { value: 'persuasive', label: 'Persuasive', description: 'Compelling and convincing' },
    { value: 'educational', label: 'Educational', description: 'Informative and clear' },
    { value: 'creative', label: 'Creative', description: 'Innovative and engaging' }
  ];

  const ModelCard = ({ model, icon: Icon, name, description, confidence, isActive, isSelected, onToggle }) => (
    <div 
      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      } ${isActive ? 'ring-2 ring-blue-400 animate-pulse' : ''}`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
          <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{name}</span>
        </div>
        {confidence && (
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{confidence}%</span>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      {isActive && (
        <div className="absolute top-2 right-2">
          <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🚀 Enhanced Content Generator
          </h1>
          <p className="text-lg text-gray-400 mb-4">
            Multi-Model AI • Unlimited Generation • Attribution Intelligence
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{todayGenerations}</div>
              <div className="text-gray-500">Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">∞</div>
              <div className="text-gray-500">Limit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{totalGenerations}</div>
              <div className="text-gray-500">Total</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 rounded-lg px-4 py-2 backdrop-blur-sm">
              <span className="text-red-400 font-medium">🎯 Outrank.so Killer:</span>
              <span className="text-red-300 ml-2">Unlimited content generation with multi-model AI and attribution tracking</span>
            </div>
          </div>
        </div>

      {/* AI Model Selection */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-600" />
          Select AI Models
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModelCard
            model="claude"
            icon={Cpu}
            name="Claude Strategy"
            description="Strategic depth and authoritative content"
            confidence={94}
            isActive={activeModel === 'claude'}
            isSelected={selectedModels.includes('claude')}
            onToggle={() => {
              setSelectedModels(prev => 
                prev.includes('claude') 
                  ? prev.filter(m => m !== 'claude')
                  : [...prev, 'claude']
              );
            }}
          />
          <ModelCard
            model="gpt4"
            icon={Lightbulb}
            name="GPT-4 Creative"
            description="Creative flow and engaging content"
            confidence={91}
            isActive={activeModel === 'gpt4'}
            isSelected={selectedModels.includes('gpt4')}
            onToggle={() => {
              setSelectedModels(prev => 
                prev.includes('gpt4') 
                  ? prev.filter(m => m !== 'gpt4')
                  : [...prev, 'gpt4']
              );
            }}
          />
          <ModelCard
            model="gemini"
            icon={TrendingUp}
            name="Gemini Intelligence"
            description="Market trends and competitive insights"
            confidence={88}
            isActive={activeModel === 'gemini'}
            isSelected={selectedModels.includes('gemini')}
            onToggle={() => {
              setSelectedModels(prev => 
                prev.includes('gemini') 
                  ? prev.filter(m => m !== 'gemini')
                  : [...prev, 'gemini']
              );
            }}
          />
        </div>
      </Card>

      {/* Content Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Type Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-600" />
            Content Type
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contentTypeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.value}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    contentType === option.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setContentType(option.value)}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className={`w-4 h-4 ${
                      contentType === option.value ? 'text-purple-600' : 'text-gray-500'
                    }`} />
                    <span className={`font-medium ${
                      contentType === option.value ? 'text-purple-700' : 'text-gray-700'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Content Parameters */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            Content Parameters
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Keyword
              </label>
              <input
                type="text"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                placeholder="e.g., best SEO tools 2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                placeholder="e.g., small business owners"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Length
                </label>
                <select
                  value={contentLength}
                  onChange={(e) => setContentLength(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="500">Short (500 words)</option>
                  <option value="1000">Medium (1,000 words)</option>
                  <option value="2000">Long (2,000 words)</option>
                  <option value="3000">Extended (3,000 words)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {toneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={generateContent}
          disabled={!targetKeyword.trim() || isGenerating || selectedModels.length === 0}
          size="lg"
          className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg font-semibold"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Generating Multi-Model Content...
            </>
          ) : (
            <>
              <PenTool className="w-5 h-5 mr-2" />
              Generate Multi-Model Content
            </>
          )}
        </Button>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Multi-Model Generation in Progress</h3>
            <div className="space-y-3">
              {['claude', 'gpt4', 'gemini'].map((model) => {
                if (!selectedModels.includes(model)) return null;
                const isActive = activeModel === model;
                const isComplete = selectedModels.indexOf(model) < selectedModels.indexOf(activeModel);
                
                return (
                  <div key={model} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{model} {model === 'gpt4' ? 'Creative' : model === 'claude' ? 'Strategy' : 'Intelligence'}</span>
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : isActive ? (
                      <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
            <ProgressIndicator progress={generationProgress} />
          </div>
        </Card>
      )}

      {/* Generated Content Results */}
      {generatedContent && !isGenerating && (
        <div className="space-y-6">
          {/* Content Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <Hash className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{generatedContent.wordCount}</div>
              <div className="text-sm text-gray-600">Words Generated</div>
            </Card>
            
            <Card className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{generatedContent.seoScore}/100</div>
              <div className="text-sm text-gray-600">SEO Score</div>
            </Card>
            
            <Card className="p-4 text-center">
              <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{generatedContent.readabilityScore}/100</div>
              <div className="text-sm text-gray-600">Readability</div>
            </Card>
            
            <Card className="p-4 text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{generatedContent.estimatedReadTime}</div>
              <div className="text-sm text-gray-600">Min Read</div>
            </Card>
          </div>

          {/* AI Model Insights */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              AI Model Insights
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(generatedContent.modelInsights).map(([model, insights]) => (
                <div key={model} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold capitalize flex items-center">
                      {model === 'claude' && <Cpu className="w-4 h-4 mr-2 text-blue-600" />}
                      {model === 'gpt4' && <Lightbulb className="w-4 h-4 mr-2 text-green-600" />}
                      {model === 'gemini' && <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />}
                      {model} {model === 'gpt4' ? 'Creative' : model === 'claude' ? 'Strategy' : 'Intelligence'}
                    </h4>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{insights.confidence}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{insights.focus}</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-600 font-medium">Suggestions:</p>
                    {insights.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Generated Content Preview */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-600" />
              Generated Content Preview
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {generatedContent.content}
              </pre>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            <Button className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Content
            </Button>
            
            <Button variant="secondary" className="flex items-center">
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            
            <Button variant="secondary" className="flex items-center">
              <Edit3 className="w-4 h-4 mr-2" />
              Polish Content
            </Button>
            
            <Button variant="secondary" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Track Performance
            </Button>
          </div>
        </div>
      )}

      {/* Quick Start Examples */}
      {!generatedContent && !isGenerating && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Start Examples</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'best CRM software 2024',
              'digital marketing strategy',
              'SEO optimization guide',
              'content marketing tips',
              'social media automation',
              'email marketing best practices',
              'conversion optimization',
              'lead generation tactics'
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setTargetKeyword(example)}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">{example}</div>
              </button>
            ))}
          </div>
        </Card>
      )}
      </div>
    </div>
  );
};

export default EnhancedContentGenerator;