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

export default EnhancedContentGenerator;export-buttons {
  display: flex;
  gap: 8px;
}

.ecg-export-btn {
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.ecg-export-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* Content Preview */
.ecg-content-preview {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  max-height: 400px;
  overflow-y: auto;
}

.ecg-content-text {
  line-height: 1.6;
  color: #374151;
}

.ecg-content-paragraph {
  margin-bottom: 12px;
  font-size: 14px;
}

.ecg-content-paragraph:last-child {
  margin-bottom: 0;
}

/* Insights Panel */
.ecg-insights-panel {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.ecg-insights-panel h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #374151;
}

.ecg-insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.ecg-insight {
  background: white;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #667eea;
}

.ecg-insight.claude {
  border-left-color: #8b4513;
}

.ecg-insight.gpt4 {
  border-left-color: #1976d2;
}

.ecg-insight.gemini {
  border-left-color: #4caf50;
}

.ecg-insight-header {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ecg-insight-text {
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 768px) {
  .enhanced-content-generator {
    padding: 15px;
  }
  
  .ecg-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .ecg-config-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .ecg-advantage-content {
    flex-direction: column;
    text-align: center;
  }
  
  .ecg-results-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .ecg-progress-models {
    flex-direction: column;
    gap: 8px;
  }
  
  .ecg-insights-grid {
    grid-template-columns: 1fr;
  }
}

/* Success States */
.ecg-success-indicator {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  background: #dcfce7;
  color: #166534;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

/* Loading States */
.ecg-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

/* Attribution Score Styling */
.ecg-attribution-score {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

/* Model Status Indicators */
.ecg-model-status {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.ecg-model-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

.ecg-model-indicator.success {
  background: #dcfce7;
  color: #166534;
}

.ecg-model-indicator.error {
  background: #fee2e2;
  color: #991b1b;
}

.ecg-model-indicator.pending {
  background: #fef3c7;
  color: #92400e;
}

/* Competitive Advantage Highlights */
.ecg-competitive-highlight {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  margin-left: 8px;
}

/* Professional Polish */
.ecg-feature-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

/* Hover Effects */
.ecg-interactive:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ecg-input,
.ecg-select {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.ecg-input:focus,
.ecg-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.ecg-generation-button-container {
  display: flex;
  align-items: flex-end;
  height: 100%;
}

.ecg-generate-btn {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ecg-generate-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.ecg-generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.ecg-generating-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ecg-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Progress Panel */
.ecg-progress-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.ecg-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.ecg-progress-bar {
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
}

.ecg-progress-fill {
  height: 100%;
  background: linear-gradient(45deg, #4CAF50, #45a049);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.ecg-progress-models {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.ecg-progress-model {
  flex: 1;
  padding: 8px;
  text-align: center;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: #f3f4f6;
  color: #6b7280;
  transition: all 0.3s;
}

.ecg-progress-model.active {
  background: #fbbf24;
  color: white;
}

.ecg-progress-model.complete {
  background: #10b981;
  color: white;
}

/* Results Panel */
.ecg-results-panel {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.ecg-results-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.ecg-results-title h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #374151;
}

.ecg-results-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.ecg-meta-item {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
}

.ecg-export-buttons {
  display: flex;
  gap: 8px;
}

.ecg-export-btn {
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.ecg-export-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* Content Preview */
.ecg-content-preview {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  max-height: 400px;
  overflow-y: auto;
}

.ecg-content-text {
  line-height: 1.6;
  color: #374151;
}

.ecg-content-paragraph {
  margin-bottom: 12px;
  font-size: 14px;
}

.ecg-content-paragraph:last-child {
  margin-bottom: 0;
}

/* Insights Panel */
.ecg-insights-panel {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.ecg-insights-panel h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #374151;
}

.ecg-insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.ecg-insight {
  background: white;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #667eea;
}

.ecg-insight.claude {
  border-left-color: #8b4513;
}

.ecg-insight.gpt4 {
  border-left-color: #1976d2;
}

.ecg-insight.gemini {
  border-left-color: #4caf50;
}

.ecg-insight-header {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ecg-insight-text {
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}

/* Responsive Design */
@media (max-width: 768px) {
  .enhanced-content-generator {
    padding: 15px;
  }
  
  .ecg-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .ecg-config-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .ecg-advantage-content {
    flex-direction: column;
    text-align: center;
  }
  
  .ecg-results-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .ecg-progress-models {
    flex-direction: column;
    gap: 8px;
  }
  
  .ecg-insights-grid {
    grid-template-columns: 1fr;
  }
}