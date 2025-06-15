// AttributeAI Browser Extension - Enhanced with CRM Integration
// The complete "HubSpot Killer" with marketing intelligence + CRM

class AttributeAIExtension {
  constructor() {
    this.apiBaseUrl = 'https://attributeai.com/api';
    this.currentTab = 'keywords';
    this.currentDomain = null;
    this.siteAnalysis = null;
    this.isAnalyzing = false;
    this.userProfile = null;
    
    this.init();
  }

  async init() {
    console.log('🚀 AttributeAI Extension initialized');
    
    // Get current tab info
    await this.getCurrentTabInfo();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Setup auto-suggestions
    this.setupAutoSuggestions();
    
    // Initialize UI
    this.updateConnectionStatus();
    this.loadUserProfile();
    
    // Analyze current site for CRM context
    await this.analyzCurrentSite();
  }

  async getCurrentTabInfo() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        const url = new URL(tab.url);
        this.currentDomain = url.hostname.replace('www.', '');
        this.updateCurrentSiteDisplay();
      }
    } catch (error) {
      console.error('Error getting current tab:', error);
    }
  }

  updateCurrentSiteDisplay() {
    const domainElement = document.getElementById('current-domain');
    if (domainElement && this.currentDomain) {
      domainElement.textContent = this.currentDomain;
    }
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.currentTarget.dataset.tab;
        this.switchTab(tabName);
      });
    });

    // Keywords tab events
    this.setupKeywordEvents();
    
    // CRM tab events
    this.setupCRMEvents();
    
    // Analytics tab events
    this.setupAnalyticsEvents();
    
    // Main action buttons
    document.getElementById('open-dashboard')?.addEventListener('click', () => {
      this.openTab('https://attributeai.com/dashboard');
    });
    
    document.getElementById('open-crm-dashboard')?.addEventListener('click', () => {
      this.openTab('https://attributeai.com/crm');
    });

    // Footer links
    document.getElementById('settings-link')?.addEventListener('click', () => {
      this.openTab('https://attributeai.com/settings');
    });
    
    document.getElementById('help-link')?.addEventListener('click', () => {
      this.openTab('https://attributeai.com/help');
    });
  }

  setupKeywordEvents() {
    // Keyword analysis
    document.getElementById('analyze-btn')?.addEventListener('click', () => {
      const keyword = document.getElementById('keyword-input').value.trim();
      if (keyword) {
        this.analyzeKeyword(keyword);
      }
    });

    // Enter key for analysis
    document.getElementById('keyword-input')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const keyword = e.target.value.trim();
        if (keyword) {
          this.analyzeKeyword(keyword);
        }
      }
    });

    // Page analysis
    document.getElementById('analyze-page-btn')?.addEventListener('click', () => {
      this.analyzeCurrentPage();
    });

    // Export results
    document.getElementById('export-btn')?.addEventListener('click', () => {
      this.exportResults();
    });

    // View full analysis
    document.getElementById('view-full-analysis')?.addEventListener('click', () => {
      this.openTab('https://attributeai.com/keyword-intelligence');
    });

    // Save keyword
    document.getElementById('save-keyword')?.addEventListener('click', () => {
      this.saveKeyword();
    });
  }

  setupCRMEvents() {
    // Add site to CRM
    document.getElementById('add-to-crm')?.addEventListener('click', () => {
      this.addSiteToCRM();
    });

    // Find contacts
    document.getElementById('view-contacts')?.addEventListener('click', () => {
      this.findContactsOnSite();
    });

    // Quick CRM actions
    document.getElementById('log-website-visit')?.addEventListener('click', () => {
      this.logWebsiteVisit();
    });

    document.getElementById('create-contact')?.addEventListener('click', () => {
      this.createNewContact();
    });

    document.getElementById('create-deal')?.addEventListener('click', () => {
      this.createNewDeal();
    });

    document.getElementById('schedule-followup')?.addEventListener('click', () => {
      this.scheduleFollowup();
    });
  }

  setupAnalyticsEvents() {
    // Analytics events would go here
    // For now, they're mostly display-only
  }

  switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    this.currentTab = tabName;

    // Load tab-specific data
    this.loadTabData(tabName);
  }

  async loadTabData(tabName) {
    switch (tabName) {
      case 'crm':
        await this.loadCRMData();
        break;
      case 'analytics':
        await this.loadAnalyticsData();
        break;
      case 'keywords':
        // Keywords tab is default, no special loading needed
        break;
    }
  }

  async loadCRMData() {
    // Load recent activities
    try {
      const response = await fetch(`${this.apiBaseUrl}/crm/activities/recent`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      if (response.ok) {
        const activities = await response.json();
        this.updateActivitiesList(activities);
      }
    } catch (error) {
      console.error('Error loading CRM data:', error);
    }
  }

  updateActivitiesList(activities) {
    const container = document.getElementById('activities-list');
    if (!container || !activities || activities.length === 0) return;

    container.innerHTML = activities.slice(0, 5).map(activity => `
      <div class="activity-item">
        <div class="activity-icon">${this.getActivityIcon(activity.type)}</div>
        <div class="activity-content">
          <div class="activity-title">${activity.description}</div>
          <div class="activity-time">${this.formatTimeAgo(activity.timestamp)}</div>
        </div>
      </div>
    `).join('');
  }

  getActivityIcon(type) {
    const icons = {
      'Website Visit': '📝',
      'Contact Added': '👤',
      'Deal Created': '💰',
      'Email Sent': '📧',
      'Call Made': '📞',
      'Meeting Scheduled': '📅'
    };
    return icons[type] || '📋';
  }

  formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return time.toLocaleDateString();
  }

  async loadAnalyticsData() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/analytics/extension-summary`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      if (response.ok) {
        const analytics = await response.json();
        this.updateAnalyticsSummary(analytics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  updateAnalyticsSummary(analytics) {
    const summaryItems = document.querySelectorAll('.summary-item .summary-value');
    if (summaryItems.length >= 4 && analytics) {
      summaryItems[0].textContent = analytics.keywordsAnalyzed || '0';
      summaryItems[1].textContent = analytics.sitesVisited || '0';
      summaryItems[2].textContent = analytics.contactsAdded || '0';
      summaryItems[3].textContent = analytics.dealsCreated || '0';
    }
  }

  async analyzCurrentSite() {
    if (!this.currentDomain || this.isAnalyzing) return;
    
    this.isAnalyzing = true;
    this.updateSiteStatus('analyzing', 'Analyzing...');

    try {
      const response = await fetch(`${this.apiBaseUrl}/crm/companies/check-domain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({ domain: this.currentDomain })
      });

      if (response.ok) {
        const result = await response.json();
        this.siteAnalysis = result;
        
        if (result.exists) {
          this.updateSiteStatus('known', `Known Company: ${result.company.name}`);
        } else {
          this.updateSiteStatus('new', 'New Company');
        }
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing site:', error);
      this.updateSiteStatus('error', 'Analysis failed');
    } finally {
      this.isAnalyzing = false;
    }
  }

  updateSiteStatus(status, text) {
    const statusElement = document.getElementById('site-status');
    if (!statusElement) return;

    const indicator = statusElement.querySelector('.status-indicator');
    const textElement = statusElement.querySelector('span:last-child');

    if (indicator) {
      indicator.className = `status-indicator ${status}`;
    }
    if (textElement) {
      textElement.textContent = text;
    }
  }

  async analyzeKeyword(keyword) {
    this.showLoading();
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/keyword-intelligence/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({ keyword })
      });

      if (response.ok) {
        const analysis = await response.json();
        this.displayKeywordResults(analysis);
        this.hideLoading();
        this.showResults();
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing keyword:', error);
      this.hideLoading();
      this.showNotification('❌ Keyword analysis failed. Please try again.');
    }
  }

  displayKeywordResults(analysis) {
    // Update keyword title
    document.getElementById('result-keyword').textContent = analysis.keyword;
    
    // Update metrics
    document.getElementById('search-volume').textContent = this.formatNumber(analysis.searchVolume);
    document.getElementById('difficulty').textContent = analysis.difficulty;
    document.getElementById('cpc').textContent = `$${analysis.cpc}`;
    document.getElementById('intent').textContent = analysis.intent;
    
    // Update AI insights
    document.getElementById('claude-insight').textContent = analysis.claudeInsight;
  }

  formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  async analyzeCurrentPage() {
    if (!this.currentDomain) return;
    
    this.showLoading();
    
    try {
      // Send message to content script to extract page data
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      chrome.tabs.sendMessage(tab.id, { action: 'extractPageKeywords' }, (response) => {
        if (response && response.keywords) {
          this.analyzeKeyword(response.keywords[0]);
        } else {
          this.hideLoading();
          this.showNotification('ℹ️ No keywords found on current page.');
        }
      });
    } catch (error) {
      console.error('Error analyzing page:', error);
      this.hideLoading();
      this.showNotification('❌ Page analysis failed.');
    }
  }

  async addSiteToCRM() {
    if (!this.currentDomain) return;
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/crm/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({
          domain: this.currentDomain,
          source: 'Browser Extension'
        })
      });

      if (response.ok) {
        const company = await response.json();
        this.siteAnalysis = { exists: true, company };
        this.updateSiteStatus('known', `Added: ${company.name}`);
        this.showNotification('✅ Company added to CRM successfully!');
      } else {
        throw new Error('Failed to add company');
      }
    } catch (error) {
      console.error('Error adding site to CRM:', error);
      this.showNotification('❌ Failed to add company to CRM.');
    }
  }

  findContactsOnSite() {
    if (!this.currentDomain) return;
    
    const url = `https://attributeai.com/crm/contacts/search?domain=${this.currentDomain}`;
    this.openTab(url);
  }

  async logWebsiteVisit() {
    if (!this.currentDomain) return;
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await fetch(`${this.apiBaseUrl}/crm/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({
          type: 'Website Visit',
          description: `Visited ${this.currentDomain}`,
          url: tab.url,
          domain: this.currentDomain,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        this.showNotification('📝 Website visit logged successfully!');
        this.loadCRMData(); // Refresh activities
      } else {
        throw new Error('Failed to log visit');
      }
    } catch (error) {
      console.error('Error logging visit:', error);
      this.showNotification('❌ Failed to log website visit.');
    }
  }

  createNewContact() {
    const companyId = this.siteAnalysis?.company?.id;
    const url = `https://attributeai.com/crm/contacts/new${companyId ? `?companyId=${companyId}` : ''}`;
    this.openTab(url);
  }

  createNewDeal() {
    const companyId = this.siteAnalysis?.company?.id;
    const url = `https://attributeai.com/crm/deals/new${companyId ? `?companyId=${companyId}` : ''}`;
    this.openTab(url);
  }

  scheduleFollowup() {
    const companyId = this.siteAnalysis?.company?.id;
    const url = `https://attributeai.com/crm/calendar/new${companyId ? `?companyId=${companyId}` : ''}`;
    this.openTab(url);
  }

  setupAutoSuggestions() {
    this.suggestions = [
      'digital marketing', 'seo optimization', 'content marketing', 'social media marketing',
      'email marketing', 'affiliate marketing', 'influencer marketing', 'video marketing',
      'mobile marketing', 'search engine marketing', 'conversion optimization', 'web analytics',
      'keyword research', 'competitor analysis', 'brand awareness', 'lead generation',
      'saas marketing', 'b2b marketing', 'e-commerce seo', 'local seo'
    ];

    const input = document.getElementById('keyword-input');
    if (input) {
      input.addEventListener('input', (e) => this.handleInputChange(e));
    }
  }

  handleInputChange(e) {
    const query = e.target.value.toLowerCase();
    const suggestionsContainer = document.getElementById('search-suggestions');
    
    if (query.length < 2) {
      suggestionsContainer.innerHTML = '';
      return;
    }

    const filteredSuggestions = this.suggestions
      .filter(suggestion => suggestion.toLowerCase().includes(query))
      .slice(0, 5);

    if (filteredSuggestions.length > 0) {
      suggestionsContainer.innerHTML = filteredSuggestions
        .map(suggestion => `
          <div class="suggestion-item" data-suggestion="${suggestion}">
            ${suggestion}
          </div>
        `).join('');

      // Add click handlers
      suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          document.getElementById('keyword-input').value = item.dataset.suggestion;
          suggestionsContainer.innerHTML = '';
          this.analyzeKeyword(item.dataset.suggestion);
        });
      });
    } else {
      suggestionsContainer.innerHTML = '';
    }
  }

  async exportResults() {
    // Implementation for exporting keyword results
    this.showNotification('📊 Exporting results...');
    
    try {
      // Get current analysis data and export
      const analysisData = this.getCurrentAnalysisData();
      const blob = new Blob([JSON.stringify(analysisData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-analysis-${Date.now()}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      this.showNotification('✅ Results exported successfully!');
    } catch (error) {
      console.error('Error exporting results:', error);
      this.showNotification('❌ Export failed.');
    }
  }

  getCurrentAnalysisData() {
    return {
      keyword: document.getElementById('result-keyword')?.textContent,
      searchVolume: document.getElementById('search-volume')?.textContent,
      difficulty: document.getElementById('difficulty')?.textContent,
      cpc: document.getElementById('cpc')?.textContent,
      intent: document.getElementById('intent')?.textContent,
      claudeInsight: document.getElementById('claude-insight')?.textContent,
      timestamp: new Date().toISOString()
    };
  }

  async saveKeyword() {
    try {
      const analysisData = this.getCurrentAnalysisData();
      
      const response = await fetch(`${this.apiBaseUrl}/keyword-intelligence/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(analysisData)
      });

      if (response.ok) {
        this.showNotification('✅ Keyword saved successfully!');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving keyword:', error);
      this.showNotification('❌ Failed to save keyword.');
    }
  }

  showLoading() {
    document.getElementById('loading-section')?.classList.remove('hidden');
    document.getElementById('results-section')?.classList.add('hidden');
  }

  hideLoading() {
    document.getElementById('loading-section')?.classList.add('hidden');
  }

  showResults() {
    document.getElementById('results-section')?.classList.remove('hidden');
  }

  updateConnectionStatus() {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
      // Simulate connection check
      setTimeout(() => {
        statusElement.innerHTML = `
          <span class="status-dot connected"></span>
          <span class="status-text">Connected</span>
        `;
        statusElement.classList.add('connected');
      }, 1000);
    }
  }

  loadUserProfile() {
    // Load user profile from storage or API
    chrome.storage.sync.get(['userProfile'], (result) => {
      if (result.userProfile) {
        this.userProfile = result.userProfile;
        this.updateUserDisplay();
      } else {
        // Load demo profile
        this.userProfile = {
          name: 'Demo User',
          tier: 'Free Plan',
          quota: { used: 47, total: 1000 }
        };
        this.updateUserDisplay();
      }
    });
  }

  updateUserDisplay() {
    if (!this.userProfile) return;

    document.getElementById('user-name').textContent = this.userProfile.name;
    document.getElementById('user-tier').textContent = this.userProfile.tier;
    
    if (this.userProfile.quota) {
      document.getElementById('quota-text').textContent = 
        `${this.userProfile.quota.used} / ${this.userProfile.quota.total}`;
      
      const progress = (this.userProfile.quota.used / this.userProfile.quota.total) * 100;
      document.getElementById('quota-progress').style.width = `${progress}%`;
    }

    // Show user section
    document.getElementById('user-section')?.classList.remove('hidden');
  }

  getAuthHeaders() {
    // Return authentication headers
    return {
      'Authorization': `Bearer ${this.getAuthToken()}`,
      'X-Extension-Version': '2.0.0'
    };
  }

  getAuthToken() {
    // Get auth token from storage
    return 'demo-token'; // In real implementation, get from chrome.storage
  }

  openTab(url) {
    chrome.tabs.create({ url });
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `extension-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

// Initialize extension when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AttributeAIExtension();
});
