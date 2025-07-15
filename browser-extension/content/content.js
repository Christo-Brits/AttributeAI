// AttributeAI Content Script
// Runs on supported websites to display keyword data and analysis
// SECURE VERSION - No eval(), proper sanitization

class AttributeAIContentScript {
  constructor() {
    this.apiUrl = 'https://leafy-biscotti-c87e93.netlify.app';
    this.supportedSites = {
      'google.com': this.handleGoogleSearch.bind(this),
      'youtube.com': this.handleYouTube.bind(this),
      'amazon.com': this.handleAmazon.bind(this),
      'ebay.com': this.handleEbay.bind(this),
      'etsy.com': this.handleEtsy.bind(this),
      'pinterest.com': this.handlePinterest.bind(this),
      'bing.com': this.handleBingSearch.bind(this)
    };
    
    this.keywordWidgets = new Map();
    this.isEnabled = true;
    
    this.init();
  }

  // SECURITY: Text sanitization method
  sanitizeText(text) {
    if (typeof text !== 'string') return '';
    return text.replace(/[<>&"']/g, (char) => {
      const map = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return map[char] || char;
    });
  }

  // SECURITY: URL validation
  isValidUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  async init() {
    await this.loadSettings();
    
    if (this.isEnabled) {
      this.detectAndEnhancePage();
      this.setupMutationObserver();
      this.setupFloatingWidget();
    }
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['attributeai_settings']);
      const settings = result.attributeai_settings || {};
      
      this.isEnabled = settings.enabled !== false;
      this.showVolumeData = settings.showVolumeData !== false;
      this.showDifficultyData = settings.showDifficultyData !== false;
      this.showCPCData = settings.showCPCData !== false;
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  detectAndEnhancePage() {
    const hostname = window.location.hostname.toLowerCase();
    
    for (const [site, handler] of Object.entries(this.supportedSites)) {
      if (hostname.includes(site)) {
        handler();
        break;
      }
    }
  }

  // Google Search Enhancement
  handleGoogleSearch() {
    if (window.location.pathname === '/search') {
      this.enhanceGoogleSearchResults();
      this.addSearchVolumeToQuery();
    }
  }

  enhanceGoogleSearchResults() {
    const searchResults = document.querySelectorAll('div[data-result-index]');
    
    searchResults.forEach((result, index) => {
      const titleElement = result.querySelector('h3');
      if (titleElement && !result.querySelector('.attributeai-widget')) {
        const keyword = this.extractKeywordFromGoogleResult(result);
        if (keyword) {
          this.addKeywordWidget(titleElement, keyword, 'search-result');
        }
      }
    });
  }

  addSearchVolumeToQuery() {
    const searchInput = document.querySelector('input[name="q"]');
    if (searchInput && searchInput.value) {
      const query = searchInput.value;
      this.addSearchQueryWidget(query);
    }
  }

  addSearchQueryWidget(query) {
    const searchContainer = document.querySelector('#search');
    if (searchContainer && !document.querySelector('.attributeai-search-widget')) {
      const widget = this.createSearchQueryWidget(query);
      searchContainer.insertBefore(widget, searchContainer.firstChild);
    }
  }

  createSearchQueryWidget(query) {
    const widget = document.createElement('div');
    widget.className = 'attributeai-search-widget';
    
    // SECURE: Use textContent instead of innerHTML
    const header = document.createElement('div');
    header.className = 'attributeai-search-header';
    
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('icons/icon16.png');
    img.alt = 'AttributeAI';
    
    const span = document.createElement('span');
    span.textContent = 'AttributeAI Keyword Intelligence';
    
    const button = document.createElement('button');
    button.className = 'attributeai-analyze-btn';
    button.setAttribute('data-keyword', this.sanitizeText(query));
    button.textContent = `Analyze "${this.sanitizeText(query)}"`;
    
    header.appendChild(img);
    header.appendChild(span);
    header.appendChild(button);
      </div>
      <div class="attributeai-search-metrics" id="metrics-${this.generateId()}">
        <div class="attributeai-metric">
          <span class="label">Volume:</span>
          <span class="value loading">...</span>
        </div>
        <div class="attributeai-metric">
          <span class="label">Difficulty:</span>
          <span class="value loading">...</span>
        </div>
        <div class="attributeai-metric">
          <span class="label">CPC:</span>
          <span class="value loading">...</span>
        </div>
        <div class="attributeai-metric">
          <span class="label">Intent:</span>
          <span class="value loading">...</span>
        </div>
      </div>
    `;

    // Add event listener for analyze button
    const analyzeBtn = widget.querySelector('.attributeai-analyze-btn');
    analyzeBtn.addEventListener('click', () => {
      this.openAttributeAIWithKeyword(query);
    });

    // Load keyword data
    this.loadKeywordData(query, widget.querySelector('.attributeai-search-metrics'));

    return widget;
  }

  // YouTube Enhancement
  handleYouTube() {
    if (window.location.pathname.includes('/watch')) {
      this.enhanceYouTubeVideo();
    } else if (window.location.pathname.includes('/results')) {
      this.enhanceYouTubeSearch();
    }
  }

  enhanceYouTubeVideo() {
    const titleElement = document.querySelector('#title h1');
    if (titleElement && !titleElement.querySelector('.attributeai-widget')) {
      const title = titleElement.textContent;
      const keywords = this.extractKeywordsFromText(title);
      if (keywords.length > 0) {
        this.addKeywordWidget(titleElement, keywords[0], 'youtube-video');
      }
    }
  }

  enhanceYouTubeSearch() {
    const videoTitles = document.querySelectorAll('#video-title');
    videoTitles.forEach(title => {
      if (!title.querySelector('.attributeai-widget')) {
        const keyword = this.extractKeywordsFromText(title.textContent)[0];
        if (keyword) {
          this.addKeywordWidget(title, keyword, 'youtube-search');
        }
      }
    });
  }

  // Amazon Enhancement
  handleAmazon() {
    if (window.location.pathname.includes('/s')) {
      this.enhanceAmazonSearch();
    } else if (window.location.pathname.includes('/dp/')) {
      this.enhanceAmazonProduct();
    }
  }

  enhanceAmazonSearch() {
    const productTitles = document.querySelectorAll('[data-component-type="s-search-result"] h2 a span');
    productTitles.forEach(title => {
      if (!title.querySelector('.attributeai-widget')) {
        const keyword = this.extractKeywordsFromText(title.textContent)[0];
        if (keyword) {
          this.addKeywordWidget(title, keyword, 'amazon-product');
        }
      }
    });
  }

  enhanceAmazonProduct() {
    const titleElement = document.querySelector('#productTitle');
    if (titleElement && !titleElement.querySelector('.attributeai-widget')) {
      const keywords = this.extractKeywordsFromText(titleElement.textContent);
      if (keywords.length > 0) {
        this.addKeywordWidget(titleElement, keywords[0], 'amazon-product');
      }
    }
  }

  // Generic Widget Creation
  addKeywordWidget(element, keyword, context) {
    if (this.keywordWidgets.has(keyword)) {
      return; // Avoid duplicates
    }

    const widget = document.createElement('span');
    widget.className = 'attributeai-widget';
    widget.setAttribute('data-keyword', keyword);
    widget.innerHTML = `
      <span class="attributeai-badge" title="Click for full analysis">
        <img src="${chrome.runtime.getURL('icons/icon16.png')}" alt="AI">
        <span class="keyword-metrics" id="widget-${this.generateId()}">
          <span class="volume">...</span>
          <span class="difficulty">...</span>
          <span class="cpc">...</span>
        </span>
      </span>
    `;

    // Position widget appropriately
    element.appendChild(widget);

    // Add click handler
    widget.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showKeywordPopup(keyword, e.target);
    });

    // Load keyword data
    this.loadKeywordData(keyword, widget.querySelector('.keyword-metrics'));
    this.keywordWidgets.set(keyword, widget);
  }

  async loadKeywordData(keyword, metricsElement) {
    try {
      const result = await this.analyzeKeyword(keyword);
      
      if (result.success && result.data) {
        this.updateMetricsDisplay(metricsElement, result.data.metrics);
      } else {
        this.updateMetricsDisplay(metricsElement, null);
      }
    } catch (error) {
      console.error('Failed to load keyword data:', error);
      this.updateMetricsDisplay(metricsElement, null);
    }
  }

  updateMetricsDisplay(element, metrics) {
    if (!element) return;

    if (metrics) {
      const volumeEl = element.querySelector('.volume');
      const difficultyEl = element.querySelector('.difficulty');
      const cpcEl = element.querySelector('.cpc');

      if (volumeEl) volumeEl.textContent = this.formatVolume(metrics.searchVolume);
      if (difficultyEl) difficultyEl.textContent = metrics.difficulty || '--';
      if (cpcEl) cpcEl.textContent = `$${metrics.cpc || '0.00'}`;

      element.classList.remove('loading');
    } else {
      element.innerHTML = '<span class="error">--</span>';
    }
  }

  formatVolume(volume) {
    if (!volume) return '--';
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  }

  // Keyword Analysis
  async analyzeKeyword(keyword) {
    try {
      return await chrome.runtime.sendMessage({
        action: 'analyzeKeyword',
        keyword: keyword,
        context: {
          url: window.location.href,
          source: 'content_script'
        }
      });
    } catch (error) {
      console.error('Keyword analysis error:', error);
      return { success: false, error: error.message };
    }
  }

  // Keyword Popup
  showKeywordPopup(keyword, triggerElement) {
    // Remove existing popup
    const existingPopup = document.querySelector('.attributeai-popup');
    if (existingPopup) {
      existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.className = 'attributeai-popup';
    popup.innerHTML = `
      <div class="attributeai-popup-header">
        <img src="${chrome.runtime.getURL('icons/icon16.png')}" alt="AttributeAI">
        <span class="keyword-title">"${keyword}"</span>
        <button class="close-btn">&times;</button>
      </div>
      <div class="attributeai-popup-content">
        <div class="metrics-grid">
          <div class="metric">
            <div class="metric-label">Search Volume</div>
            <div class="metric-value" id="popup-volume">Loading...</div>
          </div>
          <div class="metric">
            <div class="metric-label">SEO Difficulty</div>
            <div class="metric-value" id="popup-difficulty">Loading...</div>
          </div>
          <div class="metric">
            <div class="metric-label">CPC</div>
            <div class="metric-value" id="popup-cpc">Loading...</div>
          </div>
          <div class="metric">
            <div class="metric-label">Intent</div>
            <div class="metric-value" id="popup-intent">Loading...</div>
          </div>
        </div>
        <div class="popup-actions">
          <button class="action-btn primary" id="view-analysis">Full Analysis</button>
          <button class="action-btn secondary" id="save-keyword">Save Keyword</button>
        </div>
      </div>
    `;

    // Position popup near trigger element
    const rect = triggerElement.getBoundingClientRect();
    popup.style.position = 'fixed';
    popup.style.top = `${rect.bottom + 10}px`;
    popup.style.left = `${Math.max(10, rect.left)}px`;
    popup.style.zIndex = '10000';

    document.body.appendChild(popup);

    // Event listeners
    popup.querySelector('.close-btn').addEventListener('click', () => popup.remove());
    popup.querySelector('#view-analysis').addEventListener('click', () => {
      this.openAttributeAIWithKeyword(keyword);
      popup.remove();
    });
    popup.querySelector('#save-keyword').addEventListener('click', () => {
      this.saveKeyword(keyword);
      popup.remove();
    });

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!popup.contains(e.target)) {
          popup.remove();
        }
      }, { once: true });
    }, 100);

    // Load and display data
    this.loadPopupData(keyword, popup);
  }

  async loadPopupData(keyword, popup) {
    try {
      const result = await this.analyzeKeyword(keyword);
      
      if (result.success && result.data) {
        const metrics = result.data.metrics;
        popup.querySelector('#popup-volume').textContent = metrics.searchVolume?.toLocaleString() || 'N/A';
        popup.querySelector('#popup-difficulty').textContent = metrics.difficulty || 'N/A';
        popup.querySelector('#popup-cpc').textContent = `$${metrics.cpc || '0.00'}`;
        popup.querySelector('#popup-intent').textContent = metrics.intent || 'Unknown';
      }
    } catch (error) {
      console.error('Failed to load popup data:', error);
    }
  }

  // Floating Widget
  setupFloatingWidget() {
    const floatingWidget = document.createElement('div');
    floatingWidget.className = 'attributeai-floating-widget';
    floatingWidget.innerHTML = `
      <button class="floating-btn" title="AttributeAI Keyword Intelligence">
        <img src="${chrome.runtime.getURL('icons/icon24.png')}" alt="AI">
      </button>
    `;

    floatingWidget.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });

    document.body.appendChild(floatingWidget);
  }

  // Utility Functions
  extractKeywordsFromText(text) {
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'had', 'day']);
    
    return words
      .filter(word => !stopWords.has(word))
      .filter((word, index, arr) => arr.indexOf(word) === index)
      .slice(0, 3);
  }

  extractKeywordFromGoogleResult(resultElement) {
    const titleElement = resultElement.querySelector('h3');
    if (titleElement) {
      const keywords = this.extractKeywordsFromText(titleElement.textContent);
      return keywords[0] || null;
    }
    return null;
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  openAttributeAIWithKeyword(keyword) {
    const url = `${this.apiUrl}?tab=keyword-intelligence&keyword=${encodeURIComponent(keyword)}`;
    window.open(url, '_blank');
  }

  async saveKeyword(keyword) {
    try {
      const result = await chrome.storage.local.get(['attributeai_saved_keywords']);
      const saved = result.attributeai_saved_keywords || [];
      
      saved.unshift({
        keyword,
        url: window.location.href,
        timestamp: Date.now()
      });

      await chrome.storage.local.set({ 
        attributeai_saved_keywords: saved.slice(0, 100) 
      });

      this.showToast('Keyword saved successfully!');
    } catch (error) {
      console.error('Failed to save keyword:', error);
      this.showToast('Failed to save keyword');
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'attributeai-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Mutation Observer for Dynamic Content
  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.handleDynamicContent(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.mutationObserver = observer;
  }

  handleDynamicContent(element) {
    // Re-run enhancement for dynamically loaded content
    if (element.matches && element.matches('[data-result-index], #video-title, [data-component-type="s-search-result"]')) {
      setTimeout(() => {
        this.detectAndEnhancePage();
      }, 500);
    }
  }

  // Cleanup
  destroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    
    document.querySelectorAll('.attributeai-widget, .attributeai-popup, .attributeai-floating-widget, .attributeai-search-widget').forEach(el => {
      el.remove();
    });
  }
}

// Initialize content script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AttributeAIContentScript();
  });
} else {
  new AttributeAIContentScript();
}

// Handle messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeSelectedText') {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      sendResponse({ success: true, selectedText });
    } else {
      sendResponse({ success: false, error: 'No text selected' });
    }
  }
});