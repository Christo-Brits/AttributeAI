// Enhanced Website Analyzer with Multiple Proxy Fallbacks
// Provides sophisticated website analysis with better error handling

class WebsiteAnalyzer {
    constructor() {
        this.analysisCache = new Map();
    }

    async analyzeWebsite(url) {
        // Check cache first
        if (this.analysisCache.has(url)) {
            return this.analysisCache.get(url);
        }

        // Try multiple approaches
        const strategies = [
            () => this.fetchWithCORSProxy(url),
            () => this.fetchWithAlternativeProxy(url),
            () => this.generateBasicAnalysis(url)
        ];

        for (let i = 0; i < strategies.length; i++) {
            try {
                console.log(`Trying analysis strategy ${i + 1}...`);
                const htmlContent = await strategies[i]();
                
                if (htmlContent) {
                    // Parse the HTML content
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlContent, 'text/html');
                    
                    // Perform comprehensive analysis
                    const analysis = this.performComprehensiveAnalysis(doc, url);
                    
                    // Cache the result
                    this.analysisCache.set(url, analysis);
                    
                    return analysis;
                }
            } catch (error) {
                console.warn(`Strategy ${i + 1} failed:`, error.message);
                if (i === strategies.length - 1) {
                    // Last strategy failed, return error
                    return this.getErrorAnalysis(url, error.message);
                }
            }
        }
    }

    async fetchWithCORSProxy(url) {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`CORS proxy failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.contents || data.contents.length < 100) {
            throw new Error('Empty or invalid response from CORS proxy');
        }

        return data.contents;
    }

    async fetchWithAlternativeProxy(url) {
        // Try a different approach - jsonp proxy
        const proxyUrl = `https://jsonp.afeld.me/?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`Alternative proxy failed: ${response.status}`);
        }

        const htmlContent = await response.text();
        
        if (!htmlContent || htmlContent.length < 100) {
            throw new Error('Empty response from alternative proxy');
        }

        return htmlContent;
    }

    async generateBasicAnalysis(url) {
        // If we can't fetch the content, provide a basic analysis based on URL
        console.log('Falling back to URL-based analysis...');
        
        // This doesn't fetch content but analyzes what we can from the URL
        const domain = new URL(url).hostname;
        const analysis = this.createFallbackAnalysis(url, domain);
        return null; // Return null to trigger fallback analysis
    }