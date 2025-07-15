// Local SEO Matrix Service - Handles all API interactions
class LocalSEOMatrixService {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://your-api-domain.com/api/local-seo'
      : 'http://localhost:3001/api/local-seo';
  }

  async researchArea(areaName, state, service, additionalQueries = []) {
    try {
      const queries = [
        `Local demographics and business landscape in ${areaName}, ${state}`,
        `${service.name} market demand and competition in ${areaName}`,
        `Local regulations and requirements for ${service.name} in ${state}`,
        `Popular neighborhoods and business districts in ${areaName}`,
        `Local events and community activities in ${areaName}`,
        ...additionalQueries
      ];

      const response = await fetch(`${this.baseURL}/research-area`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          areaName,
          state,
          service,
          queries
        })
      });

      if (!response.ok) {
        throw new Error(`Research failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Area research error:', error);
      throw error;
    }
  }

  async generatePage(service, area, research) {
    try {
      const response = await fetch(`${this.baseURL}/generate-page`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service,
          area,
          research
        })
      });

      if (!response.ok) {
        throw new Error(`Page generation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Page generation error:', error);
      throw error;
    }
  }

  async generateBulkPages(combinations, progressCallback = null) {
    try {
      const response = await fetch(`${this.baseURL}/generate-bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          combinations
        })
      });

      if (!response.ok) {
        throw new Error(`Bulk generation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Bulk generation error:', error);
      throw error;
    }
  }

  async exportPages(pages, format = 'html') {
    try {
      const response = await fetch(`${this.baseURL}/export-pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pages,
          format
        })
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  // Generate complete local SEO campaign
  async generateCompleteCampaign(services, areas, selectedCombinations, progressCallback = null) {
    const results = [];
    const total = selectedCombinations.filter(c => c.selected).length;
    let completed = 0;

    for (const combination of selectedCombinations) {
      if (!combination.selected) continue;

      try {
        const service = services.find(s => s.id === combination.serviceId);
        const area = areas.find(a => a.id === combination.areaId);

        if (!service || !area) {
          console.warn('Invalid combination:', combination);
          continue;
        }

        // Update progress
        if (progressCallback) {
          progressCallback({
            phase: 'research',
            current: completed + 1,
            total,
            message: `Researching ${service.name} in ${area.name}...`
          });
        }

        // Research phase
        const research = await this.researchArea(area.name, area.state, service);

        // Update progress
        if (progressCallback) {
          progressCallback({
            phase: 'generation',
            current: completed + 1,
            total,
            message: `Generating page for ${service.name} in ${area.name}...`
          });
        }

        // Generation phase
        const pageContent = await this.generatePage(service, area, research);

        results.push({
          id: `${service.id}-${area.id}`,
          service,
          area,
          research,
          content: pageContent,
          status: 'completed',
          generatedAt: new Date().toISOString()
        });

        completed++;

        // Update progress
        if (progressCallback) {
          progressCallback({
            phase: 'completed',
            current: completed,
            total,
            message: `Completed ${completed} of ${total} pages`
          });
        }

        // Small delay to prevent API overload
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`Error generating page for combination:`, combination, error);
        
        const service = services.find(s => s.id === combination.serviceId);
        const area = areas.find(a => a.id === combination.areaId);
        
        results.push({
          id: `${combination.serviceId}-${combination.areaId}`,
          service,
          area,
          error: error.message,
          status: 'failed',
          generatedAt: new Date().toISOString()
        });

        completed++;
      }
    }

    return {
      totalRequested: total,
      totalGenerated: results.filter(r => r.status === 'completed').length,
      totalFailed: results.filter(r => r.status === 'failed').length,
      results
    };
  }

  // Save/load user configurations
  saveConfiguration(services, areas) {
    try {
      const config = {
        services,
        areas,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('localSEOConfig', JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('Failed to save configuration:', error);
      return false;
    }
  }

  loadConfiguration() {
    try {
      const saved = localStorage.getItem('localSEOConfig');
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error('Failed to load configuration:', error);
      return null;
    }
  }

  // Generate performance report
  generateReport(generatedPages) {
    const successfulPages = generatedPages.filter(p => p.status === 'completed');
    const failedPages = generatedPages.filter(p => p.status === 'failed');

    const report = {
      summary: {
        totalPages: generatedPages.length,
        successful: successfulPages.length,
        failed: failedPages.length,
        successRate: (successfulPages.length / generatedPages.length) * 100,
        estimatedValue: successfulPages.length * 500, // $500 per page value
        timeInvested: generatedPages.length * 3, // 3 minutes per page
        timeSaved: generatedPages.length * 180 // 3 hours saved per page
      },
      metrics: {
        averageWordCount: this.calculateAverage(successfulPages, 'content.wordCount'),
        averageSEOScore: this.calculateAverage(successfulPages, 'content.seoScore'),
        totalKeywords: this.countTotalKeywords(successfulPages),
        uniqueAreas: new Set(successfulPages.map(p => p.area.name)).size,
        uniqueServices: new Set(successfulPages.map(p => p.service.name)).size
      },
      recommendations: this.generateRecommendations(successfulPages, failedPages)
    };

    return report;
  }

  calculateAverage(pages, path) {
    if (pages.length === 0) return 0;
    const values = pages.map(page => this.getNestedValue(page, path)).filter(v => v !== null);
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj) || 0;
  }

  countTotalKeywords(pages) {
    return pages.reduce((total, page) => {
      return total + (page.content?.localSEO?.keywords?.length || 0);
    }, 0);
  }

  generateRecommendations(successfulPages, failedPages) {
    const recommendations = [];

    if (failedPages.length > 0) {
      recommendations.push({
        type: 'warning',
        title: 'Some pages failed to generate',
        description: `${failedPages.length} pages failed. Consider retrying with different parameters.`,
        action: 'Retry failed generations'
      });
    }

    if (successfulPages.length > 10) {
      recommendations.push({
        type: 'success',
        title: 'Excellent page generation volume',
        description: 'You\'ve created a comprehensive local SEO presence. Consider setting up tracking.',
        action: 'Implement page tracking'
      });
    }

    const avgSEOScore = this.calculateAverage(successfulPages, 'content.seoScore');
    if (avgSEOScore < 90) {
      recommendations.push({
        type: 'optimization',
        title: 'SEO score improvement opportunity',
        description: `Average SEO score is ${avgSEOScore.toFixed(1)}. Consider additional optimization.`,
        action: 'Review SEO recommendations'
      });
    }

    return recommendations;
  }
}

// Export singleton instance
export const localSEOService = new LocalSEOMatrixService();
export default localSEOService;