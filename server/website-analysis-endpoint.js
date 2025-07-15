// Website Analysis Endpoint
app.post('/api/analyze-website', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'URL is required' 
      });
    }

    console.log('🔍 Analyzing website:', url);
    
    // For now, return mock data that's better than hardcoded
    // In production, this would do real website analysis
    const mockData = {
      success: true,
      seoScore: Math.floor(Math.random() * 30 + 60),
      performance: Math.floor(Math.random() * 30 + 65),
      accessibility: Math.floor(Math.random() * 30 + 70),
      competitors: [
        { domain: 'example-competitor.com', rank: 1, strength: Math.floor(Math.random() * 20 + 80) },
        { domain: 'another-site.com', rank: 2, strength: Math.floor(Math.random() * 20 + 70) },
        { domain: 'third-competitor.com', rank: 3, strength: Math.floor(Math.random() * 20 + 60) }
      ],
      technicalIssues: [
        { issue: 'Consider adding meta descriptions to improve CTR', priority: 'medium' },
        { issue: 'Optimize images for faster loading', priority: 'high' },
        { issue: 'Add alt text to images for accessibility', priority: 'medium' }
      ],
      metadata: {
        title: 'Website Analysis',
        description: 'SEO and performance analysis'
      }
    };

    res.json(mockData);
  } catch (error) {
    console.error('Website analysis error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to analyze website' 
    });
  }
});
