import React, { useState } from 'react';
import { Button, Card, ProgressIndicator } from './ui/DesignSystem';

const SEOAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const analyzeWebsite = async () => {
    if (!url) {
      setError('Please enter a website URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('http://localhost:3001/api/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.startsWith('http') ? url : `https://${url}` }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze website');
      }

      setAnalysis(data);
      
      // Store results in DataBridge for unified dashboard
      window.dispatchEvent(new CustomEvent('dataBridgeUpdate', {
        detail: {
          tool: 'seo',
          data: {
            url: url,
            score: calculateSEOScore(data),
            analysis: data,
            timestamp: Date.now()
          }
        }
      }));

    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze website. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSEOScore = (data) => {
    let score = 0;
    let maxScore = 0;

    // Title analysis (20 points)
    maxScore += 20;
    if (data.title) {
      if (data.title.length >= 30 && data.title.length <= 60) score += 20;
      else if (data.title.length > 0) score += 10;
    }

    // Meta description (20 points)
    maxScore += 20;
    if (data.metaDescription) {
      if (data.metaDescription.length >= 120 && data.metaDescription.length <= 160) score += 20;
      else if (data.metaDescription.length > 0) score += 10;
    }

    // Headings structure (15 points)
    maxScore += 15;
    if (data.headings) {
      const { h1, h2, h3 } = data.headings;
      if (h1 > 0 && h1 <= 1) score += 8;
      if (h2 > 0) score += 4;
      if (h3 > 0) score += 3;
    }

    // Images with alt text (15 points)
    maxScore += 15;
    if (data.images) {
      const altTextRatio = data.images.withAlt / Math.max(data.images.total, 1);
      score += Math.round(altTextRatio * 15);
    }

    // Internal/External links (10 points)
    maxScore += 10;
    if (data.links && data.links.internal > 0) score += 5;
    if (data.links && data.links.external > 0) score += 5;

    // Performance indicators (20 points)
    maxScore += 20;
    if (data.loadTime && data.loadTime < 3000) score += 10;
    if (data.textContent && data.textContent.length > 300) score += 10;

    return Math.round((score / maxScore) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecommendations = (data) => {
    const recommendations = [];

    if (!data.title) {
      recommendations.push({ type: 'critical', text: 'Add a page title' });
    } else if (data.title.length < 30 || data.title.length > 60) {
      recommendations.push({ type: 'warning', text: `Title should be 30-60 characters (currently ${data.title.length})` });
    }

    if (!data.metaDescription) {
      recommendations.push({ type: 'critical', text: 'Add a meta description' });
    } else if (data.metaDescription.length < 120 || data.metaDescription.length > 160) {
      recommendations.push({ type: 'warning', text: `Meta description should be 120-160 characters (currently ${data.metaDescription.length})` });
    }

    if (data.headings) {
      if (data.headings.h1 === 0) {
        recommendations.push({ type: 'critical', text: 'Add an H1 heading' });
      } else if (data.headings.h1 > 1) {
        recommendations.push({ type: 'warning', text: 'Use only one H1 heading per page' });
      }

      if (data.headings.h2 === 0) {
        recommendations.push({ type: 'suggestion', text: 'Consider adding H2 headings to structure content' });
      }
    }

    if (data.images && data.images.total > 0) {
      const missingAlt = data.images.total - data.images.withAlt;
      if (missingAlt > 0) {
        recommendations.push({ type: 'warning', text: `${missingAlt} images missing alt text` });
      }
    }

    if (data.links && data.links.internal === 0) {
      recommendations.push({ type: 'suggestion', text: 'Add internal links to improve site navigation' });
    }

    if (data.textContent && data.textContent.length < 300) {
      recommendations.push({ type: 'warning', text: 'Page content seems thin. Consider adding more valuable content.' });
    }

    return recommendations;
  };

  return (
    <div className="seo-analyzer">
      <div className="header-section">
        <h1>🔍 SEO Analyzer</h1>
        <p>Analyze your website's SEO performance and get actionable recommendations</p>
      </div>

      <Card>
        <h2>Website Analysis</h2>
        <div className="input-group">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            disabled={isLoading}
          />
          <Button 
            onClick={analyzeWebsite}
            disabled={isLoading || !url.trim()}
            variant="primary"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Website'}
          </Button>
        </div>
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </Card>

      {isLoading && (
        <Card>
          <div className="loading-state">
            <ProgressIndicator />
            <p>Analyzing website SEO...</p>
            <small>This may take a few seconds</small>
          </div>
        </Card>
      )}

      {analysis && (
        <>
          {/* SEO Score Overview */}
          <Card>
            <h2>SEO Score</h2>
            <div className="score-overview">
              <div className={`score-circle ${getScoreColor(calculateSEOScore(analysis))}`}>
                <span className="score-number">{calculateSEOScore(analysis)}</span>
                <span className="score-label">/ 100</span>
              </div>
              <div className="score-details">
                <h3>Overall SEO Health</h3>
                <p>
                  {calculateSEOScore(analysis) >= 80 ? 'Excellent! Your website has strong SEO fundamentals.' :
                   calculateSEOScore(analysis) >= 60 ? 'Good foundation with room for improvement.' :
                   'Needs attention. Several SEO issues should be addressed.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Page Information */}
          <Card>
            <h2>Page Information</h2>
            <div className="page-info-grid">
              <div className="info-item">
                <h4>Title</h4>
                <p className="title-text">{analysis.title || 'No title found'}</p>
                <small>{analysis.title ? `${analysis.title.length} characters` : 'Missing'}</small>
              </div>
              <div className="info-item">
                <h4>Meta Description</h4>
                <p className="description-text">{analysis.metaDescription || 'No meta description found'}</p>
                <small>{analysis.metaDescription ? `${analysis.metaDescription.length} characters` : 'Missing'}</small>
              </div>
            </div>
          </Card>

          {/* Content Analysis */}
          <Card>
            <h2>Content Structure</h2>
            <div className="content-grid">
              <div className="metric-item">
                <h4>Headings</h4>
                <div className="headings-breakdown">
                  <span>H1: {analysis.headings?.h1 || 0}</span>
                  <span>H2: {analysis.headings?.h2 || 0}</span>
                  <span>H3: {analysis.headings?.h3 || 0}</span>
                  <span>H4: {analysis.headings?.h4 || 0}</span>
                </div>
              </div>
              <div className="metric-item">
                <h4>Images</h4>
                <div className="images-info">
                  <span>Total: {analysis.images?.total || 0}</span>
                  <span>With Alt Text: {analysis.images?.withAlt || 0}</span>
                  <span>Missing Alt: {(analysis.images?.total || 0) - (analysis.images?.withAlt || 0)}</span>
                </div>
              </div>
              <div className="metric-item">
                <h4>Links</h4>
                <div className="links-info">
                  <span>Internal: {analysis.links?.internal || 0}</span>
                  <span>External: {analysis.links?.external || 0}</span>
                </div>
              </div>
              <div className="metric-item">
                <h4>Content</h4>
                <div className="content-info">
                  <span>Text Length: {analysis.textContent?.length || 0} chars</span>
                  <span>Word Count: ~{Math.round((analysis.textContent?.length || 0) / 5)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card>
            <h2>Recommendations</h2>
            <div className="recommendations-list">
              {getRecommendations(analysis).map((rec, index) => (
                <div key={index} className={`recommendation-item ${rec.type}`}>
                  <span className="rec-icon">
                    {rec.type === 'critical' ? '🔴' : 
                     rec.type === 'warning' ? '🟡' : '💡'}
                  </span>
                  <span className="rec-text">{rec.text}</span>
                </div>
              ))}
              {getRecommendations(analysis).length === 0 && (
                <div className="no-recommendations">
                  <span className="success-icon">✅</span>
                  <span>Great! No major SEO issues found.</span>
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default SEOAnalyzer;