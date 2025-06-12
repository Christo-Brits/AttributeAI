import React, { useState, useEffect } from 'react';
import { 
  Link, BarChart3, GitBranch, Workflow, Target, CheckCircle, 
  AlertCircle, TrendingUp, Clock, Zap, Brain, FileText, 
  Settings, Download, Eye, Play
} from 'lucide-react';
import AutomatedInterlinkingEngine from '../services/AutomatedInterlinkingEngine';

const InterlinkingStrategyModal = ({ cluster, onClose, onApply }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [linkingStrategy, setLinkingStrategy] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  const interlinkingEngine = new AutomatedInterlinkingEngine();

  useEffect(() => {
    if (cluster) {
      generateLinkingStrategy();
    }
  }, [cluster]);

  const generateLinkingStrategy = async () => {
    setIsGenerating(true);
    setGenerationStage('Initializing interlinking engine...');

    try {
      const stages = [
        'Analyzing content relationships...',
        'Calculating content similarity scores...',
        'Evaluating SEO link values...',
        'Creating linking matrix...',
        'Optimizing link distribution...',
        'Generating anchor text variations...',
        'Creating implementation plan...',
        'Finalizing strategy...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setGenerationStage(stages[i]);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const strategy = await interlinkingEngine.generateClusterLinkingStrategy(cluster);
      setLinkingStrategy(strategy);
      setGenerationStage('Interlinking strategy completed!');
      
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStage('');
      }, 2000);

    } catch (error) {
      console.error('Error generating linking strategy:', error);
      setGenerationStage('Error generating strategy. Please try again.');
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStage('');
      }, 3000);
    }
  };

  const applyStrategy = async () => {
    if (!linkingStrategy?.success) return;
    
    try {
      const result = await interlinkingEngine.applyLinkingStrategy(cluster, linkingStrategy.strategy);
      if (result.success && onApply) {
        onApply(result.updatedCluster, result.summary);
      }
      onClose();
    } catch (error) {
      console.error('Error applying strategy:', error);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'matrix', name: 'Link Matrix', icon: GitBranch },
    { id: 'implementation', name: 'Implementation', icon: Workflow },
    { id: 'recommendations', name: 'Recommendations', icon: Target }
  ];

  const renderOverviewTab = () => {
    if (!linkingStrategy?.success) return null;
    
    const strategy = linkingStrategy.strategy;
    
    return (
      <div className="space-y-6">
        {/* Strategy Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Link className="h-5 w-5 mr-2 text-blue-600" />
            Linking Strategy Overview
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{strategy.totalLinks}</div>
              <div className="text-sm text-gray-600">Total Links</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{strategy.avgLinksPerArticle}</div>
              <div className="text-sm text-gray-600">Avg per Article</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{strategy.seoScore.overall}</div>
              <div className="text-sm text-gray-600">SEO Score</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{strategy.seoScore.grade}</div>
              <div className="text-sm text-gray-600">Grade</div>
            </div>
          </div>

          {/* SEO Score Breakdown */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">SEO Score Factors</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(strategy.seoScore.factors).map(([factor, score]) => (
                <div key={factor} className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{Math.round(score)}</div>
                  <div className="text-xs text-gray-500 capitalize">{factor.replace('_', ' ')}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(score, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Article Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-green-600" />
            Article Link Distribution
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {strategy.optimizedLinks.map((articleData, index) => (
              <div 
                key={articleData.articleId} 
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                onClick={() => setSelectedArticle(articleData)}
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{articleData.articleTitle}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      articleData.articleType === 'pillar' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {articleData.articleType === 'pillar' ? '🏛️ Pillar' : '📋 Supporting'}
                    </span>
                    <span>{articleData.actualLinkCount} links</span>
                    <span>Density: {articleData.linkDensity.percentage}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{articleData.seoScore}</div>
                  <div className="text-xs text-gray-500">SEO Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMatrixTab = () => {
    if (!linkingStrategy?.success) return null;
    
    const strategy = linkingStrategy.strategy;
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GitBranch className="h-5 w-5 mr-2 text-purple-600" />
            Content Linking Matrix
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target Articles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SEO Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {strategy.optimizedLinks.map((article, index) => (
                  <tr key={article.articleId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {article.articleTitle}
                        </div>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          article.articleType === 'pillar' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.articleType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {article.outboundLinks.slice(0, 3).map((link, linkIndex) => (
                          <div key={linkIndex} className="text-sm text-gray-600">
                            → {link.targetTitle}
                            <span className="ml-2 text-xs text-gray-400">
                              ({Math.round(link.priority * 100)}% priority)
                            </span>
                          </div>
                        ))}
                        {article.outboundLinks.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{article.outboundLinks.length - 3} more links
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {article.actualLinkCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.seoScore >= 80 ? 'bg-green-100 text-green-800' :
                        article.seoScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {article.seoScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderImplementationTab = () => {
    if (!linkingStrategy?.success) return null;
    
    const plan = linkingStrategy.strategy.implementationPlan;
    
    return (
      <div className="space-y-6">
        {/* Implementation Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Workflow className="h-5 w-5 mr-2 text-blue-600" />
            Implementation Plan
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{plan.phases.length}</div>
              <div className="text-sm text-gray-600">Implementation Phases</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{plan.totalLinks}</div>
              <div className="text-sm text-gray-600">Links to Implement</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Math.round(plan.estimatedImplementationTime / 60)}h</div>
              <div className="text-sm text-gray-600">Estimated Time</div>
            </div>
          </div>

          {/* Implementation Phases */}
          <div className="space-y-4">
            {plan.phases.map((phase, index) => (
              <div key={phase.phase} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center mr-3 ${
                      phase.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}>
                      {phase.phase}
                    </span>
                    {phase.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      phase.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {phase.priority} priority
                    </span>
                    <span className="text-sm text-gray-500">{phase.estimatedTime}min</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Articles:</span> {phase.articles.length} • 
                  <span className="font-medium"> SEO Impact:</span> {phase.seoImpact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Article Instructions */}
        {selectedArticle && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Implementation Details: {selectedArticle.articleTitle}
            </h3>
            
            <div className="space-y-4">
              {selectedArticle.outboundLinks.map((link, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Link to: {link.targetTitle}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      link.seoValue >= 80 ? 'bg-green-100 text-green-800' :
                      link.seoValue >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      SEO: {link.seoValue}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Recommended Anchor:</span>
                      <p className="text-blue-600 mt-1">"{link.recommendedAnchor}"</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Placement:</span>
                      <p className="text-gray-600 mt-1">{link.placement?.section || 'Within relevant context'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <span className="font-medium text-gray-700">Context Suggestion:</span>
                    <p className="text-gray-600 mt-1 italic">"{link.context}"</p>
                  </div>
                  
                  {link.seoNotes && link.seoNotes.length > 0 && (
                    <div className="mt-3 text-sm">
                      <span className="font-medium text-gray-700">SEO Notes:</span>
                      <ul className="list-disc list-inside text-gray-600 mt-1">
                        {link.seoNotes.map((note, noteIndex) => (
                          <li key={noteIndex}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRecommendationsTab = () => {
    if (!linkingStrategy?.success) return null;
    
    const recommendations = linkingStrategy.strategy.recommendations;
    const seoRecommendations = linkingStrategy.strategy.seoScore.recommendations;
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-orange-600" />
            Optimization Recommendations
          </h3>
          
          {/* General Recommendations */}
          {recommendations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">General Recommendations</h4>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'bg-red-50 border-red-400' :
                    rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-blue-50 border-blue-400'
                  }`}>
                    <div className="flex items-start">
                      <AlertCircle className={`h-5 w-5 mt-0.5 mr-3 ${
                        rec.priority === 'high' ? 'text-red-600' :
                        rec.priority === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{rec.message}</p>
                        {rec.suggestion && (
                          <p className="text-sm text-gray-600 mt-1">{rec.suggestion}</p>
                        )}
                        {rec.articles && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-700">Affected articles:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rec.articles.slice(0, 3).map((article, articleIndex) => (
                                <span key={articleIndex} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                  {article}
                                </span>
                              ))}
                              {rec.articles.length > 3 && (
                                <span className="text-xs text-gray-500">+{rec.articles.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Recommendations */}
          {seoRecommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">SEO Optimization Tips</h4>
              <div className="space-y-3">
                {seoRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <TrendingUp className="h-5 w-5 mt-0.5 mr-3 text-blue-600" />
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!cluster) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Link className="h-6 w-6 mr-2 text-blue-600" />
                Automated Interlinking Strategy
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Cluster: {cluster.topic} • {cluster.articles.length} articles
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="px-6 py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-900 mb-2">Generating Interlinking Strategy</p>
            <p className="text-sm text-blue-600">{generationStage}</p>
          </div>
        )}

        {/* Content */}
        {!isGenerating && linkingStrategy && (
          <>
            {/* Navigation Tabs */}
            <div className="px-6 border-b border-gray-200">
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
            <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'overview' && renderOverviewTab()}
              {activeTab === 'matrix' && renderMatrixTab()}
              {activeTab === 'implementation' && renderImplementationTab()}
              {activeTab === 'recommendations' && renderRecommendationsTab()}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {linkingStrategy.success ? (
                    <>
                      ✅ Strategy generated successfully • 
                      <span className="font-medium"> {linkingStrategy.strategy.totalLinks} links</span> • 
                      <span className="font-medium"> SEO Score: {linkingStrategy.strategy.seoScore.overall}</span>
                    </>
                  ) : (
                    <>❌ Strategy generation failed</>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  {linkingStrategy.success && (
                    <button
                      onClick={applyStrategy}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Apply Strategy
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InterlinkingStrategyModal;