import React, { useState, useEffect, useRef } from 'react';
import { PenTool, FileText, Target, Eye, CheckCircle, Clock, Search, Zap, Image, ExternalLink, Brain, TrendingUp, Users, Globe, Sparkles, Video, BarChart3, PlayCircle, Award, Wand2, Send, Calendar, X, Star } from 'lucide-react';
import EnhancedContentService from '../services/EnhancedContentService';
import ContentPolishModal from './ContentPolishModal';
import VideoGenerationModal from './VideoGenerationModal';
import ContentClusterResearch from './ContentClusterResearch';
import BatchContentDashboard from './BatchContentDashboard';
import ContentQualityAnalyzer from './ContentQualityAnalyzer';
import ContentOptimizationModal from './ContentOptimizationModal';
import ContentGradingService from '../services/ContentGradingService';
import PublishingPipeline from './PublishingPipeline';
import ContentPerformanceAnalytics from './ContentPerformanceAnalytics';

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
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [researchData, setResearchData] = useState(null);
  const [activeTab, setActiveTab] = useState('content-gaps');
  
  // New state for quality analysis
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);
  const [contentGrade, setContentGrade] = useState(null);
  const [showPublishingModal, setShowPublishingModal] = useState(false);
  const [showPerformanceAnalytics, setShowPerformanceAnalytics] = useState(false);
  
  const exportMenuRef = useRef(null);
  const enhancedContentService = new EnhancedContentService();
  const contentGradingService = new ContentGradingService();

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = () => {
      try {
        const storedUser = localStorage.getItem('attributeai_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);          setUserProfile(userData);
          
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
        const response = await fetch('/api/analyze-website', {          method: 'POST',
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

  // Handle research completion
  const handleResearchComplete = (research) => {
    setResearchData(research);
    console.log('✅ Research completed:', research);
    
    // Update content gaps based on research insights
    if (research.clusterRecommendations) {
      const newGaps = extractGapsFromResearch(research.clusterRecommendations);
      setContentGaps(newGaps);
    }
  };

  // Extract content gaps from research recommendations
  const extractGapsFromResearch = (recommendations) => {
    const gaps = [];
    
    // Extract from pillar content
    if (recommendations.pillar_content) {
      recommendations.pillar_content.forEach(item => {
        gaps.push({
          topic: item.title,
          contentType: item.content_type || 'Guide',
          keyword: item.target_keyword,
          businessImpact: item.brief,
          seoDifficulty: item.difficulty,
          priority: item.business_value,
          reason: 'Identified through comprehensive research analysis'
        });
      });
    }
    
    // Extract from supporting content
    if (recommendations.supporting_content) {
      recommendations.supporting_content.slice(0, 5).forEach(item => {
        gaps.push({
          topic: item.title,
          contentType: item.content_type || 'Article',
          keyword: item.target_keyword,
          businessImpact: item.brief,
          seoDifficulty: item.difficulty,
          priority: item.business_value,
          reason: 'Supporting content opportunity from research'
        });
      });
    }
    
    return gaps.length > 0 ? gaps : contentGaps;
  };
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

  // Handle quality analysis updates
  const handleQualityUpdate = (analysis) => {
    setQualityAnalysis(analysis);
    console.log('Quality analysis updated:', analysis);
  };

  // Handle optimized content from optimization modal
  const handleOptimizedContent = (optimizedContent) => {
    if (contentResults) {
      setContentResults({
        ...contentResults,
        content: optimizedContent,
        optimized: true,
        optimizedAt: new Date().toISOString()
      });
      
      // Trigger re-analysis of the optimized content
      setTimeout(() => {
        if (qualityAnalysis) {
          // Re-analyze the optimized content
          handleQualityUpdate(null); // Reset first
        }
      }, 500);
    }
  };

  // Grade content using AI
  const gradeContent = async () => {
    if (!contentResults?.content) return;
    
    try {
      const keywords = contentResults.topic ? [contentResults.topic] : [];
      const industry = userProfile?.industry || 'general';
      const audience = contentResults.targetAudience || 'general';
      
      const grade = await contentGradingService.gradeContent(
        contentResults.content,
        keywords,
        industry,
        audience
      );
      
      setContentGrade(grade);
      console.log('Content grade:', grade);
    } catch (error) {
      console.error('Content grading failed:', error);
    }
  };

  // Trigger grading when content is generated
  useEffect(() => {
    if (contentResults?.content && !contentGrade) {
      gradeContent();
    }
  }, [contentResults]);

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

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('content-gaps')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content-gaps' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Content Generator
              </button>
              <button
                onClick={() => setActiveTab('advanced-research')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'advanced-research' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Advanced Research
              </button>
              <button
                onClick={() => setActiveTab('batch-generation')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'batch-generation' 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Batch Generation
              </button>
              <button
                onClick={() => setActiveTab('performance-analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'performance-analytics' 
                    ? 'border-orange-500 text-orange-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Performance Analytics
              </button>
            </nav>
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
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => setSelectedTopic(gap)}
                      >
                        <div className="font-medium text-blue-900">{gap}</div>
                        <div className="text-xs text-blue-600 mt-1">Click to use as topic</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p>No content gaps identified yet</p>
                      <p className="text-sm">Complete your profile to get personalized suggestions</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Content Generator */}
          <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <PenTool className="mr-2 text-purple-600" size={20} />
                  Quick Content Generator
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

                {/* Batch Generation Notice */}
                {!researchData && userProfile && (
                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50 mb-6">
                    <div className="flex items-start">
                      <PlayCircle className="text-purple-600 mr-2 mt-1" size={16} />
                      <div>
                        <p className="text-purple-800 text-sm font-medium">
                          Upgrade to Batch Content Generation
                        </p>
                        <p className="text-purple-700 text-xs mt-1">
                          Generate complete content clusters with advanced research, automated interlinking, and strategic publishing schedules.
                        </p>
                        <button
                          onClick={() => setActiveTab('batch-generation')}
                          className="mt-2 text-purple-600 hover:text-purple-800 text-xs font-medium"
                        >
                          Start Batch Generation →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Results */}
                {contentResults && (
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <CheckCircle className="mr-2 text-green-600" size={20} />
                        Generated Content
                      </h3>
                      
                      <div className="flex items-center gap-3">
                        {/* Publish Content Button */}
                        <button
                          onClick={() => setShowPublishingModal(true)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                        >
                          <Send size={16} />
                          <span>Publish Content</span>
                        </button>

                        {/* Quality Analysis Button */}
                        <button
                          onClick={() => setShowOptimizationModal(true)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                        >
                          <Wand2 size={16} />
                          <span>Optimize Quality</span>
                        </button>

                        {/* Performance Analytics Button */}
                        <button
                          onClick={() => setActiveTab('performance-analytics')}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                        >
                          <BarChart3 size={16} />
                          <span>View Analytics</span>
                        </button>
                        
                        <button
                          onClick={() => setShowVideoModal(true)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                        >
                          <Video size={16} />
                          <span>Generate Video Scripts</span>
                        </button>
                        
                        <button
                          onClick={() => setShowPolishModal(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
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
                    </div>
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

                    {/* Content Quality Analysis */}
                    <div className="mt-6">
                      <ContentQualityAnalyzer
                        content={contentResults.content}
                        targetKeywords={contentResults.topic ? [contentResults.topic] : []}
                        onQualityUpdate={handleQualityUpdate}
                      />
                    </div>

                    {/* Content Grade Display */}
                    {contentGrade && (
                      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Award className="h-5 w-5 text-indigo-600 mr-2" />
                            Content Grade Report
                          </h4>
                          <div className="text-center">
                            <div className={`text-3xl font-bold ${
                              contentGrade.overallScore >= 85 ? 'text-green-600' :
                              contentGrade.overallScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {contentGrade.grade}
                            </div>
                            <div className="text-sm text-gray-600">{contentGrade.overallScore}/100</div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{contentGrade.gradeDescription}</p>
                        
                        {contentGrade.strengths && contentGrade.strengths.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-green-800 mb-2">Strengths:</h5>
                            <div className="flex flex-wrap gap-2">
                              {contentGrade.strengths.map((strength, index) => (
                                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                  {strength.area}: {strength.score}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {contentGrade.weaknesses && contentGrade.weaknesses.length > 0 && (
                          <div>
                            <h5 className="font-medium text-red-800 mb-2">Areas for Improvement:</h5>
                            <div className="space-y-1">
                              {contentGrade.weaknesses.slice(0, 3).map((weakness, index) => (
                                <div key={index} className="text-sm text-red-700">
                                  • {weakness.description} (Score: {weakness.score})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Advanced Research Tab */}
        {activeTab === 'advanced-research' && (
          <ContentClusterResearch 
            onResearchComplete={handleResearchComplete}
            initialTopic={selectedTopic || customTopic}
            userProfile={userProfile}
          />
        )}

        {/* Batch Generation Tab */}
        {activeTab === 'batch-generation' && (
          <BatchContentDashboard 
            researchData={researchData}
            userProfile={userProfile}
            onComplete={(result) => {
              console.log('Batch generation completed:', result);
              // Handle batch generation completion
            }}
          />
        )}

        {/* Content Generator Tab */}
        {activeTab === 'content-generator' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <PenTool className="mr-2 text-purple-600" size={20} />
              Enhanced Content Generator
              {researchData && (
                <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  Research Enhanced
                </span>
              )}
            </h2>
            
            {/* Content generator interface would go here */}
            <div className="text-center py-12 text-gray-500">
              <PenTool size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Enhanced Content Generator</h3>
              <p className="text-gray-600 mb-4">Advanced content generation with research integration coming soon.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setActiveTab('content-gaps')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Use Quick Generator
                </button>
                <button
                  onClick={() => setActiveTab('batch-generation')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Start Batch Generation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Performance Analytics Tab */}
        {activeTab === 'performance-analytics' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="mr-2 text-green-600" size={20} />
                Content Performance Analytics
              </h2>
              <button
                onClick={() => setShowPerformanceAnalytics(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <BarChart3 size={16} />
                <span>View Full Analytics</span>
              </button>
            </div>
            
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Content</p>
                    <p className="text-2xl font-bold text-blue-900">47</p>
                    <p className="text-xs text-blue-700 mt-1">Published pieces</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Avg Performance</p>
                    <p className="text-2xl font-bold text-green-900">78.4</p>
                    <p className="text-xs text-green-700 mt-1">Performance score</p>
                  </div>
                  <Award className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">Total Views</p>
                    <p className="text-2xl font-bold text-orange-900">124.5K</p>
                    <p className="text-xs text-orange-700 mt-1">Last 30 days</p>
                  </div>
                  <Eye className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Top Performing Content */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">Top Performer</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <p className="text-gray-600 text-sm">Title</p>
                  <p className="font-medium">Complete Guide to Multi-Touch Attribution</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Performance Score</p>
                  <p className="font-bold text-green-600">94.2</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Views</p>
                  <p className="font-medium">15.4K</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Performance Insights
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Guide-format content shows 34% better engagement than blog posts
                </p>
                <button 
                  onClick={() => setShowPerformanceAnalytics(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Detailed Analysis →
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  Quick Wins
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  3 pieces of content show declining engagement trends
                </p>
                <button 
                  onClick={() => setActiveTab('content-gaps')}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Generate New Content →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Text for non-users */}
        {!userProfile && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <Users className="text-yellow-600 mr-2 mt-1" size={16} />
              <div>
                <p className="text-yellow-800 text-sm font-medium">
                  Complete your signup for personalized content suggestions
                </p>
                <p className="text-yellow-700 text-xs mt-1">
                  Provide your website and business details to get AI-powered content gap analysis, advanced research capabilities, and batch content generation.
                </p>
              </div>
            </div>
          </div>
        )}
        
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

        {/* Content Optimization Modal */}
        {showOptimizationModal && contentResults && (
          <ContentOptimizationModal
            isOpen={showOptimizationModal}
            onClose={() => setShowOptimizationModal(false)}
            content={contentResults.content}
            qualityAnalysis={qualityAnalysis}
            targetKeywords={contentResults.topic ? [contentResults.topic] : []}
            onOptimizedContent={handleOptimizedContent}
          />
        )}

        {/* Publishing Pipeline Modal */}
        {showPublishingModal && contentResults && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Publish Content</h2>
                  <p className="text-gray-600">Distribute your content across multiple platforms</p>
                </div>
                <button
                  onClick={() => setShowPublishingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
                <PublishingPipeline
                  content={{
                    title: contentResults.metadata?.title || contentResults.topic || 'Generated Content',
                    content: contentResults.content,
                    excerpt: contentResults.metadata?.description || '',
                    tags: contentResults.topic ? [contentResults.topic] : [],
                    type: contentResults.type || 'blog-post',
                    seoTitle: contentResults.metadata?.title,
                    seoDescription: contentResults.metadata?.description,
                    website: userProfile?.website
                  }}
                  onPublishComplete={(result) => {
                    console.log('Published successfully:', result);
                    setShowPublishingModal(false);
                    // Show success message or update UI
                  }}
                  onClose={() => setShowPublishingModal(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Performance Analytics Modal */}
        {showPerformanceAnalytics && (
          <ContentPerformanceAnalytics
            isOpen={showPerformanceAnalytics}
            onClose={() => setShowPerformanceAnalytics(false)}
            contentData={contentResults}
          />
        )}
      </div>
    </div>
  );
};

export default SEOContentStrategist;