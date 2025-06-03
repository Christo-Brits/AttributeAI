import React, { useState } from 'react';
import { Button, Card, ProgressIndicator } from './ui/DesignSystem';

const SimpleWebsiteAnalyzer = () => {
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
      console.log('Starting analysis for:', url);
      
      const requestUrl = url.startsWith('http') ? url : `https://${url}`;
      console.log('Request URL:', requestUrl);
      
      const response = await fetch('http://localhost:3001/api/analyze-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: requestUrl }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setAnalysis(data.data);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze website');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="simple-analyzer">
      <div className="header-section">
        <h1>🔍 Website Analyzer</h1>
        <p>Test the real website analysis functionality</p>
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
            style={{ 
              width: '100%',
              padding: '12px',
              marginBottom: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <Button 
            onClick={analyzeWebsite}
            disabled={isLoading || !url.trim()}
            variant="primary"
            style={{ width: '100%' }}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Website'}
          </Button>
        </div>
        
        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            marginTop: '12px'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </Card>

      {isLoading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <ProgressIndicator />
            <p>Analyzing website...</p>
            <small>This may take a few seconds</small>
          </div>
        </Card>
      )}

      {analysis && (
        <Card>
          <h2>Analysis Results</h2>
          <div style={{ padding: '20px' }}>
            <h3>Basic Information</h3>
            <p><strong>URL:</strong> {analysis.url}</p>
            <p><strong>Title:</strong> {analysis.title || 'No title found'}</p>
            <p><strong>Meta Description:</strong> {analysis.metaDescription || 'No description found'}</p>
            
            <h3>Content Structure</h3>
            <p><strong>H1 Tags:</strong> {analysis.headings?.h1 || 0}</p>
            <p><strong>H2 Tags:</strong> {analysis.headings?.h2 || 0}</p>
            <p><strong>H3 Tags:</strong> {analysis.headings?.h3 || 0}</p>
            
            <h3>Images</h3>
            <p><strong>Total Images:</strong> {analysis.images?.total || 0}</p>
            <p><strong>Images with Alt Text:</strong> {analysis.images?.withAlt || 0}</p>
            
            <h3>Links</h3>
            <p><strong>Internal Links:</strong> {analysis.links?.internal || 0}</p>
            <p><strong>External Links:</strong> {analysis.links?.external || 0}</p>
            
            <h3>Performance</h3>
            <p><strong>Load Time:</strong> {analysis.loadTime}ms</p>
            <p><strong>Content Length:</strong> {analysis.textContent?.length || 0} characters</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SimpleWebsiteAnalyzer;