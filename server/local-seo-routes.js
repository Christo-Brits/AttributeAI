const express = require('express');
const router = express.Router();

// Generate export for local SEO pages
router.post('/export', async (req, res) => {
  try {
    const { pages } = req.body;
    
    if (!pages || !Array.isArray(pages)) {
      return res.status(400).json({ error: 'Invalid pages data' });
    }
    
    const exportData = {
      timestamp: new Date().toISOString(),
      totalPages: pages.length,
      pages: pages.map(page => ({
        filename: `${page.service.name.toLowerCase().replace(/\s+/g, '-')}-${page.area.name.toLowerCase().replace(/\s+/g, '-')}.html`,
        title: page.content.title,
        content: generateHTMLContent(page),
        metadata: {
          service: page.service.name,
          area: `${page.area.name}, ${page.area.state}`,
          wordCount: page.content.wordCount,
          seoScore: page.content.seoScore,
          keywords: page.content.localSEO.keywords
        }
      }))
    };
    
    res.json(exportData);
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      error: 'Export failed', 
      details: error.message 
    });
  }
});

// Helper function to generate HTML content
function generateHTMLContent(page) {
  const { service, area, content } = page;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title}</title>
    <meta name="description" content="${content.metaDescription}">
    <meta name="keywords" content="${content.localSEO.keywords.join(', ')}">
    
    <!-- Local Business Schema -->
    <script type="application/ld+json">
    ${JSON.stringify(content.localSEO.schema, null, 2)}
    </script>
    
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 60px 20px; text-align: center; border-radius: 10px; margin-bottom: 40px; }
        .hero h1 { font-size: 3em; margin-bottom: 10px; }
        .hero p { font-size: 1.2em; margin-bottom: 30px; }
        .cta-button { background: #ff6b6b; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 1.1em; cursor: pointer; }
        .content-section { margin-bottom: 40px; }
        .benefits { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .benefit-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
        .local-info { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Hero Section -->
        <section class="hero">
            <h1>${content.heroSection.headline}</h1>
            <p>${content.heroSection.subheadline}</p>
            <button class="cta-button">${content.heroSection.cta}</button>
        </section>
        
        <!-- Main Content -->
        <section class="content-section">
            <h2>Professional ${service.name} Services in ${area.name}</h2>
            <p>${content.mainContent.introduction}</p>
        </section>
        
        <!-- Local Benefits -->
        <section class="content-section">
            <h2>Why Choose Our ${service.name} Services in ${area.name}?</h2>
            <div class="benefits">
                ${content.mainContent.localBenefits.map(benefit => 
                    `<div class="benefit-card">
                        <h3>✓ ${benefit.split(':')[0] || benefit}</h3>
                        <p>${benefit}</p>
                    </div>`
                ).join('')}
            </div>
        </section>
        
        <!-- Service Process -->
        <section class="content-section">
            <h2>Our ${service.name} Process for ${area.name} Businesses</h2>
            <p>${content.mainContent.serviceProcess}</p>
        </section>
        
        <!-- Local Information -->
        <section class="local-info">
            <h2>Serving ${area.name} and Surrounding Areas</h2>
            <p>We understand the unique needs of businesses in ${area.name}, ${area.state}. Our team is familiar with local regulations, market conditions, and community preferences.</p>
            <p><strong>Service Area:</strong> ${area.name} and surrounding communities</p>
            <p><strong>Demographics:</strong> ${area.demographics || 'Local businesses and professionals'}</p>
        </section>
        
        <!-- Contact Section -->
        <section class="content-section">
            <h2>Contact Us for ${service.name} in ${area.name}</h2>
            <p>Ready to get started? Contact our ${area.name} team today for a free consultation.</p>
            <button class="cta-button">Get Free Consultation</button>
        </section>
    </div>
</body>
</html>`;
}

module.exports = router;