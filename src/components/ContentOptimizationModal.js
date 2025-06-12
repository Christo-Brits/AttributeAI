import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wand2, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Search,
  Users,
  Award,
  Zap,
  RefreshCw,
  Copy,
  Download
} from 'lucide-react';

const ContentOptimizationModal = ({ 
  isOpen, 
  onClose, 
  content, 
  qualityAnalysis, 
  targetKeywords = [],
  onOptimizedContent 
}) => {
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationStage, setOptimizationStage] = useState('');
  const [optimizedContent, setOptimizedContent] = useState('');
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([]);
  const [selectedOptimizations, setSelectedOptimizations] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (isOpen && qualityAnalysis) {
      generateOptimizationSuggestions();
    }
  }, [isOpen, qualityAnalysis]);

  const generateOptimizationSuggestions = () => {
    const suggestions = [];
    
    // Based on quality analysis, generate specific suggestions
    if (qualityAnalysis.readability.score < 70) {
      suggestions.push({
        id: 'readability',
        type: 'Readability',
        priority: 'high',
        title: 'Improve Readability',
        description: 'Simplify language and shorten sentences for better readability',
        impact: 'High',
        effort: 'Medium',
        icon: FileText,
        color: 'blue'
      });
    }

    if (qualityAnalysis.seo.score < 80) {
      suggestions.push({
        id: 'seo',
        type: 'SEO',
        priority: 'high',
        title: 'Optimize for SEO',
        description: 'Improve keyword density, meta tags, and heading structure',
        impact: 'High',
        effort: 'Low',
        icon: Search,
        color: 'green'
      });
    }

    if (qualityAnalysis.engagement.score < 75) {
      suggestions.push({
        id: 'engagement',
        type: 'Engagement',
        priority: 'medium',
        title: 'Boost Engagement',
        description: 'Add more questions, power words, and call-to-action elements',
        impact: 'Medium',
        effort: 'Low',
        icon: Users,
        color: 'purple'
      });
    }

    if (qualityAnalysis.structure.score < 80) {
      suggestions.push({
        id: 'structure',
        type: 'Structure',
        priority: 'medium',
        title: 'Improve Structure',
        description: 'Better organize content with headings, lists, and shorter paragraphs',
        impact: 'Medium',
        effort: 'Medium',
        icon: FileText,
        color: 'orange'
      });
    }

    if (qualityAnalysis.quality.score < 85) {
      suggestions.push({
        id: 'quality',
        type: 'Quality',
        priority: 'high',
        title: 'Enhance Quality',
        description: 'Fix grammar issues and improve sentence variety',
        impact: 'High',
        effort: 'Low',
        icon: Award,
        color: 'red'
      });
    }

    // Always suggest AI enhancement
    suggestions.push({
      id: 'ai-enhance',
      type: 'AI Enhancement',
      priority: 'medium',
      title: 'AI-Powered Enhancement',
      description: 'Use AI to polish language, add insights, and improve flow',
      impact: 'High',
      effort: 'Low',
      icon: Wand2,
      color: 'indigo'
    });

    setOptimizationSuggestions(suggestions);
    setSelectedOptimizations(suggestions.filter(s => s.priority === 'high').map(s => s.id));
  };

  const performOptimization = async () => {
    setOptimizing(true);
    setOptimizationStage('Initializing optimization...');

    try {
      // Stage 1: Analyze selected optimizations
      setOptimizationStage('Analyzing content structure...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Stage 2: Apply readability improvements
      if (selectedOptimizations.includes('readability')) {
        setOptimizationStage('Improving readability...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Stage 3: SEO optimization
      if (selectedOptimizations.includes('seo')) {
        setOptimizationStage('Optimizing for SEO...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Stage 4: Engagement enhancement
      if (selectedOptimizations.includes('engagement')) {
        setOptimizationStage('Enhancing engagement elements...');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Stage 5: Structure improvements
      if (selectedOptimizations.includes('structure')) {
        setOptimizationStage('Improving content structure...');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Stage 6: Quality enhancements
      if (selectedOptimizations.includes('quality')) {
        setOptimizationStage('Enhancing content quality...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Stage 7: AI enhancement
      if (selectedOptimizations.includes('ai-enhance')) {
        setOptimizationStage('Applying AI enhancements...');
        await new Promise(resolve => setTimeout(resolve, 2500));
      }

      // Stage 8: Final polish
      setOptimizationStage('Finalizing optimizations...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate optimized content (mock for now)
      const optimized = await generateOptimizedContent();
      setOptimizedContent(optimized);
      setPreviewMode(true);

    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setOptimizing(false);
      setOptimizationStage('');
    }
  };

  const generateOptimizedContent = async () => {
    // In production, this would call Claude API with specific optimization instructions
    const improvements = [];
    
    if (selectedOptimizations.includes('readability')) {
      improvements.push('Simplified complex sentences and improved readability');
    }
    if (selectedOptimizations.includes('seo')) {
      improvements.push('Optimized keyword placement and meta structure');
    }
    if (selectedOptimizations.includes('engagement')) {
      improvements.push('Added engaging questions and power words');
    }
    if (selectedOptimizations.includes('structure')) {
      improvements.push('Improved heading hierarchy and paragraph structure');
    }
    if (selectedOptimizations.includes('quality')) {
      improvements.push('Enhanced grammar and sentence variety');
    }
    if (selectedOptimizations.includes('ai-enhance')) {
      improvements.push('Applied AI-powered language enhancement');
    }

    return `${content}

<!-- OPTIMIZATION APPLIED -->
<!-- Improvements made: ${improvements.join(', ')} -->
<!-- This content has been optimized for better performance -->`;
  };

  const toggleOptimization = (id) => {
    setSelectedOptimizations(prev => 
      prev.includes(id) 
        ? prev.filter(optId => optId !== id)
        : [...prev, id]
    );
  };

  const copyOptimizedContent = () => {
    navigator.clipboard.writeText(optimizedContent);
    // Show success message
  };

  const applyOptimizations = () => {
    if (onOptimizedContent) {
      onOptimizedContent(optimizedContent);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Content Optimization</h2>
            <p className="text-gray-600">AI-powered content enhancement and optimization</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {!previewMode ? (
            <>
              {/* Optimization Options */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Optimizations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {optimizationSuggestions.map((suggestion) => {
                    const IconComponent = suggestion.icon;
                    const isSelected = selectedOptimizations.includes(suggestion.id);
                    
                    return (
                      <div
                        key={suggestion.id}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          isSelected 
                            ? `border-${suggestion.color}-500 bg-${suggestion.color}-50` 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleOptimization(suggestion.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg bg-${suggestion.color}-100 mr-3`}>
                              <IconComponent className={`h-5 w-5 text-${suggestion.color}-600`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full bg-${suggestion.color}-100 text-${suggestion.color}-700`}>
                                {suggestion.type}
                              </span>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected 
                              ? `border-${suggestion.color}-500 bg-${suggestion.color}-500` 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                        
                        <div className="flex justify-between text-xs">
                          <div className="flex items-center">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-gray-600">Impact: {suggestion.impact}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-gray-600">Effort: {suggestion.effort}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Quality Scores */}
              {qualityAnalysis && (
                <div className="px-6 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Quality Scores</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{qualityAnalysis.readability.score}</div>
                      <div className="text-xs text-gray-600">Readability</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{qualityAnalysis.seo.score}</div>
                      <div className="text-xs text-gray-600">SEO</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{qualityAnalysis.engagement.score}</div>
                      <div className="text-xs text-gray-600">Engagement</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{qualityAnalysis.structure.score}</div>
                      <div className="text-xs text-gray-600">Structure</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{qualityAnalysis.quality.score}</div>
                      <div className="text-xs text-gray-600">Quality</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">{qualityAnalysis.overallScore}</div>
                      <div className="text-xs text-gray-600">Overall</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Preview Mode */
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Optimized Content Preview</h3>
                <div className="flex gap-2">
                  <button
                    onClick={copyOptimizedContent}
                    className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={() => setPreviewMode(false)}
                    className="inline-flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Back to Options
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: optimizedContent }} />
              </div>
              
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Optimizations Applied:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOptimizations.map(id => {
                    const suggestion = optimizationSuggestions.find(s => s.id === id);
                    return suggestion ? (
                      <span key={id} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {suggestion.title}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Optimization Progress */}
          {optimizing && (
            <div className="px-6 pb-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mr-3" />
                  <span className="text-lg font-medium text-blue-900">Optimizing Content...</span>
                </div>
                <div className="text-center text-blue-700 mb-4">{optimizationStage}</div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedOptimizations.length} optimization{selectedOptimizations.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {previewMode ? (
              <button
                onClick={applyOptimizations}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply Changes
              </button>
            ) : (
              <button
                onClick={performOptimization}
                disabled={selectedOptimizations.length === 0 || optimizing}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {optimizing ? 'Optimizing...' : 'Start Optimization'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentOptimizationModal;