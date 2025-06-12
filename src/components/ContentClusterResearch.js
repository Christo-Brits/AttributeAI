import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Target, 
  TrendingUp, 
  Users, 
  FileText, 
  Globe, 
  Brain, 
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Lightbulb,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import AdvancedResearchService from '../services/AdvancedResearchService';

const ContentClusterResearch = ({ onResearchComplete, initialTopic = '', userProfile = null }) => {
  const [researchTopic, setResearchTopic] = useState(initialTopic);
  const [isResearching, setIsResearching] = useState(false);
  const [researchStage, setResearchStage] = useState('');
  const [researchResults, setResearchResults] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [showDetails, setShowDetails] = useState(false);
  
  const researchService = new AdvancedResearchService();

  useEffect(() => {
    if (initialTopic && initialTopic !== researchTopic) {
      setResearchTopic(initialTopic);
    }
  }, [initialTopic]);

  // Conduct comprehensive research
  const conductResearch = async () => {
    if (!researchTopic.trim()) {
      alert('Please enter a research topic');
      return;
    }

    setIsResearching(true);
    setResearchResults(null);
    setResearchStage('Initializing comprehensive research...');

    try {
      const clusterContext = {
        industry: userProfile?.industry || 'general',
        location: userProfile?.location || { country: 'New Zealand', city: 'Auckland' },
        targetAudience: userProfile?.targetAudience || 'business professionals',
        goals: userProfile?.goals || ['content marketing', 'SEO']
      };

      setResearchStage('Planning research phases...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setResearchStage('Conducting market analysis...');
      const research = await researchService.conductComprehensiveResearch(
        researchTopic,
        clusterContext,
        userProfile
      );

      setResearchStage('Synthesizing insights...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      setResearchResults(research);
      
      if (onResearchComplete) {
        onResearchComplete(research);
      }

      console.log('✅ Content cluster research completed successfully');

    } catch (error) {
      console.error('Research failed:', error);
      alert('Research failed. Please check your connection and try again.');
    }

    setIsResearching(false);
    setResearchStage('');
  };

  // Export research results
  const exportResearch = (format) => {
    if (!researchResults) return;

    let exportData;
    let filename;
    let mimeType;

    switch (format) {
      case 'json':
        exportData = JSON.stringify(researchResults, null, 2);
        filename = `${researchTopic.replace(/[^a-z0-9]/gi, '_')}_research.json`;
        mimeType = 'application/json';
        break;
      case 'csv':
        exportData = convertToCSV(researchResults);
        filename = `${researchTopic.replace(/[^a-z0-9]/gi, '_')}_research.csv`;
        mimeType = 'text/csv';
        break;
      case 'txt':
        exportData = convertToText(researchResults);
        filename = `${researchTopic.replace(/[^a-z0-9]/gi, '_')}_research.txt`;
        mimeType = 'text/plain';
        break;
      default:
        return;
    }

    const blob = new Blob([exportData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Convert research to CSV format
  const convertToCSV = (research) => {
    const lines = [];
    lines.push('Phase,Query,Summary,Key Findings,Sources');
    
    Object.entries(research.results || {}).forEach(([phase, data]) => {
      if (data.results) {
        data.results.forEach(result => {
          lines.push([
            phase,
            result.query || '',
            data.summary || '',
            data.keyFindings?.map(f => f.finding).join('; ') || '',
            data.sources?.map(s => s.domain).join('; ') || ''
          ].map(field => `"${field.replace(/"/g, '""')}"`).join(','));
        });
      }
    });
    
    return lines.join('\n');
  };

  // Convert research to text format
  const convertToText = (research) => {
    let text = `COMPREHENSIVE RESEARCH REPORT\n`;
    text += `Topic: ${research.topic}\n`;
    text += `Date: ${new Date(research.timestamp).toLocaleString()}\n`;
    text += `\n${'='.repeat(50)}\n\n`;

    // Add insights
    if (research.insights) {
      text += `STRATEGIC INSIGHTS\n`;
      text += `${'-'.repeat(20)}\n`;
      if (typeof research.insights === 'string') {
        text += `${research.insights}\n\n`;
      } else {
        Object.entries(research.insights).forEach(([key, value]) => {
          text += `${key.toUpperCase().replace(/_/g, ' ')}: ${value}\n`;
        });
        text += '\n';
      }
    }

    // Add phase results
    Object.entries(research.results || {}).forEach(([phase, data]) => {
      text += `${phase.toUpperCase()} PHASE\n`;
      text += `${'-'.repeat(phase.length + 6)}\n`;
      text += `Summary: ${data.summary || 'No summary available'}\n\n`;
      
      if (data.keyFindings && data.keyFindings.length > 0) {
        text += `Key Findings:\n`;
        data.keyFindings.forEach((finding, index) => {
          text += `${index + 1}. ${finding.finding}\n`;
        });
        text += '\n';
      }
    });

    return text;
  };

  // Render research phase tabs
  const renderPhaseTabs = () => {
    if (!researchResults?.results) return null;

    const phases = Object.keys(researchResults.results);
    
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedPhase('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedPhase === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <BarChart3 size={16} className="inline mr-2" />
          Overview
        </button>
        
        {phases.map(phase => (
          <button
            key={phase}
            onClick={() => setSelectedPhase(phase)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPhase === phase
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {getPhaseIcon(phase)}
            {formatPhaseName(phase)}
          </button>
        ))}
      </div>
    );
  };

  // Get icon for research phase
  const getPhaseIcon = (phase) => {
    const icons = {
      marketAnalysis: <BarChart3 size={16} className="inline mr-2" />,
      competitorAnalysis: <Target size={16} className="inline mr-2" />,
      contentGapAnalysis: <FileText size={16} className="inline mr-2" />,
      trendAnalysis: <TrendingUp size={16} className="inline mr-2" />,
      regulatoryAnalysis: <Globe size={16} className="inline mr-2" />
    };
    return icons[phase] || <Search size={16} className="inline mr-2" />;
  };

  // Format phase name for display
  const formatPhaseName = (phase) => {
    return phase
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Render overview tab
  const renderOverview = () => {
    if (!researchResults) return null;

    return (
      <div className="space-y-6">
        {/* Research Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
            <Brain className="mr-2" size={20} />
            Research Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.keys(researchResults.results || {}).length}
              </div>
              <div className="text-sm text-blue-700">Research Phases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(researchResults.results || {})
                  .reduce((total, phase) => total + (phase.sources?.length || 0), 0)}
              </div>
              <div className="text-sm text-green-700">Sources Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.values(researchResults.results || {})
                  .reduce((total, phase) => total + (phase.keyFindings?.length || 0), 0)}
              </div>
              <div className="text-sm text-purple-700">Key Insights</div>
            </div>
          </div>
        </div>

        {/* Strategic Insights */}
        {researchResults.insights && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="mr-2 text-yellow-500" size={20} />
              Strategic Insights
            </h3>
            {typeof researchResults.insights === 'string' ? (
              <div className="prose max-w-none text-gray-700">
                <pre className="whitespace-pre-wrap font-sans">{researchResults.insights}</pre>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(researchResults.insights).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {key.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-gray-700 mt-1">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Cluster Recommendations */}
        {researchResults.clusterRecommendations && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Target className="mr-2 text-green-500" size={20} />
              Content Cluster Strategy
            </h3>
            {renderClusterRecommendations(researchResults.clusterRecommendations)}
          </div>
        )}
      </div>
    );
  };

  // Render cluster recommendations
  const renderClusterRecommendations = (recommendations) => {
    if (typeof recommendations === 'string') {
      return (
        <div className="prose max-w-none text-gray-700">
          <pre className="whitespace-pre-wrap font-sans">{recommendations}</pre>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Pillar Content */}
        {recommendations.pillar_content && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <FileText className="mr-2 text-blue-500" size={16} />
              Pillar Content (Comprehensive Guides)
            </h4>
            <div className="space-y-3">
              {recommendations.pillar_content.map((item, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-blue-900">{item.title}</h5>
                      <p className="text-sm text-blue-700 mt-1">{item.brief}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                        <span>Keyword: {item.target_keyword}</span>
                        <span>Difficulty: {item.difficulty}</span>
                        <span>Value: {item.business_value}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supporting Content */}
        {recommendations.supporting_content && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <ArrowRight className="mr-2 text-green-500" size={16} />
              Supporting Content (Detailed Articles)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.supporting_content.map((item, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h5 className="font-medium text-green-900 text-sm">{item.title}</h5>
                  <p className="text-xs text-green-700 mt-1">{item.brief}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                    <span>{item.difficulty}</span>
                    <span>•</span>
                    <span>{item.business_value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rapid Content */}
        {recommendations.rapid_content && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Zap className="mr-2 text-purple-500" size={16} />
              Rapid Content (Quick Answers)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {recommendations.rapid_content.slice(0, 6).map((item, index) => (
                <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h5 className="font-medium text-purple-900 text-sm">{item.title}</h5>
                  <div className="text-xs text-purple-600 mt-1">
                    {item.target_keyword}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render phase details
  const renderPhaseDetails = (phase) => {
    const phaseData = researchResults.results[phase];
    if (!phaseData) return <div>No data available for this phase</div>;

    return (
      <div className="space-y-6">
        {/* Phase Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            {formatPhaseName(phase)} Summary
          </h3>
          <p className="text-gray-700">{phaseData.summary || 'No summary available'}</p>
        </div>

        {/* Key Findings */}
        {phaseData.keyFindings && phaseData.keyFindings.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Key Findings</h3>
            <div className="space-y-3">
              {phaseData.keyFindings.map((finding, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <p className="text-gray-700">{finding.finding}</p>
                  {finding.source && (
                    <p className="text-sm text-gray-500 mt-1">
                      Source: {finding.source}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Queries */}
        {phaseData.results && phaseData.results.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Research Queries</h3>
            <div className="space-y-4">
              {phaseData.results.map((result, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{result.query}</h4>
                  {result.data && result.data.summary && (
                    <p className="text-gray-700 mt-2 text-sm">{result.data.summary}</p>
                  )}
                  {result.data && result.data.sources && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        Sources: {result.data.sources.slice(0, 3).map(s => s.domain).join(', ')}
                        {result.data.sources.length > 3 && ` and ${result.data.sources.length - 3} more`}
                      </p>
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Search className="mr-3 text-blue-600" size={32} />
              Content Cluster Research
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive multi-source research for content strategy development
            </p>
          </div>
          {researchResults && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => exportResearch('json')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export JSON</span>
              </button>
              <button
                onClick={() => exportResearch('txt')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Download size={16} />
                <span>Export Report</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Research Input */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Research Topic
            </label>
            <input
              type="text"
              value={researchTopic}
              onChange={(e) => setResearchTopic(e.target.value)}
              placeholder="Enter topic for comprehensive research (e.g., 'digital marketing services')"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isResearching}
            />
          </div>
          <button
            onClick={conductResearch}
            disabled={isResearching || !researchTopic.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isResearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Researching...</span>
              </>
            ) : (
              <>
                <Brain size={16} />
                <span>Start Research</span>
              </>
            )}
          </button>
        </div>

        {/* Research Progress */}
        {isResearching && researchStage && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="text-blue-600 mr-2" size={16} />
              <p className="text-blue-800 font-medium">{researchStage}</p>
            </div>
            <div className="mt-2 bg-blue-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Research Results */}
      {researchResults && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Research Results</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle className="text-green-500" size={16} />
              <span>Completed: {new Date(researchResults.timestamp).toLocaleString()}</span>
            </div>
          </div>

          {/* Phase Navigation */}
          {renderPhaseTabs()}

          {/* Content Area */}
          <div className="mt-6">
            {selectedPhase === 'overview' 
              ? renderOverview() 
              : renderPhaseDetails(selectedPhase)
            }
          </div>
        </div>
      )}

      {/* Help Information */}
      {!researchResults && !isResearching && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="mr-2 text-yellow-500" size={20} />
            How Content Cluster Research Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <BarChart3 className="text-blue-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">Market Analysis</h4>
                <p className="text-sm text-gray-600">Analyzes market size, trends, and opportunities</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Target className="text-green-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">Competitor Research</h4>
                <p className="text-sm text-gray-600">Identifies competitors and content gaps</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <TrendingUp className="text-purple-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">Trend Analysis</h4>
                <p className="text-sm text-gray-600">Discovers emerging trends and innovations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FileText className="text-orange-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">Content Strategy</h4>
                <p className="text-sm text-gray-600">Generates content cluster recommendations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="text-indigo-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">Audience Insights</h4>
                <p className="text-sm text-gray-600">Understands target audience needs</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Globe className="text-cyan-500 mt-1" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">Regulatory Analysis</h4>
                <p className="text-sm text-gray-600">Identifies compliance requirements</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentClusterResearch;