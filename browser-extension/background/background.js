// AttributeAI Browser Extension Background Script
// Enhanced with CRM Integration and Website Intelligence

class AttributeAIBackground {
  constructor() {
    this.apiBaseUrl = 'https://attributeai.com/api';
    this.activeAnalyses = new Map();
    this.crmData = new Map();
    this.userSession = null;
    
    this.init();
  }

  init() {
    console.log('🔧 AttributeAI Background Service Worker initialized');
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize user session
    this.initializeUserSession();
    
    // Setup periodic sync for CRM data
    this.setupPeriodicSync();
  }

  setupEventListeners() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Handle tab updates for website intelligence
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    // Handle tab activation for CRM context
    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabActivation(activeInfo);
    });

    // Handle messages from content scripts and popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep channel open for async responses
    });

    // Handle browser action clicks
    chrome.action.onClicked.addListener((tab) => {
      this.handleActionClick(tab);
    });

    // Handle keyboard shortcuts
    chrome.commands.onCommand.addListener((command) => {
      this.handleCommand(command);
    });

    // Handle web navigation for activity tracking
    chrome.webNavigation.onCompleted.addListener((details) => {
      this.handleNavigationCompleted(details);
    });
  }

  async handleInstallation(details) {
    console.log('📦 Extension installed/updated:', details.reason);
    
    if (details.reason === 'install') {
      // First-time installation
      await this.setupFirstTimeUser();
      
      // Open welcome page
      chrome.tabs.create({
        url: 'https://attributeai.com/extension/welcome'
      });
    } else if (details.reason === 'update') {
      // Extension updated
      this.handleExtensionUpdate(details);
    }
  }

  async setupFirstTimeUser() {
    try {
      // Initialize default settings
      const defaultSettings = {
        autoAnalyze: true,
        crmTracking: true,
        keywordSuggestions: true,
        notifications: true,
        syncInterval: 5 // minutes
      };
      
      await chrome.storage.sync.set({ settings: defaultSettings });
      
      // Initialize user profile
      const defaultProfile = {
        name: 'AttributeAI User',
        tier: 'Free',
        quota: { used: 0, total: 1000 },
        installDate: new Date().toISOString()
      };
      
      await chrome.storage.sync.set({ userProfile: defaultProfile });
      
      console.log('✅ First-time user setup completed');
    } catch (error) {
      console.error('❌ Error setting up first-time user:', error);
    }
  }

  handleExtensionUpdate(details) {
    console.log('🔄 Extension updated to version:', chrome.runtime.getManifest().version);
    
    // Show update notification
    this.showNotification('🚀 AttributeAI updated with new CRM features!', {
      type: 'basic',
      iconUrl: 'icons/icon48.png'
    });
  }

  async handleTabUpdate(tabId, changeInfo, tab) {
    // Only process when page is fully loaded
    if (changeInfo.status !== 'complete' || !tab.url) return;
    
    // Skip certain URLs
    if (this.shouldSkipUrl(tab.url)) return;
    
    try {
      const domain = this.extractDomain(tab.url);
      
      // Check if this is a business website
      if (await this.isBusinessWebsite(domain)) {
        // Inject website intelligence if not already injected
        await this.injectWebsiteIntelligence(tabId, domain);
        
        // Check CRM context for this domain
        await this.checkCRMContext(domain, tab);
      }
    } catch (error) {
      console.error('Error handling tab update:', error);
    }
  }

  async handleTabActivation(activeInfo) {
    try {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      if (!tab.url || this.shouldSkipUrl(tab.url)) return;
      
      const domain = this.extractDomain(tab.url);
      
      // Update current context
      this.currentContext = {
        tabId: activeInfo.tabId,
        domain: domain,
        url: tab.url,
        title: tab.title,
        timestamp: new Date().toISOString()
      };
      
      // Log activity for CRM tracking
      await this.logTabActivity(this.currentContext);
      
    } catch (error) {
      console.error('Error handling tab activation:', error);
    }
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'openTab':
          await this.openTab(request.url, request.options);
          sendResponse({ success: true });
          break;
          
        case 'analyzeKeyword':
          const keywordResult = await this.analyzeKeyword(request.keyword);
          sendResponse({ success: true, data: keywordResult });
          break;
          
        case 'checkCRMContact':
          const contactResult = await this.checkCRMContact(request.data);
          sendResponse({ success: true, data: contactResult });
          break;
          
        case 'addToCRM':
          const addResult = await this.addToCRM(request.data);
          sendResponse({ success: true, data: addResult });
          break;
          
        case 'logActivity':
          await this.logActivity(request.activity);
          sendResponse({ success: true });
          break;
          
        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ success: true, data: settings });
          break;
          
        case 'updateSettings':
          await this.updateSettings(request.settings);
          sendResponse({ success: true });
          break;
          
        case 'getCRMContext':
          const crmContext = await this.getCRMContext(request.domain);
          sendResponse({ success: true, data: crmContext });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleActionClick(tab) {
    // Default action when extension icon is clicked
    try {
      if (tab.url && !this.shouldSkipUrl(tab.url)) {
        // Show popup or open dashboard
        chrome.action.openPopup();
      } else {
        // Open main dashboard
        chrome.tabs.create({
          url: 'https://attributeai.com/dashboard'
        });
      }
    } catch (error) {
      console.error('Error handling action click:', error);
    }
  }

  async handleCommand(command) {
    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      switch (command) {
        case 'analyze_keyword':
          await this.triggerKeywordAnalysis(activeTab);
          break;
          
        case 'quick_research':
          chrome.action.openPopup();
          break;
          
        case 'show_crm_panel':
          await this.showCRMPanel(activeTab);
          break;
          
        case 'quick_contact_add':
          await this.quickAddContact(activeTab);
          break;
          
        default:
          console.log('Unknown command:', command);
      }
    } catch (error) {
      console.error('Error handling command:', error);
    }
  }

  async handleNavigationCompleted(details) {
    // Only track main frame navigation
    if (details.frameId !== 0) return;
    
    try {
      const domain = this.extractDomain(details.url);
      
      // Update navigation history for CRM context
      await this.updateNavigationHistory({
        url: details.url,
        domain: domain,
        timestamp: new Date().toISOString(),
        tabId: details.tabId
      });
      
    } catch (error) {
      console.error('Error handling navigation:', error);
    }
  }

  shouldSkipUrl(url) {
    const skipPatterns = [
      'chrome://',
      'chrome-extension://',
      'moz-extension://',
      'edge://',
      'about:',
      'data:',
      'blob:',
      'file://'
    ];
    
    const skipDomains = [
      'google.com/search',
      'bing.com/search',
      'duckduckgo.com'
    ];
    
    return skipPatterns.some(pattern => url.startsWith(pattern)) ||
           skipDomains.some(domain => url.includes(domain));
  }

  extractDomain(url) {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch {
      return null;
    }
  }

  async isBusinessWebsite(domain) {
    if (!domain) return false;
    
    // Skip obvious non-business domains
    const nonBusinessDomains = [
      'google.com', 'youtube.com', 'facebook.com', 'twitter.com',
      'instagram.com', 'linkedin.com', 'reddit.com', 'wikipedia.org',
      'gmail.com', 'outlook.com', 'yahoo.com'
    ];
    
    return !nonBusinessDomains.includes(domain);
  }

  async injectWebsiteIntelligence(tabId, domain) {
    try {
      // Check if already injected
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => !!window.attributeAIWebsiteIntelligence
      });
      
      if (!results[0]?.result) {
        // Inject website intelligence script
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ['content/website-intelligence.js']
        });
        
        await chrome.scripting.insertCSS({
          target: { tabId },
          files: ['content/website-overlay.css']
        });
        
        console.log('✅ Website intelligence injected for:', domain);
      }
    } catch (error) {
      console.error('Error injecting website intelligence:', error);
    }
  }

  async checkCRMContext(domain, tab) {
    try {
      // Check if domain exists in CRM
      const crmContext = await this.fetchCRMContext(domain);
      
      if (crmContext) {
        // Store context for quick access
        this.crmData.set(domain, crmContext);
        
        // Update extension badge if company is known
        if (crmContext.company) {
          chrome.action.setBadgeText({
            tabId: tab.id,
            text: '●'
          });
          chrome.action.setBadgeBackgroundColor({
            color: '#10b981'
          });
        }
      }
    } catch (error) {
      console.error('Error checking CRM context:', error);
    }
  }

  async fetchCRMContext(domain) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/crm/companies/check-domain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ domain })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching CRM context:', error);
    }
    
    return null;
  }

  async logTabActivity(context) {
    try {
      const settings = await this.getSettings();
      if (!settings.crmTracking) return;
      
      // Batch activities to avoid too many API calls
      await this.queueActivity({
        type: 'tab_visit',
        domain: context.domain,
        url: context.url,
        title: context.title,
        timestamp: context.timestamp
      });
      
    } catch (error) {
      console.error('Error logging tab activity:', error);
    }
  }

  async queueActivity(activity) {
    // Get existing queue
    const result = await chrome.storage.local.get(['activityQueue']);
    const queue = result.activityQueue || [];
    
    // Add new activity
    queue.push(activity);
    
    // Store updated queue
    await chrome.storage.local.set({ activityQueue: queue });
    
    // Process queue if it's getting large
    if (queue.length >= 10) {
      await this.processActivityQueue();
    }
  }

  async processActivityQueue() {
    try {
      const result = await chrome.storage.local.get(['activityQueue']);
      const queue = result.activityQueue || [];
      
      if (queue.length === 0) return;
      
      // Send activities to API
      const response = await fetch(`${this.apiBaseUrl}/crm/activities/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ activities: queue })
      });
      
      if (response.ok) {
        // Clear processed queue
        await chrome.storage.local.set({ activityQueue: [] });
        console.log(`✅ Processed ${queue.length} activities`);
      }
    } catch (error) {
      console.error('Error processing activity queue:', error);
    }
  }

  async updateNavigationHistory(navigation) {
    try {
      // Store recent navigation for context
      const result = await chrome.storage.local.get(['navigationHistory']);
      let history = result.navigationHistory || [];
      
      // Add new navigation
      history.unshift(navigation);
      
      // Keep only last 50 navigations
      history = history.slice(0, 50);
      
      await chrome.storage.local.set({ navigationHistory: history });
    } catch (error) {
      console.error('Error updating navigation history:', error);
    }
  }

  async triggerKeywordAnalysis(tab) {
    try {
      // Extract keywords from current page
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Simple keyword extraction
          const title = document.title;
          const description = document.querySelector('meta[name="description"]')?.content || '';
          const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.textContent);
          
          return {
            title,
            description,
            headings: h1s,
            keywords: [title, ...h1s].filter(text => text && text.length > 3)
          };
        }
      });
      
      if (results[0]?.result?.keywords?.length > 0) {
        // Open popup with first keyword
        chrome.action.openPopup();
        
        // Send keyword to popup
        setTimeout(() => {
          chrome.runtime.sendMessage({
            action: 'autoAnalyzeKeyword',
            keyword: results[0].result.keywords[0]
          });
        }, 500);
      }
    } catch (error) {
      console.error('Error triggering keyword analysis:', error);
    }
  }

  async showCRMPanel(tab) {
    try {
      const domain = this.extractDomain(tab.url);
      if (!domain) return;
      
      // Inject and show CRM panel
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (domain) => {
          if (window.websiteIntelligence) {
            window.websiteIntelligence.toggleContextPanel();
          }
        },
        args: [domain]
      });
    } catch (error) {
      console.error('Error showing CRM panel:', error);
    }
  }

  async quickAddContact(tab) {
    try {
      const domain = this.extractDomain(tab.url);
      if (!domain) return;
      
      // Extract contact info from page
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const emails = document.body.innerText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];
          return {
            emails: [...new Set(emails)].slice(0, 3),
            domain: window.location.hostname.replace('www.', ''),
            title: document.title
          };
        }
      });
      
      if (results[0]?.result) {
        const contactData = results[0].result;
        
        // Open CRM with pre-filled data
        const params = new URLSearchParams({
          email: contactData.emails[0] || '',
          domain: contactData.domain,
          source: 'extension_quick_add'
        });
        
        chrome.tabs.create({
          url: `https://attributeai.com/crm/contacts/new?${params.toString()}`
        });
      }
    } catch (error) {
      console.error('Error quick adding contact:', error);
    }
  }

  async openTab(url, options = {}) {
    try {
      await chrome.tabs.create({
        url,
        active: options.active !== false
      });
    } catch (error) {
      console.error('Error opening tab:', error);
    }
  }

  async analyzeKeyword(keyword) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/keyword-intelligence/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ keyword })
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing keyword:', error);
      throw error;
    }
  }

  async checkCRMContact(data) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/crm/contacts/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error checking CRM contact:', error);
    }
    
    return null;
  }

  async addToCRM(data) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/crm/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          ...data,
          source: 'Browser Extension'
        })
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to add to CRM');
      }
    } catch (error) {
      console.error('Error adding to CRM:', error);
      throw error;
    }
  }

  async logActivity(activity) {
    await this.queueActivity(activity);
  }

  async getSettings() {
    const result = await chrome.storage.sync.get(['settings']);
    return result.settings || {
      autoAnalyze: true,
      crmTracking: true,
      keywordSuggestions: true,
      notifications: true,
      syncInterval: 5
    };
  }

  async updateSettings(settings) {
    await chrome.storage.sync.set({ settings });
  }

  async getCRMContext(domain) {
    // Check cache first
    if (this.crmData.has(domain)) {
      return this.crmData.get(domain);
    }
    
    // Fetch from API
    const context = await this.fetchCRMContext(domain);
    if (context) {
      this.crmData.set(domain, context);
    }
    
    return context;
  }

  async initializeUserSession() {
    try {
      const result = await chrome.storage.sync.get(['userProfile', 'authToken']);
      this.userSession = result;
      
      console.log('👤 User session initialized');
    } catch (error) {
      console.error('Error initializing user session:', error);
    }
  }

  async getAuthToken() {
    const result = await chrome.storage.sync.get(['authToken']);
    return result.authToken || 'demo-token';
  }

  setupPeriodicSync() {
    // Process activity queue every 5 minutes
    setInterval(() => {
      this.processActivityQueue();
    }, 5 * 60 * 1000);
    
    // Sync CRM data every 10 minutes
    setInterval(() => {
      this.syncCRMData();
    }, 10 * 60 * 1000);
  }

  async syncCRMData() {
    try {
      // Sync recent CRM updates
      const response = await fetch(`${this.apiBaseUrl}/crm/sync/recent`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update local cache
        data.companies?.forEach(company => {
          this.crmData.set(company.domain, { company, contacts: company.contacts });
        });
        
        console.log('🔄 CRM data synced');
      }
    } catch (error) {
      console.error('Error syncing CRM data:', error);
    }
  }

  showNotification(message, options = {}) {
    try {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'AttributeAI',
        message,
        ...options
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
}

// Initialize background service
new AttributeAIBackground();
