class CMSIntegrationService {
  constructor() {
    this.baseURL = 'http://localhost:3001';
    this.supportedPlatforms = [
      'wordpress',
      'webflow', 
      'ghost',
      'shopify',
      'medium',
      'linkedin',
      'contentful',
      'strapi'
    ];
  }

  // Get available CMS platforms and their connection status
  async getAvailablePlatforms() {
    try {
      const response = await fetch(`${this.baseURL}/api/cms/platforms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch CMS platforms');
      }

      const platforms = await response.json();
      return platforms;
    } catch (error) {
      console.error('Error fetching CMS platforms:', error);
      return this.getMockPlatforms();
    }
  }

  // Connect to a CMS platform
  async connectPlatform(platform, credentials) {
    try {
      console.log(`🔗 Connecting to ${platform}...`);
      
      const response = await fetch(`${this.baseURL}/api/cms/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          credentials
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to connect to ${platform}`);
      }

      const result = await response.json();
      console.log(`✅ Successfully connected to ${platform}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to connect to ${platform}:`, error);
      throw error;
    }
  }

  // Publish content to a specific platform
  async publishContent(platform, content, options = {}) {
    try {
      console.log(`📤 Publishing to ${platform}...`);
      
      const publishPayload = {
        platform,
        content: {
          title: content.title || 'Untitled',
          body: content.content || content.body,
          excerpt: content.excerpt || content.description,
          tags: content.tags || [],
          categories: content.categories || [],
          featuredImage: content.featuredImage,
          seoTitle: content.seoTitle || content.title,
          seoDescription: content.seoDescription || content.excerpt,
          slug: content.slug || this.generateSlug(content.title),
          status: options.status || 'draft', // draft, published, scheduled
          publishDate: options.publishDate || new Date().toISOString(),
          authorId: options.authorId,
          customFields: content.customFields || {}
        },
        options: {
          schedulePublish: options.schedulePublish || false,
          publishDate: options.publishDate,
          crossPost: options.crossPost || false,
          platforms: options.platforms || [],
          notifyFollowers: options.notifyFollowers || true,
          generateSocialPosts: options.generateSocialPosts || false
        }
      };

      const response = await fetch(`${this.baseURL}/api/cms/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publishPayload)
      });

      if (!response.ok) {
        throw new Error(`Failed to publish to ${platform}`);
      }

