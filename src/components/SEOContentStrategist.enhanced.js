import React, { useState, useEffect, useRef } from 'react';
import { PenTool, FileText, Target, Eye, CheckCircle, Clock, Search, Zap, Image, ExternalLink, Brain, TrendingUp, Users, Globe, Sparkles, Video } from 'lucide-react';
import EnhancedContentService from '../services/EnhancedContentService';
import ContentPolishModal from './ContentPolishModal';
import VideoGenerationModal from './VideoGenerationModal';

const SEOContentStrategist = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [contentGaps, setContentGaps] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [contentType, setContentType] = useState('blog-post');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [contentResults, setContentResults] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportSuccess, setExportSuccess] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showPolishModal, setShowPolishModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const exportMenuRef = useRef(null);
  const enhancedContentService = new EnhancedContentService();

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = () => {
      try {
        const storedUser = localStorage.getItem('attributeai_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUserProfile(userData);
          
          // Automatically analyze content gaps if we have website data
          if (userData.website) {
            analyzeContentGaps(userData);
          }
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Analyze content gaps based on website and industry
  const analyzeContentGaps = async (userData) => {
    setIsAnalyzing(true);
    
    try {
      // First analyze the user's website
      let websiteAnalysis = null;
      if (userData.website) {
        const response = await fetch('/api/analyze-website', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: userData.website })
        });
        
        if (response.ok) {
          const result = await response.json();
          websiteAnalysis = result.data;
          setAnalysisResults(result.data);
        }
      }

      // Generate content gap analysis using AI
      const prompt = `
You are an expert content strategist analyzing a website for content gaps and opportunities.

WEBSITE ANALYSIS:
- Website: ${userData.website || 'Not provided'}
- Industry: ${userData.industry || 'Not specified'}
- Company: ${userData.company || 'Not provided'}
- Primary Goals: ${userData.goals ? userData.goals.join(', ') : 'Not specified'}
- Current Tools: ${userData.tools ? userData.tools.join(', ') : 'Not specified'}

${websiteAnalysis ? `
TECHNICAL ANALYSIS:
- Page Title: ${websiteAnalysis.title}
- Meta Description: ${websiteAnalysis.metaDescription || 'Missing'}
- H1 Tags: ${websiteAnalysis.headings?.h1 || 0}
- H2 Tags: ${websiteAnalysis.headings?.h2 || 0}
- Total Images: ${websiteAnalysis.images?.total || 0}
- Images with Alt Text: ${websiteAnalysis.images?.withAlt || 0}
- Internal Links: ${websiteAnalysis.links?.internal || 0}
- External Links: ${websiteAnalysis.links?.external || 0}
- Content Length: ~${Math.round((websiteAnalysis.textContent?.length || 0) / 6)} words
` : ''}

TASK: Identify 8-10 high-impact content opportunities that would:
1. Address gaps in their current content
2. Support their business goals
3. Target their industry keywords
4. Improve SEO performance
5. Attract their target audience

For each opportunity, provide:
- Topic/Keyword focus
- Content type recommendation
- Business impact reasoning
- SEO difficulty estimate (Low/Medium/High)
- Priority level (High/Medium/Low)

Format as a JSON array of objects with these fields:
{
  "topic": "string",
  "contentType": "Blog Post|Landing Page|Guide|Case Study|FAQ",
  "keyword": "primary keyword phrase",
  "businessImpact": "explanation of business value",
  "seoDifficulty": "Low|Medium|High",
  "priority": "High|Medium|Low",
  "reason": "why this content gap exists and opportunity details"
}

Return only the JSON array, no other text.`;

      const response = await fetch('/api/claude-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (response.ok) {
        const result = await response.json();
        try {
          const gaps = JSON.parse(result.content);
          setContentGaps(gaps);
        } catch (parseError) {
          console.error('Error parsing content gaps:', parseError);
          // Fallback to default suggestions
          setContentGaps(getDefaultContentGaps(userData));
        }
      } else {
        setContentGaps(getDefaultContentGaps(userData));
      }
    } catch (error) {
      console.error('Error analyzing content gaps:', error);
      setContentGaps(getDefaultContentGaps(userData));
    }
    
    setIsAnalyzing(false);
  };

  // Fallback content gaps based on industry
  const getDefaultContentGaps = (userData) => {
    const industry = userData.industry?.toLowerCase() || '';
    const goals = userData.goals || [];
    
    const gaps = [
      {
        topic: `${industry} Best Practices Guide`,
        contentType: 'Guide',
        keyword: `${industry} best practices`,
        businessImpact: 'Establish thought leadership and attract qualified leads',
        seoDifficulty: 'Medium',
        priority: 'High',
        reason: 'Educational content drives organic traffic and builds trust'
      },
      {
        topic: 'Customer Success Stories',
        contentType: 'Case Study',
        keyword: `${userData.company} customer success`,
        businessImpact: 'Build credibility and showcase real results',
        seoDifficulty: 'Low',
        priority: 'High',
        reason: 'Social proof content converts visitors into customers'
      }
    ];

    if (goals.includes('Increase Organic Traffic')) {
      gaps.push({
        topic: `How to Improve ${industry} SEO`,
        contentType: 'Blog Post',
        keyword: `${industry} SEO tips`,
        businessImpact: 'Attract businesses looking to improve their SEO',
        seoDifficulty: 'Medium',
        priority: 'High',
        reason: 'Aligns with user goal of increasing organic traffic'
      });
    }

    if (goals.includes('Better Attribution')) {
      gaps.push({
        topic: 'Marketing Attribution Explained',
        contentType: 'Guide',
        keyword: 'marketing attribution guide',
        businessImpact: 'Educate prospects on attribution value',
        seoDifficulty: 'Medium',
        priority: 'Medium',
        reason: 'Addresses specific user interest in attribution'
      });
    }

    return gaps;
  };

  // Generate content for selected topic using enhanced research
  const generateContent = async () => {
    const topic = selectedTopic || customTopic;
    if (!topic.trim()) {
      alert('Please select a topic or enter a custom topic');
      return;
    }

    setIsGenerating(true);
    setContentResults(null);
    setGenerationStage('Initializing enhanced content generation...');

    try {
      // Use the enhanced content service with Perplexity research
      setGenerationStage('Conducting real-time research...');
      
      const result = await enhancedContentService.generateEnhancedContent(
        userProfile?.website || '',
        topic,
        userProfile?.industry || 'professional services',
        contentType,
        userProfile
      );

      setGenerationStage('Finalizing content and metadata...');
      
      setContentResults({
        topic: topic,
        content: result.content,
        metadata: result.metadata,
        research: result.research,
        images: result.images,
        exports: result.exports,
        context: result.context,
        timestamp: new Date().toISOString(),
        type: contentType,
        targetAudience: targetAudience || result.context?.audience || 'Business professionals',
        website: userProfile?.website,
        enhanced: true
      });
      
      setGenerationStage('');
      console.log('✅ Enhanced content generation completed successfully');
      
    } catch (error) {
      console.error('Enhanced content generation error:', error);
      
      // Fallback to basic content generation
      setGenerationStage('Using fallback content generation...');
      
      try {
        const basicPrompt = `Create comprehensive SEO content about "${topic}" for a ${userProfile?.industry || 'business'} targeting ${targetAudience || 'professionals'}. Include title, meta description, and 1500+ word article with headings.`;
        
        const response = await fetch('/api/claude-generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: basicPrompt })
        });

        if (response.ok) {
          const basicResult = await response.json();
          setContentResults({
            topic: topic,
            content: basicResult.content,
            timestamp: new Date().toISOString(),
            type: contentType,
            targetAudience: targetAudience || 'Business professionals',
            website: userProfile?.website,
            fallback: true
          });
        } else {
          throw new Error('Both enhanced and fallback generation failed');
        }
      } catch (fallbackError) {
        console.error('Fallback generation also failed:', fallbackError);
        alert('Content generation failed. Please check your connection and try again.');
      }
      
      setGenerationStage('');
    }
    
    setIsGenerating(false);
  };

  // Export content in different formats
  const exportContent = async (format) => {
    if (!contentResults) return;

    try {
      const content = contentResults.content;
      let exportData;
      let filename;
      let mimeType;

      switch (format) {
        case 'html':
          exportData = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${contentResults.topic}</title>
    <meta name="description" content="Generated content for ${contentResults.topic}">
</head>
<body>
    ${content.replace(/\n/g, '<br>')}
</body>
</html>`;
          filename = `${contentResults.topic.replace(/[^a-z0-9]/gi, '_')}.html`;
          mimeType = 'text/html';
          break;
        
        case 'markdown':
          exportData = content;
          filename = `${contentResults.topic.replace(/[^a-z0-9]/gi, '_')}.md`;
          mimeType = 'text/markdown';
          break;
        
        case 'txt':
          exportData = content;
          filename = `${contentResults.topic.replace(/[^a-z0-9]/gi, '_')}.txt`;
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

      setExportSuccess(`Content exported as ${format.toUpperCase()}`);
      setTimeout(() => setExportSuccess(''), 3000);
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export content');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Brain className="mr-3 text-blue-600" size={32} />
                AI Content Strategist
              </h1>
              <p className="text-gray-600 mt-2">
                Generate high-quality content based on your website analysis and business goals
              </p>
            </div>
            {userProfile && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Website Analysis</p>
                <p className="font-medium">{userProfile.website}</p>
                <p className="text-sm text-gray-500">{userProfile.industry}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Content Gaps Analysis */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="mr-2 text-green-600" size={20} />
                Content Opportunities
              </h2>
              
              {isAnalyzing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing content gaps...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contentGaps.length > 0 ? (
                    contentGaps.map((gap, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedTopic === gap.topic
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTopic(gap.topic)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm">
                              {gap.topic}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {gap.contentType} • {gap.seoDifficulty} SEO
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {gap.reason}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            gap.priority === 'High' ? 'bg-red-100 text-red-700' :
                            gap.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {gap.priority}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Globe size={24} className="mx-auto mb-2" />
                      <p>Complete signup to analyze content gaps</p>
                    </div>
                  )}
                </div>
              )}
              
              {userProfile && (
                <button
                  onClick={() => analyzeContentGaps(userProfile)}
                  disabled={isAnalyzing}
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
                </button>
              )}
            </div>
          </div>

          {/* Content Generation */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <PenTool className="mr-2 text-purple-600" size={20} />
                Content Generator
              </h2>

              <div className="space-y-4 mb-6">
                
                {/* Topic Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Topic
                  </label>
                  {selectedTopic ? (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="font-medium text-blue-900">{selectedTopic}</span>
                      <button
                        onClick={() => setSelectedTopic('')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="Enter your content topic or keyword..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>

                {/* Content Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="blog-post">Blog Post</option>
                      <option value="landing-page">Landing Page</option>
                      <option value="guide">How-to Guide</option>
                      <option value="case-study">Case Study</option>
                      <option value="faq">FAQ Page</option>
                      <option value="product-page">Product Page</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g., Small business owners"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateContent}
                  disabled={isGenerating || (!selectedTopic && !customTopic.trim())}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      <span>Generate AI Content</span>
                    </>
                  )}
                </button>

                {/* Generation Progress */}
                {isGenerating && generationStage && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm font-medium">{generationStage}</p>
                  </div>
                )}
              </div>

              {/* Content Results */}
              {contentResults && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <CheckCircle className="mr-2 text-green-600" size={20} />
                      Generated Content
                    </h3>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowVideoModal(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                      >
                        <Video size={16} />
                        <span>Generate Video Scripts</span>
                      </button>
                      
                      <button
                        onClick={() => setShowPolishModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                      >
                        <Sparkles size={16} />
                        <span>Polish for Publication</span>
                      </button>
                      
                      <div className="relative" ref={exportMenuRef}>
                        <button
                          onClick={() => setShowExportMenu(!showExportMenu)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                        >
                          <ExternalLink size={16} />
                          <span>Export</span>
                        </button>
                        
                        {showExportMenu && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => exportContent('html')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Export as HTML
                              </button>
                              <button
                                onClick={() => exportContent('markdown')}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Export as Markdown
                            </button>
                            <button
                              onClick={() => exportContent('txt')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Export as Text
                            </button>
                          </div>
                        </div>
                        )}
                      </div>
                    </div>

                  <>
                    {exportSuccess && (
                      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-800 text-sm">{exportSuccess}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {contentResults.content}
                        </pre>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
                      <span>Generated: {new Date(contentResults.timestamp).toLocaleString()}</span>
                      <span>Type: {contentResults.type} • Target: {contentResults.targetAudience}</span>
                    </div>
                  </>
                </div>
              )}

              {/* Help Text */}
              {!userProfile && (
                <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <div className="flex items-start">
                    <Users className="text-yellow-600 mr-2 mt-1" size={16} />
                    <div>
                      <p className="text-yellow-800 text-sm font-medium">
                        Complete your signup for personalized content suggestions
                      </p>
                      <p className="text-yellow-700 text-xs mt-1">
                        Provide your website and business details to get AI-powered content gap analysis and targeted content recommendations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Polish Modal */}
      {showPolishModal && contentResults && (
        <ContentPolishModal
          content={contentResults.content}
          metadata={{
            keywords: contentResults.metadata?.focusKeyword || selectedTopic || customTopic,
            title: contentResults.metadata?.title,
            description: contentResults.metadata?.description,
            website: userProfile?.website
          }}
          onClose={() => setShowPolishModal(false)}
        />
      )}
      
      {/* Video Generation Modal */}
      {showVideoModal && contentResults && (
        <VideoGenerationModal
          content={contentResults.content}
          metadata={{
            keywords: contentResults.metadata?.focusKeyword || selectedTopic || customTopic,
            title: contentResults.metadata?.title,
            description: contentResults.metadata?.description,
            website: userProfile?.website
          }}
          onClose={() => setShowVideoModal(false)}
        />
      )}
    </>
  );
};

export default SEOContentStrategist;