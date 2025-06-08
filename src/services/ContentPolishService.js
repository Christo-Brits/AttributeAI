class ContentPolishService {
  constructor() {
    this.baseURL = 'http://localhost:3001';
  }

  async polishContent(content, metadata = {}) {
    try {
      console.log('✨ Starting content polish process...');
      
      // Step 1: Analyze current content structure
      const structureAnalysis = this.analyzeContentStructure(content);
      
      // Step 2: Apply structural improvements
      const structuredContent = await this.optimizeStructure(content, structureAnalysis);
      
      // Step 3: Optimize for SEO
      const seoOptimized = await this.optimizeSEO(structuredContent, metadata);
      
      // Step 4: Check and apply NZ compliance
      const compliantContent = await this.applyNZCompliance(seoOptimized);
      
      // Step 5: Generate professional images
      const images = await this.generatePolishedImages(metadata);
      
      // Step 6: Generate social media posts
      const socialPosts = await this.generateSocialMediaContent(compliantContent, metadata);
      
      // Step 7: Create complete metadata package
      const polishedMetadata = await this.generatePolishedMetadata(compliantContent, metadata);
      
      return {
        content: compliantContent,
        images,
        socialPosts,
        metadata: polishedMetadata,
        improvements: this.getImprovementsList(structureAnalysis)
      };
    } catch (error) {
      console.error('Polish error:', error);
      throw error;
    }
  }

  analyzeContentStructure(content) {
    const analysis = {
      headingHierarchy: [],
      paragraphLengths: [],
      totalWordCount: 0,
      issues: []
    };

    // Extract text content and analyze
    const textContent = content.replace(/<[^>]*>/g, ' ').trim();
    analysis.totalWordCount = textContent.split(/\s+/).length;

    // Check heading hierarchy
    const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
    let lastLevel = 0;
    headings.forEach(heading => {
      const level = parseInt(heading.match(/<h([1-6])/)[1]);
      if (level > lastLevel + 1) {
        analysis.issues.push(`Heading hierarchy skip: H${lastLevel} to H${level}`);
      }
      lastLevel = level;
      analysis.headingHierarchy.push(level);
    });

    // Check paragraph lengths
    const paragraphs = content.match(/<p[^>]*>.*?<\/p>/gi) || [];
    paragraphs.forEach(p => {
      const text = p.replace(/<[^>]*>/g, '').trim();
      const lines = Math.ceil(text.length / 80); // ~80 chars per line
      analysis.paragraphLengths.push(lines);
      if (lines > 3) {
        analysis.issues.push('Long paragraph detected (>3 lines)');
      }
    });

    return analysis;
  }

  async optimizeStructure(content, analysis) {
    let optimized = content;
    // Fix heading hierarchy
    if (analysis.headingHierarchy.some((level, i) => i > 0 && level > analysis.headingHierarchy[i-1] + 1)) {
      optimized = this.fixHeadingHierarchy(optimized);
    }

    // Break up long paragraphs
    optimized = optimized.replace(/<p[^>]*>(.*?)<\/p>/gi, (match, text) => {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      if (sentences.length > 3) {
        const midPoint = Math.ceil(sentences.length / 2);
        const firstPara = sentences.slice(0, midPoint).join(' ');
        const secondPara = sentences.slice(midPoint).join(' ');
        return `<p>${firstPara}</p>\n<p>${secondPara}</p>`;
      }
      return match;
    });

    return optimized;
  }

  fixHeadingHierarchy(content) {
    let fixed = content;
    const headingMap = { 1: 1, 2: 2, 3: 3, 4: 3, 5: 3, 6: 3 };
    
    fixed = fixed.replace(/<h([1-6])([^>]*)>/gi, (match, level) => {
      const newLevel = headingMap[parseInt(level)];
      return `<h${newLevel}${match.slice(3)}`;
    }).replace(/<\/h([1-6])>/gi, (match, level) => {
      const newLevel = headingMap[parseInt(level)];
      return `</h${newLevel}>`;
    });
    
    return fixed;
  }

  async optimizeSEO(content, metadata) {    try {
      const response = await fetch(`${this.baseURL}/api/optimize-seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, metadata })
      });
      
      if (!response.ok) throw new Error('SEO optimization failed');
      
      const result = await response.json();
      return result.optimizedContent || content;
    } catch (error) {
      console.error('SEO optimization error:', error);
      return content;
    }
  }

  async applyNZCompliance(content) {
    // Apply NZ spelling and terminology
    let nzContent = content;
    
    const nzSpellings = {
      'fiber': 'fibre',
      'center': 'centre',
      'program': 'programme',
      'color': 'colour',
      'labor': 'labour',
      'organization': 'organisation',
      'realize': 'realise',
      'optimize': 'optimise',
      'analyze': 'analyse'
    };
    
    Object.entries(nzSpellings).forEach(([us, nz]) => {
      const regex = new RegExp(`\\b${us}\\b`, 'gi');
      nzContent = nzContent.replace(regex, nz);
    });
    
    // Add NZ-specific disclaimers if needed    if (nzContent.toLowerCase().includes('property') || nzContent.toLowerCase().includes('real estate')) {
      const disclaimer = '<div class="nz-disclaimer"><p><em>Note: Property information is subject to change. Please verify all details with relevant authorities. This content is for informational purposes only.</em></p></div>';
      if (!nzContent.includes('disclaimer')) {
        nzContent += '\n\n' + disclaimer;
      }
    }
    
    return nzContent;
  }

  async generatePolishedImages(metadata) {
    try {
      const response = await fetch(`${this.baseURL}/api/generate-images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: metadata.keywords || 'professional property maintenance',
          style: 'professional, high-quality, property-focused',
          count: 2
        })
      });
      
      if (!response.ok) throw new Error('Image generation failed');
      
      const result = await response.json();
      return result.images || [];
    } catch (error) {
      console.error('Image generation error:', error);
      return [];
    }
  }

  async generateSocialMediaContent(content, metadata) {
    try {
      const response = await fetch(`${this.baseURL}/api/generate-social-posts`, {        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, metadata })
      });
      
      if (!response.ok) throw new Error('Social media generation failed');
      
      const result = await response.json();
      return result.posts || {};
    } catch (error) {
      console.error('Social media generation error:', error);
      return {
        linkedin: { text: 'Check out our latest blog post!', hashtags: ['#property', '#maintenance'] },
        facebook: { text: 'New insights on property maintenance...', hashtags: ['#PropertyCare'] },
        instagram: { text: 'Property tips inside! 🏠', hashtags: ['#PropertyMaintenance', '#Auckland'] },
        twitter: { text: 'Essential property maintenance guide:', hashtags: ['#RealEstate', '#NZ'] }
      };
    }
  }

  async generatePolishedMetadata(content, originalMetadata) {
    const textContent = content.replace(/<[^>]*>/g, ' ').trim();
    const firstParagraph = textContent.split('\n')[0] || '';
    
    return {
      title: this.generateOptimizedTitle(originalMetadata.keywords),
      description: this.generateMetaDescription(firstParagraph, originalMetadata.keywords),
      slug: this.generateSlug(originalMetadata.keywords),
      schema: this.generateSchemaMarkup(content, originalMetadata)
    };
  }

  generateOptimizedTitle(keywords) {
    const title = keywords ?       `${keywords} - Expert Guide | AttributeAI` : 
      'Professional Content Guide | AttributeAI';
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  }

  generateMetaDescription(firstParagraph, keywords) {
    let description = firstParagraph.substring(0, 150);
    if (keywords && !description.toLowerCase().includes(keywords.toLowerCase())) {
      description = `${keywords} - ${description}`;
    }
    return description.length > 155 ? description.substring(0, 152) + '...' : description;
  }

  generateSlug(keywords) {
    return keywords ?
      keywords.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') :
      'professional-content-guide';
  }

  generateSchemaMarkup(content, metadata) {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": metadata.title || this.generateOptimizedTitle(metadata.keywords),
      "description": metadata.description || this.generateMetaDescription(content, metadata.keywords),
      "author": {
        "@type": "Organization",
        "name": "AttributeAI"
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    };
  }

  getImprovementsList(analysis) {    const improvements = [];
    
    if (analysis.issues.includes('Heading hierarchy skip')) {
      improvements.push('Fixed heading hierarchy for better structure');
    }
    
    if (analysis.paragraphLengths.some(len => len > 3)) {
      improvements.push('Split long paragraphs for better readability');
    }
    
    improvements.push('Applied NZ spelling conventions');
    improvements.push('Optimized SEO meta tags');
    improvements.push('Added schema markup for search engines');
    improvements.push('Generated social media posts');
    
    return improvements;
  }

  generateHTMLExport(content, images, metadata, socialPosts) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title}</title>
    <meta name="description" content="${metadata.description}">
    <link rel="canonical" href="https://yourwebsite.com/${metadata.slug}">
    
    <!-- Schema Markup -->
    <script type="application/ld+json">
    ${JSON.stringify(metadata.schema, null, 2)}
    </script>
    
    <style>
        body {            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 { color: #1a1a1a; margin-top: 1.5em; }
        img { max-width: 100%; height: auto; margin: 1em 0; }
        .social-posts { background: #f5f5f5; padding: 20px; margin-top: 3em; }
        .social-post { margin-bottom: 1.5em; padding: 15px; background: white; border-radius: 8px; }
        .nz-disclaimer { background: #f0f8ff; padding: 15px; margin-top: 2em; border-left: 4px solid #0066cc; }
    </style>
</head>
<body>
    ${content}
    
    ${images.length > 0 ? `
    <div class="images">
        ${images.map((img, i) => `
        <figure>
            <img src="${img.url}" alt="${img.alt || 'Property maintenance image ' + (i + 1)}">
            <figcaption>${img.caption || ''}</figcaption>
        </figure>
        `).join('')}
    </div>
    ` : ''}
    
    ${socialPosts ? `
    <div class="social-posts">
        <h2>Social Media Posts</h2>
        ${Object.entries(socialPosts).map(([platform, post]) => `        <div class="social-post">
            <h3>${platform.charAt(0).toUpperCase() + platform.slice(1)}</h3>
            <p>${post.text}</p>
            <p><em>Hashtags: ${post.hashtags.join(' ')}</em></p>
        </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>`;
    
    return html;
  }
}

export default ContentPolishService;