      const result = await response.json();
      console.log(`✅ Successfully published to ${platform}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to publish to ${platform}:`, error);
      throw error;
    }
  }

  // Batch publish to multiple platforms
  async batchPublish(platforms, content, options = {}) {
    const results = [];
    const errors = [];

    console.log(`📤 Starting batch publish to ${platforms.length} platforms...`);

    for (const platform of platforms) {
      try {
        const result = await this.publishContent(platform, content, {
          ...options,
          platform
        });
        results.push({
          platform,
          success: true,
          result
        });
      } catch (error) {
        errors.push({
          platform,
          success: false,
          error: error.message
        });
      }
    }

    return {
      success: errors.length === 0,
      results,
      errors,
      summary: {
        total: platforms.length,
        successful: results.length,
        failed: errors.length
      }
    };
  }

  // Schedule content for future publishing
  async scheduleContent(content, schedule) {
    try {
      console.log('📅 Scheduling content for publication...');
      
      const response = await fetch(`${this.baseURL}/api/cms/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          schedule: {
            publishDate: schedule.publishDate,
            platforms: schedule.platforms,
            timezone: schedule.timezone || 'UTC',
            recurring: schedule.recurring || false,
            frequency: schedule.frequency, // daily, weekly, monthly
            endDate: schedule.endDate
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to schedule content');
      }

      const result = await response.json();
      console.log('✅ Content scheduled successfully');
      return result;
    } catch (error) {
      console.error('❌ Failed to schedule content:', error);
      throw error;
    }
  }

  // Get publishing analytics
  async getPublishingAnalytics(timeRange = '30d') {
    try {
      const response = await fetch(`${this.baseURL}/api/cms/analytics?range=${timeRange}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch publishing analytics');
      }

      const analytics = await response.json();
      return analytics;
    } catch (error) {
      console.error('Error fetching publishing analytics:', error);
      return this.getMockAnalytics();
    }
  }

  // Sync content status across platforms
  async syncContentStatus() {
    try {
      const response = await fetch(`${this.baseURL}/api/cms/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to sync content status');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error syncing content status:', error);
      throw error;
    }
  }

  // Generate content slug from title
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Get WordPress-specific publishing options
  getWordPressOptions() {
    return {
      postType: 'post', // post, page, custom_post_type
      status: 'draft', // draft, publish, private, pending
      commentStatus: 'open', // open, closed
      pingStatus: 'open', // open, closed
      sticky: false,
      format: 'standard', // standard, aside, chat, gallery, link, image, quote, status, video, audio
      categories: [],
      tags: [],
      customFields: {},
      featuredMedia: null,
      template: 'default'
    };
  }

  // Get Webflow-specific publishing options
  getWebflowOptions() {
    return {
      collectionId: null,
      fields: {},
      isDraft: true,
      isArchived: false,
      slug: null
    };
  }

  // Get Ghost-specific publishing options
  getGhostOptions() {
    return {
      status: 'draft', // draft, published, scheduled
      visibility: 'public', // public, members, paid
      featured: false,
      page: false,
      authors: [],
      tags: [],
      primaryAuthor: null,
      primaryTag: null,
      canonicalUrl: null,
      codeinjectionHead: null,
      codeinjectionFoot: null,
      customExcerpt: null,
      ogImage: null,
      ogTitle: null,
      ogDescription: null,
      twitterImage: null,
      twitterTitle: null,
      twitterDescription: null,
      metaTitle: null,
      metaDescription: null
    };
  }

  // Mock data for fallback
  getMockPlatforms() {
    return [
      {
        id: 'wordpress',
        name: 'WordPress',
        icon: '📝',
        connected: false,
        status: 'Available',
        features: ['Posts', 'Pages', 'Custom Fields', 'SEO'],
        authType: 'application_password'
      },
      {
        id: 'webflow',
        name: 'Webflow',
        icon: '🎨',
        connected: false,
        status: 'Available',
        features: ['CMS Collections', 'Custom Fields', 'SEO'],
        authType: 'api_key'
      },
      {
        id: 'ghost',
        name: 'Ghost',
        icon: '👻',
        connected: false,
        status: 'Available',
        features: ['Posts', 'Pages', 'Tags', 'Authors'],
        authType: 'admin_api'
      },
      {
        id: 'shopify',
        name: 'Shopify',
        icon: '🛍️',
        connected: false,
        status: 'Available',
        features: ['Blog Posts', 'Articles', 'SEO'],
        authType: 'private_app'
      },
      {
        id: 'medium',
        name: 'Medium',
        icon: '📰',
        connected: false,
        status: 'Available',
        features: ['Articles', 'Publications'],
        authType: 'integration_token'
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: '💼',
        connected: false,
        status: 'Available',
        features: ['Articles', 'Posts', 'Company Pages'],
        authType: 'oauth'
      }
    ];
  }

  getMockAnalytics() {
    return {
      totalPublished: 156,
      successRate: 94.2,
      platforms: {
        wordpress: { published: 67, success: 98.5, avgTime: '2.3s' },
        webflow: { published: 34, success: 91.2, avgTime: '3.1s' },
        ghost: { published: 28, success: 96.4, avgTime: '1.8s' },
        medium: { published: 27, success: 88.9, avgTime: '4.2s' }
      },
      recentActivity: [
        { date: '2025-06-13', published: 8, failed: 0 },
        { date: '2025-06-12', published: 12, failed: 1 },
        { date: '2025-06-11', published: 15, failed: 0 },
        { date: '2025-06-10', published: 9, failed: 1 }
      ],
      topPerforming: [
        { title: 'Complete SEO Guide', platform: 'WordPress', views: 2845 },
        { title: 'Content Marketing Strategy', platform: 'Medium', views: 1923 },
        { title: 'Digital Marketing Trends', platform: 'LinkedIn', views: 1654 }
      ]
    };
  }

  // Validate content before publishing
  validateContent(content, platform) {
    const errors = [];
    const warnings = [];

    // Required fields validation
    if (!content.title || content.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!content.content || content.content.trim().length === 0) {
      errors.push('Content body is required');
    }

    // Platform-specific validation
    switch (platform) {
      case 'wordpress':
        if (content.title && content.title.length > 255) {
          warnings.push('Title may be too long for WordPress (255 char limit)');
        }
        break;
      
      case 'medium':
        if (content.content && content.content.length < 100) {
          warnings.push('Medium articles perform better with 400+ words');
        }
        break;
      
      case 'linkedin':
        if (content.title && content.title.length > 100) {
          warnings.push('LinkedIn article titles should be under 100 characters');
        }
        break;
    }

    // SEO validation
    if (!content.seoDescription || content.seoDescription.length < 120) {
      warnings.push('Consider adding a meta description (120-160 characters)');
    }

    if (!content.tags || content.tags.length === 0) {
      warnings.push('Adding tags will improve content discoverability');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

export default CMSIntegrationService;