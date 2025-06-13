  }

  // Message Handlers
  setupMessageHandlers() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'analyzeKeyword':
          const result = await this.performKeywordAnalysis(request.keyword, request.context);
          sendResponse(result);
          break;

        case 'getAnalysisHistory':
          const history = await this.getAnalysisHistory();
          sendResponse({ success: true, data: history });
          break;

        case 'clearHistory':
          await this.clearAnalysisHistory();
          sendResponse({ success: true });
          break;

        case 'updateQuota':
          await this.updateUserQuota(request.usage);
          sendResponse({ success: true });
          break;

        case 'getBadgeData':
          const badgeData = await this.getBadgeData();
          sendResponse(badgeData);
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Message handler error:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async getAnalysisHistory() {
    const result = await chrome.storage.local.get(['attributeai_background_history']);
    return result.attributeai_background_history || [];
  }

  async clearAnalysisHistory() {
    await chrome.storage.local.remove(['attributeai_background_history', 'attributeai_page_analyses']);
  }

  // Badge Updates
  setupBadgeUpdates() {
    this.updateBadge();
    
    // Update badge every 30 minutes
    setInterval(() => {
      this.updateBadge();
    }, 30 * 60 * 1000);
  }

  async updateBadge() {
    try {
      const badgeData = await this.getBadgeData();
      
      if (badgeData.analysisCount > 0) {
        chrome.action.setBadgeText({ text: badgeData.analysisCount.toString() });
        chrome.action.setBadgeBackgroundColor({ color: '#4f46e5' });
      } else {
        chrome.action.setBadgeText({ text: '' });
      }

      // Update badge tooltip
      chrome.action.setTitle({ 
        title: `AttributeAI - ${badgeData.analysisCount} analyses today` 
      });

    } catch (error) {
      console.error('Badge update error:', error);
    }
  }

  async getBadgeData() {
    try {
      const result = await chrome.storage.local.get(['attributeai_background_history']);
      const history = result.attributeai_background_history || [];
      
      // Count analyses from today
      const today = new Date().toDateString();
      const todayAnalyses = history.filter(item => 
        new Date(item.timestamp).toDateString() === today
      );

      return {
        analysisCount: todayAnalyses.length,
        totalAnalyses: history.length,
        lastAnalysis: history[0]?.timestamp || null
      };
    } catch (error) {
      console.error('Badge data error:', error);
      return { analysisCount: 0, totalAnalyses: 0, lastAnalysis: null };
    }
  }

  // Alarms and Periodic Tasks
  setupAlarms() {
    // Daily quota reset check
    chrome.alarms.create('quotaReset', { 
      when: this.getNextMidnight(),
      periodInMinutes: 24 * 60 
    });

    // Weekly cleanup of old data
    chrome.alarms.create('dataCleanup', { 
      when: Date.now() + (7 * 24 * 60 * 60 * 1000),
      periodInMinutes: 7 * 24 * 60 
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
      this.handleAlarm(alarm);
    });
  }

  getNextMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(now.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    return midnight.getTime();
  }

  async handleAlarm(alarm) {
    switch (alarm.name) {
      case 'quotaReset':
        await this.resetDailyQuota();
        break;
      
      case 'dataCleanup':
        await this.cleanupOldData();
        break;
    }
  }

  async resetDailyQuota() {
    try {
      const result = await chrome.storage.sync.get(['attributeai_user']);
      if (result.attributeai_user) {
        const user = result.attributeai_user;
        user.quota = user.quota || {};
        user.quota.used = 0;
        user.quota.percentage = 0;
        
        await chrome.storage.sync.set({ attributeai_user: user });
        console.log('Daily quota reset completed');
      }
    } catch (error) {
      console.error('Quota reset error:', error);
    }
  }

  async cleanupOldData() {
    try {
      const cutoffDate = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago
      
      // Cleanup background history
      const historyResult = await chrome.storage.local.get(['attributeai_background_history']);
      const history = historyResult.attributeai_background_history || [];
      const recentHistory = history.filter(item => item.timestamp > cutoffDate);
      
      // Cleanup page analyses
      const pageResult = await chrome.storage.local.get(['attributeai_page_analyses']);
      const pageAnalyses = pageResult.attributeai_page_analyses || [];
      const recentPageAnalyses = pageAnalyses.filter(item => item.timestamp > cutoffDate);
      
      await chrome.storage.local.set({
        attributeai_background_history: recentHistory,
        attributeai_page_analyses: recentPageAnalyses
      });
      
      console.log('Data cleanup completed');
    } catch (error) {
      console.error('Data cleanup error:', error);
    }
  }

  async updateUserQuota(usage) {
    try {
      const result = await chrome.storage.sync.get(['attributeai_user']);
      if (result.attributeai_user) {
        const user = result.attributeai_user;
        user.quota = user.quota || { used: 0, limit: 1000, percentage: 0 };
        user.quota.used += usage;
        user.quota.percentage = (user.quota.used / user.quota.limit) * 100;
        
        await chrome.storage.sync.set({ attributeai_user: user });
      }
    } catch (error) {
      console.error('Quota update error:', error);
    }
  }

  // Installation and Updates
  async handleInstallation() {
    // Set up initial user data
    const result = await chrome.storage.sync.get(['attributeai_user']);
    if (!result.attributeai_user) {
      const initialUser = {
        id: 'ext-' + Date.now(),
        name: 'Extension User',
        email: 'extension@attributeai.com',
        tier: 'free',
        quota: { used: 0, limit: 1000, percentage: 0 },
        installedAt: Date.now()
      };
      
      await chrome.storage.sync.set({ attributeai_user: initialUser });
    }

    // Show welcome notification
    this.showNotification(
      'AttributeAI extension installed! Right-click on any text to analyze keywords.',
      'Welcome to AttributeAI!'
    );
  }
}

// Handle extension installation and updates
chrome.runtime.onInstalled.addListener((details) => {
  const background = new AttributeAIBackground();
  
  if (details.reason === 'install') {
    background.handleInstallation();
  } else if (details.reason === 'update') {
    console.log('AttributeAI extension updated to version', chrome.runtime.getManifest().version);
  }
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    // "View Details" button
    chrome.tabs.create({ url: 'https://leafy-biscotti-c87e93.netlify.app?tab=keyword-intelligence' });
  } else if (buttonIndex === 1) {
    // "Open Dashboard" button
    chrome.tabs.create({ url: 'https://leafy-biscotti-c87e93.netlify.app' });
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'analyze_keyword':
      chrome.action.openPopup();
      break;
    
    case 'quick_research':
      chrome.action.openPopup();
      break;
  }
});

// Initialize background service
const background = new AttributeAIBackground();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AttributeAIBackground;
}