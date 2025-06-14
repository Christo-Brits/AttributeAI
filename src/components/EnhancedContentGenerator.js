import React, { useState, useEffect } from 'react';
import { DataBridge } from '../utils/DataBridge';
import './EnhancedContentGenerator.css';

const EnhancedContentGenerator = () => {
  const [contentType, setContentType] = useState('blog-post');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentLength, setContentLength] = useState('2000');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeModel, setActiveModel] = useState('');

  // Track generation stats
  const [todayGenerations, setTodayGenerations] = useState(0);
  const [totalGenerations, setTotalGenerations] = useState(0);

  useEffect(() => {
    loadGenerationStats();
  }, []);

  const loadGenerationStats = async () => {
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

  const updateGenerationStats = async () => {
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
    if (!targetKeyword.trim()) {
      alert('Please enter a target keyword');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedContent(null);

    try {
      // Multi-model content generation process
      const models = ['claude', 'gpt4', 'gemini'];
      const modelResults = {};
      
      for (let i = 0; i < models.length; i++) {
        const model = models[i];
        setActiveModel(model);
        setGenerationProgress(((i + 1) / models.length) * 100);
        
        try {
          const result = await generateWithModel(model);
          modelResults[model] = result;
        } catch (error) {
          console.error(`${model} generation failed:`, error);
          modelResults[model] = { error: error.message };
        }
        
        // Small delay between models
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Combine and optimize results
      const optimizedContent = await combineAndOptimize(modelResults);
      
      setGeneratedContent(optimizedContent);
      await updateGenerationStats();
      
      // Share with DataBridge for attribution tracking
      DataBridge.shareData('contentGeneration', {
        keyword: targetKeyword,
        type: contentType,
        wordCount: optimizedContent.wordCount,
        models: Object.keys(modelResults),
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Content generation error:', error);
      alert('Content generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setActiveModel('');
      setGenerationProgress(0);
    }
  };

  const generateWithModel = async (model) => {
    const endpoint = getModelEndpoint(model);
    const prompt = buildContentPrompt(model);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Generator': 'AttributeAI-Enhanced'
      },
      body: JSON.stringify({
        prompt,
        maxTokens: parseInt(contentLength) * 2, // Rough word-to-token conversion
        temperature: model === 'claude' ? 0.3 : model === 'gpt4' ? 0.7 : 0.5,
        model: model
      })
    });

    if (!response.ok) {
      throw new Error(`${model} API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content || data.text || data.response,
      model: model,
      wordCount: countWords(data.content || data.text || data.response),
      timestamp: Date.now()
    };
  };

  const getModelEndpoint = (model) => {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001' 
      : 'https://leafy-biscotti-c87e93.netlify.app';
    
    switch (model) {
      case 'claude':
        return `${baseUrl}/api/content/generate-claude`;
      case 'gpt4':
        return `${baseUrl}/api/content/generate-gpt4`;
      case 'gemini':
        return `${baseUrl}/api/content/generate-gemini`;
      default:
        return `${baseUrl}/api/content/generate`;
    }
  };

  const buildContentPrompt = (model) => {
    const basePrompt = `Create a ${contentLength}-word ${contentType} optimized for the keyword "${targetKeyword}".

Target Audience: ${targetAudience || 'General business audience'}
Tone: ${tone}
Content Type: ${contentType}

Requirements:
- SEO-optimized with natural keyword integration
- Engaging and valuable for readers
- Proper heading structure (H1, H2, H3)
- Include meta description and title tag suggestions
- Focus on E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
- Include actionable insights and examples`;

    // Model-specific enhancements
    switch (model) {
      case 'claude':
        return `${basePrompt}

CLAUDE FOCUS: Provide strategic insights, logical structure, and authoritative expertise. Focus on accuracy, depth, and professional credibility.`;

      case 'gpt4':
        return `${basePrompt}

GPT-4 FOCUS: Create engaging, creative content with compelling storytelling, varied sentence structure, and reader engagement. Focus on readability and flow.`;

      case 'gemini':
        return `${basePrompt}

GEMINI FOCUS: Incorporate current market trends, data-driven insights, and competitive intelligence. Focus on timely relevance and market context.`;

      default:
        return basePrompt;
    }
  };

  const combineAndOptimize = async (modelResults) => {
    // Check which models succeeded
    const successfulModels = Object.keys(modelResults).filter(
      model => modelResults[model] && !modelResults[model].error
    );

    if (successfulModels.length === 0) {
      throw new Error('All AI models failed to generate content');
    }

    // If only one model succeeded, use that result
    if (successfulModels.length === 1) {
      const model = successfulModels[0];
      return {
        ...modelResults[model],
        optimization: 'single-model',
        modelsUsed: [model],
        attributionScore: calculateAttributionScore(modelResults[model])
      };
    }

    // Multi-model optimization
    const primaryContent = modelResults[successfulModels[0]];
    const secondaryInsights = successfulModels.slice(1).map(model => modelResults[model]);

    return {
      content: primaryContent.content,
      wordCount: primaryContent.wordCount,
      model: 'multi-model-optimized',
      modelsUsed: successfulModels,
      alternativeVersions: secondaryInsights,
      optimization: 'multi-model',
      attributionScore: calculateAttributionScore(primaryContent),
      insights: {
        claude: modelResults.claude?.content ? 'Strategic analysis available' : null,
        gpt4: modelResults.gpt4?.content ? 'Creative variation available' : null,
        gemini: modelResults.gemini?.content ? 'Market intelligence available' : null
      },
      timestamp: Date.now()
    };
  };

  const calculateAttributionScore = (contentData) => {
    // Simple attribution scoring based on content characteristics
    const baseScore = 70;
    const wordCountBonus = Math.min((contentData.wordCount / 1000) * 5, 15);
    const modelBonus = contentData.model === 'claude' ? 10 : 5;
    
    return Math.round(baseScore + wordCountBonus + modelBonus);
  };

  const countWords = (text) => {
    return text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
  };

  const exportContent = (format) => {
    if (!generatedContent) return;

    let exportData;
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (format) {
      case 'markdown':
        exportData = `# ${targetKeyword} - Generated Content\n\n${generatedContent.content}`;
        downloadFile(`${targetKeyword}-${timestamp}.md`, exportData, 'text/markdown');
        break;
      case 'html':
        exportData = `<!DOCTYPE html>
<html>
<head>
    <title>${targetKeyword} - AttributeAI Generated</title>
    <meta name="description" content="Generated content for ${targetKeyword}">
</head>
<body>
    ${generatedContent.content.replace(/\n/g, '<br>')}
</body>
</html>`;
        downloadFile(`${targetKeyword}-${timestamp}.html`, exportData, 'text/html');
        break;
      case 'json':
        exportData = JSON.stringify({
          keyword: targetKeyword,
          contentType,
          generatedAt: timestamp,
          ...generatedContent
        }, null, 2);
        downloadFile(`${targetKeyword}-${timestamp}.json`, exportData, 'application/json');
        break;
    }
  };

  const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="enhanced-content-generator">
      {/* Header with Stats */}
      <div className="ecg-header">
        <div className="ecg-title">
          <h2>🚀 Enhanced Content Generator</h2>
          <p className="ecg-subtitle">Multi-Model AI • Unlimited Generation • Attribution Intelligence</p>
        </div>
        <div className="ecg-stats">
          <div className="ecg-stat">
            <div className="ecg-stat-number">{todayGenerations}</div>
            <div className="ecg-stat-label">Today</div>
          </div>
          <div className="ecg-stat">
            <div className="ecg-stat-number">∞</div>
            <div className="ecg-stat-label">Limit</div>
          </div>
          <div className="ecg-stat">
            <div className="ecg-stat-number">{totalGenerations}</div>
            <div className="ecg-stat-label">Total</div>
          </div>
        </div>
      </div>

      {/* Competitive Advantage Banner */}
      <div className="ecg-advantage-banner">
        <div className="ecg-advantage-content">
          <div className="ecg-advantage-text">
            <strong>🎯 Outrank.so Killer:</strong> Unlimited content generation with multi-model AI and attribution tracking
          </div>
          <div className="ecg-advantage-badges">
            <span className="ecg-badge claude">Claude Strategy</span>
            <span className="ecg-badge gpt4">GPT-4 Creative</span>
            <span className="ecg-badge gemini">Gemini Intelligence</span>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="ecg-config-panel">
        <div className="ecg-config-row">
          <div className="ecg-config-group">
            <label htmlFor="contentType" className="ecg-label">Content Type</label>
            <select 
              id="contentType"
              value={contentType} 
              onChange={(e) => setContentType(e.target.value)}
              className="ecg-select"
            >
              <option value="blog-post">📝 Blog Post</option>
              <option value="landing-page">🎯 Landing Page</option>
              <option value="product-description">🛍️ Product Description</option>
              <option value="email-sequence">📧 Email Sequence</option>
              <option value="social-media">📱 Social Media Content</option>
              <option value="video-script">🎥 Video Script</option>
              <option value="case-study">📊 Case Study</option>
              <option value="white-paper">📄 White Paper</option>
            </select>
          </div>

          <div className="ecg-config-group">
            <label htmlFor="targetKeyword" className="ecg-label">Target Keyword *</label>
            <input
              id="targetKeyword"
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="e.g., best SEO tools 2024"
              className="ecg-input"
            />
          </div>
        </div>

        <div className="ecg-config-row">
          <div className="ecg-config-group">
            <label htmlFor="targetAudience" className="ecg-label">Target Audience</label>
            <input
              id="targetAudience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., small business owners, marketers"
              className="ecg-input"
            />
          </div>

          <div className="ecg-config-group">
            <label htmlFor="contentLength" className="ecg-label">Content Length</label>
            <select 
              id="contentLength"
              value={contentLength} 
              onChange={(e) => setContentLength(e.target.value)}
              className="ecg-select"
            >
              <option value="800">📄 Short (800 words)</option>
              <option value="1500">📃 Medium (1,500 words)</option>
              <option value="2000">📰 Long (2,000 words)</option>
              <option value="3000">📚 Extended (3,000 words)</option>
              <option value="5000">📖 Comprehensive (5,000 words)</option>
            </select>
          </div>
        </div>

        <div className="ecg-config-row">
          <div className="ecg-config-group">
            <label htmlFor="tone" className="ecg-label">Content Tone</label>
            <select 
              id="tone"
              value={tone} 
              onChange={(e) => setTone(e.target.value)}
              className="ecg-select"
            >
              <option value="professional">👔 Professional</option>
              <option value="conversational">💬 Conversational</option>
              <option value="authoritative">🎯 Authoritative</option>
              <option value="friendly">😊 Friendly</option>
              <option value="technical">🔧 Technical</option>
              <option value="persuasive">💪 Persuasive</option>
            </select>
          </div>

          <div className="ecg-config-group">
            <div className="ecg-generation-button-container">
              <button 
                onClick={generateContent}
                disabled={isGenerating || !targetKeyword.trim()}
                className={`ecg-generate-btn ${isGenerating ? 'generating' : ''}`}
              >
                {isGenerating ? (
                  <div className="ecg-generating-content">
                    <div className="ecg-spinner"></div>
                    <span>Generating with {activeModel || 'AI'}...</span>
                  </div>
                ) : (
                  <span>🚀 Generate Multi-Model Content</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="ecg-progress-panel">
          <div className="ecg-progress-header">
            <span>Multi-Model Generation Progress</span>
            <span>{Math.round(generationProgress)}%</span>
          </div>
          <div className="ecg-progress-bar">
            <div 
              className="ecg-progress-fill"
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
          <div className="ecg-progress-models">
            <div className={`ecg-progress-model ${activeModel === 'claude' ? 'active' : generationProgress > 33 ? 'complete' : ''}`}>
              Claude Strategy
            </div>
            <div className={`ecg-progress-model ${activeModel === 'gpt4' ? 'active' : generationProgress > 66 ? 'complete' : ''}`}>
              GPT-4 Creative
            </div>
            <div className={`ecg-progress-model ${activeModel === 'gemini' ? 'active' : generationProgress === 100 ? 'complete' : ''}`}>
              Gemini Intelligence
            </div>
          </div>
        </div>
      )}

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="ecg-results-panel">
          <div className="ecg-results-header">
            <div className="ecg-results-title">
              <h3>✅ Generated Content</h3>
              <div className="ecg-results-meta">
                <span className="ecg-meta-item">
                  📊 {generatedContent.wordCount} words
                </span>
                <span className="ecg-meta-item">
                  🤖 {generatedContent.modelsUsed?.join(' + ') || generatedContent.model}
                </span>
                <span className="ecg-meta-item">
                  🎯 Attribution Score: {generatedContent.attributionScore}
                </span>
              </div>
            </div>
            <div className="ecg-export-buttons">
              <button 
                onClick={() => exportContent('markdown')}
                className="ecg-export-btn"
                title="Export as Markdown"
              >
                📝 MD
              </button>
              <button 
                onClick={() => exportContent('html')}
                className="ecg-export-btn"
                title="Export as HTML"
              >
                🌐 HTML
              </button>
              <button 
                onClick={() => exportContent('json')}
                className="ecg-export-btn"
                title="Export as JSON"
              >
                📋 JSON
              </button>
            </div>
          </div>

          {/* Content Preview */}
          <div className="ecg-content-preview">
            <div className="ecg-content-text">
              {generatedContent.content.split('\n').map((paragraph, index) => (
                <p key={index} className="ecg-content-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Multi-Model Insights */}
          {generatedContent.insights && (
            <div className="ecg-insights-panel">
              <h4>🧠 Multi-Model Insights</h4>
              <div className="ecg-insights-grid">
                {generatedContent.insights.claude && (
                  <div className="ecg-insight claude">
                    <div className="ecg-insight-header">Claude Strategy</div>
                    <div className="ecg-insight-text">{generatedContent.insights.claude}</div>
                  </div>
                )}
                {generatedContent.insights.gpt4 && (
                  <div className="ecg-insight gpt4">
                    <div className="ecg-insight-header">GPT-4 Creative</div>
                    <div className="ecg-insight-text">{generatedContent.insights.gpt4}</div>
                  </div>
                )}
                {generatedContent.insights.gemini && (
                  <div className="ecg-insight gemini">
                    <div className="ecg-insight-header">Gemini Intelligence</div>
                    <div className="ecg-insight-text">{generatedContent.insights.gemini}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedContentGenerator;
