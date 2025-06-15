// Website Intelligence for AttributeAI CRM
// Detects company websites, shows CRM context, enables quick actions

class WebsiteIntelligence {
  constructor() {
    this.apiBaseUrl = 'https://attributeai.com/api';
    this.currentDomain = this.extractDomain(window.location.href);
    this.companyInfo = null;
    this.contacts = null;
    this.isProcessing = false;
    this.contextPanel = null;
    
    this.init();
  }

  async init() {
    console.log('🌐 AttributeAI Website Intelligence loaded for:', this.currentDomain);
    
    // Skip certain domains
    if (this.shouldSkipDomain(this.currentDomain)) {
      return;
    }
    
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  async setup() {
    await this.analyzeWebsite();
    this.addFloatingContextButton();
    this.setupKeyboardShortcuts();
  }

  shouldSkipDomain(domain) {
    const skipDomains = [
      'google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com',
      'facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com',
      'youtube.com', 'gmail.com', 'outlook.com', 'linkedin.com',
      'attributeai.com', 'localhost', '127.0.0.1'
    ];
    
    return skipDomains.some(skip => domain.includes(skip));
  }

  extractDomain(url) {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch {
      return window.location.hostname.replace('www.', '');
    }
  }

  async analyzeWebsite() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Extract website data
      const websiteData = {
        domain: this.currentDomain,
        url: window.location.href,
        title: document.title,
        description: this.extractMetaDescription(),
        keywords: this.extractMetaKeywords(),
        ogData: this.extractOpenGraphData(),
        contactInfo: this.extractContactInfo(),
        companyInfo: this.extractCompanyInfo(),
        technology: this.detectTechnology(),
        content: this.extractMainContent(),
        timestamp: new Date().toISOString()
      };

      // Check if this company exists in CRM
      await this.checkCompanyInCRM(websiteData);
      
      console.log('✅ Website analyzed:', websiteData);
      
    } catch (error) {
      console.error('❌ Error analyzing website:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  extractMetaDescription() {
    const meta = document.querySelector('meta[name="description"]');
    return meta ? meta.getAttribute('content') : null;
  }

  extractMetaKeywords() {
    const meta = document.querySelector('meta[name="keywords"]');
    return meta ? meta.getAttribute('content') : null;
  }

  extractOpenGraphData() {
    const ogData = {};
    const ogMetas = document.querySelectorAll('meta[property^="og:"]');
    
    ogMetas.forEach(meta => {
      const property = meta.getAttribute('property').replace('og:', '');
      ogData[property] = meta.getAttribute('content');
    });
    
    return ogData;
  }

  extractContactInfo() {
    const contacts = {
      emails: this.findEmails(),
      phones: this.findPhones(),
      addresses: this.findAddresses(),
      socialMedia: this.findSocialLinks()
    };
    
    return contacts;
  }

  findEmails() {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const pageText = document.body.innerText;
    const emails = pageText.match(emailRegex) || [];
    
    // Filter out common generic emails and images
    return [...new Set(emails)].filter(email => 
      !email.includes('.jpg') && 
      !email.includes('.png') && 
      !email.includes('example.com') &&
      !email.includes('test@')
    ).slice(0, 5);
  }

  findPhones() {
    const phoneRegex = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
    const pageText = document.body.innerText;
    const phones = pageText.match(phoneRegex) || [];
    
    return [...new Set(phones)].slice(0, 3);
  }

  findAddresses() {
    // Simple address detection - could be enhanced with more sophisticated patterns
    const addressElements = document.querySelectorAll('[class*="address"], [class*="location"], [class*="contact"]');
    const addresses = [];
    
    addressElements.forEach(element => {
      const text = element.textContent.trim();
      if (text.length > 20 && text.length < 200 && text.includes(',')) {
        addresses.push(text);
      }
    });
    
    return addresses.slice(0, 2);
  }

  findSocialLinks() {
    const socialPlatforms = {
      linkedin: /linkedin\.com\/company\/([^\/\s]+)/,
      twitter: /twitter\.com\/([^\/\s]+)/,
      facebook: /facebook\.com\/([^\/\s]+)/,
      instagram: /instagram\.com\/([^\/\s]+)/
    };
    
    const links = document.querySelectorAll('a[href]');
    const socialMedia = {};
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      for (const [platform, regex] of Object.entries(socialPlatforms)) {
        const match = href.match(regex);
        if (match && !socialMedia[platform]) {
          socialMedia[platform] = href;
        }
      }
    });
    
    return socialMedia;
  }

  extractCompanyInfo() {
    const info = {
      name: this.extractCompanyName(),
      industry: this.guessIndustry(),
      size: this.guessCompanySize(),
      founded: this.extractFounded(),
      description: this.extractCompanyDescription()
    };
    
    return info;
  }

  extractCompanyName() {
    // Try multiple strategies to find company name
    const strategies = [
      () => document.querySelector('meta[property="og:site_name"]')?.getAttribute('content'),
      () => document.title.split(' - ')[0].split(' | ')[0],
      () => document.querySelector('.company-name, .brand-name, .logo-text')?.textContent?.trim(),
      () => document.querySelector('h1')?.textContent?.trim()
    ];
    
    for (const strategy of strategies) {
      const result = strategy();
      if (result && result.length > 2 && result.length < 50) {
        return result;
      }
    }
    
    return this.currentDomain.split('.')[0];
  }

  guessIndustry() {
    const pageText = document.body.innerText.toLowerCase();
    const industries = {
      'technology': ['software', 'tech', 'ai', 'machine learning', 'saas', 'cloud'],
      'healthcare': ['health', 'medical', 'hospital', 'clinic', 'pharmaceutical'],
      'finance': ['bank', 'financial', 'investment', 'insurance', 'fintech'],
      'ecommerce': ['shop', 'store', 'buy', 'cart', 'ecommerce', 'retail'],
      'education': ['school', 'university', 'course', 'learning', 'education'],
      'real estate': ['property', 'real estate', 'homes', 'rental', 'mortgage'],
      'marketing': ['marketing', 'advertising', 'agency', 'digital marketing'],
      'consulting': ['consulting', 'services', 'advisory', 'strategy']
    };
    
    for (const [industry, keywords] of Object.entries(industries)) {
      if (keywords.some(keyword => pageText.includes(keyword))) {
        return industry;
      }
    }
    
    return 'other';
  }

  guessCompanySize() {
    const pageText = document.body.innerText.toLowerCase();
    if (pageText.includes('enterprise') || pageText.includes('fortune')) return 'large';
    if (pageText.includes('startup') || pageText.includes('small business')) return 'small';
    return 'medium';
  }

  extractFounded() {
    const yearRegex = /founded\s+(?:in\s+)?(\d{4})|established\s+(?:in\s+)?(\d{4})|since\s+(\d{4})/i;
    const match = document.body.innerText.match(yearRegex);
    return match ? (match[1] || match[2] || match[3]) : null;
  }

  extractCompanyDescription() {
    const selectors = [
      'meta[name="description"]',
      '.company-description',
      '.about-us',
      '.hero-description',
      'p:contains("we are")',
      'p:contains("company")'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const content = element.getAttribute('content') || element.textContent;
        if (content && content.length > 50 && content.length < 500) {
          return content.trim();
        }
      }
    }
    
    return null;
  }

  detectTechnology() {
    const technologies = [];
    
    // Check for common technologies
    if (window.jQuery) technologies.push('jQuery');
    if (window.React) technologies.push('React');
    if (window.Vue) technologies.push('Vue.js');
    if (window.angular) technologies.push('Angular');
    if (document.querySelector('[data-shopify]')) technologies.push('Shopify');
    if (document.querySelector('.woocommerce')) technologies.push('WooCommerce');
    if (document.querySelector('#wp-admin-bar-root')) technologies.push('WordPress');
    if (window.gtag || window.ga) technologies.push('Google Analytics');
    if (window.fbq) technologies.push('Facebook Pixel');
    
    return technologies;
  }

  extractMainContent() {
    // Extract key content points for analysis
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
      .map(h => h.textContent.trim())
      .filter(text => text.length > 5)
      .slice(0, 10);
    
    const paragraphs = Array.from(document.querySelectorAll('p'))
      .map(p => p.textContent.trim())
      .filter(text => text.length > 20)
      .slice(0, 5);
    
    return {
      headings,
      paragraphs: paragraphs.map(p => p.substring(0, 200))
    };
  }

  async checkCompanyInCRM(websiteData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/crm/companies/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: websiteData.domain,
          companyName: websiteData.companyInfo.name,
          emails: websiteData.contactInfo.emails
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        this.companyInfo = result.company;
        this.contacts = result.contacts || [];
        
        console.log('🏢 Company info found:', this.companyInfo);
        console.log('👥 Related contacts:', this.contacts.length);
      }
    } catch (error) {
      console.error('Error checking company in CRM:', error);
    }
  }

  addFloatingContextButton() {
    const button = document.createElement('div');
    button.className = 'attributeai-context-button';
    button.innerHTML = `
      <div class="context-btn" title="AttributeAI CRM Context">
        <img src="${chrome.runtime.getURL('icons/icon32.png')}" alt="CRM">
        ${this.companyInfo ? '<span class="indicator known"></span>' : '<span class="indicator new"></span>'}
      </div>
    `;
    
    button.addEventListener('click', () => this.toggleContextPanel());
    document.body.appendChild(button);
  }

  async logWebsiteVisit() {
    try {
      const activity = {
        type: 'Website Visit',
        description: `Visited ${this.currentDomain}`,
        url: window.location.href,
        title: document.title,
        companyId: this.companyInfo?.id,
        timestamp: new Date().toISOString(),
        metadata: {
          domain: this.currentDomain,
          technology: this.detectTechnology(),
          source: 'Website Extension'
        }
      };

      await fetch(`${this.apiBaseUrl}/crm/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
      
      this.showNotification('📝 Website visit logged successfully!');
    } catch (error) {
      console.error('Error logging website visit:', error);
      this.showNotification('❌ Failed to log visit.');
    }
  }

  async analyzeWithAI() {
    try {
      this.showNotification('🧠 Analyzing website with AI...');
      
      const analysisData = {
        url: window.location.href,
        domain: this.currentDomain,
        title: document.title,
        description: this.extractMetaDescription(),
        content: this.extractMainContent(),
        companyInfo: this.extractCompanyInfo(),
        contactInfo: this.extractContactInfo(),
        technology: this.detectTechnology()
      };

      const response = await fetch(`${this.apiBaseUrl}/ai/analyze-website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisData)
      });

      if (response.ok) {
        const analysis = await response.json();
        this.showAIAnalysisModal(analysis);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing with AI:', error);
      this.showNotification('❌ AI analysis failed. Please try again.');
    }
  }

  showAIAnalysisModal(analysis) {
    const modal = document.createElement('div');
    modal.className = 'attributeai-ai-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>🧠 AI Website Analysis</h3>
          <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="analysis-section">
            <h4>Company Intelligence</h4>
            <p>${analysis.companyInsights || 'No specific insights available.'}</p>
          </div>
          <div class="analysis-section">
            <h4>Business Opportunities</h4>
            <p>${analysis.opportunities || 'No specific opportunities identified.'}</p>
          </div>
          <div class="analysis-section">
            <h4>Recommended Next Steps</h4>
            <ul>
              ${(analysis.recommendations || []).map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" id="save-analysis">Save to CRM</button>
          <button class="btn-secondary" id="close-modal">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());
    modal.querySelector('#save-analysis').addEventListener('click', () => {
      this.saveAnalysisToCRM(analysis);
      modal.remove();
    });
  }

  async saveAnalysisToCRM(analysis) {
    try {
      await fetch(`${this.apiBaseUrl}/crm/companies/${this.companyInfo?.id}/analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      });
      
      this.showNotification('✅ AI analysis saved to CRM!');
    } catch (error) {
      console.error('Error saving analysis:', error);
      this.showNotification('❌ Failed to save analysis.');
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+C for CRM panel
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        this.toggleContextPanel();
      }
      
      // Ctrl+Shift+N for quick add contact
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        this.quickAddContact();
      }
    });
  }

  quickAddContact() {
    const emails = this.extractContactInfo().emails;
    if (emails.length > 0) {
      const url = `https://attributeai.com/crm/contacts/new?email=${emails[0]}&company=${this.extractCompanyName()}&source=website`;
      chrome.runtime.sendMessage({
        action: 'openTab',
        url: url
      });
    } else {
      this.showNotification('ℹ️ No email addresses found on this page.');
    }
  }

  toggleContextPanel() {
    if (this.contextPanel) {
      this.contextPanel.remove();
      this.contextPanel = null;
    } else {
      this.showContextPanel();
    }
  }

  showContextPanel() {
    const panel = document.createElement('div');
    panel.className = 'attributeai-context-panel';
    panel.innerHTML = this.getContextPanelHTML();
    
    document.body.appendChild(panel);
    this.contextPanel = panel;
    this.bindContextPanelEvents();
    
    // Close panel when clicking outside
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !e.target.closest('.attributeai-context-button')) {
          this.toggleContextPanel();
        }
      }, { once: true });
    }, 100);
  }

  getContextPanelHTML() {
    const hasCompany = !!this.companyInfo;
    const hasContacts = this.contacts && this.contacts.length > 0;
    
    return `
      <div class="context-panel-header">
        <div class="panel-title">
          <img src="${chrome.runtime.getURL('icons/icon32.png')}" alt="AttributeAI">
          <span>CRM Context</span>
        </div>
        <button class="close-btn" id="close-context">×</button>
      </div>
      
      <div class="context-panel-content">
        <div class="company-section">
          <h4>${hasCompany ? '🏢 Known Company' : '🆕 New Company'}</h4>
          <div class="company-info">
            <div class="company-name">${this.extractCompanyName()}</div>
            <div class="company-domain">${this.currentDomain}</div>
            ${hasCompany ? `
              <div class="company-details">
                <p><strong>Industry:</strong> ${this.companyInfo.industry || 'Unknown'}</p>
                <p><strong>Size:</strong> ${this.companyInfo.size || 'Unknown'}</p>
                <p><strong>Last Contact:</strong> ${this.formatDate(this.companyInfo.lastContact)}</p>
              </div>
            ` : `
              <div class="new-company-actions">
                <button class="btn-primary" id="add-company">Add to CRM</button>
                <button class="btn-secondary" id="analyze-company">AI Analysis</button>
              </div>
            `}
          </div>
        </div>
        
        ${hasContacts ? `
          <div class="contacts-section">
            <h4>👥 Related Contacts (${this.contacts.length})</h4>
            <div class="contacts-list">
              ${this.contacts.slice(0, 3).map(contact => `
                <div class="contact-item">
                  <div class="contact-name">${contact.name}</div>
                  <div class="contact-role">${contact.position || contact.title}</div>
                  <div class="contact-actions">
                    <button class="quick-action" onclick="this.viewContact('${contact.id}')">View</button>
                    <button class="quick-action" onclick="this.logActivity('${contact.id}')">Log Visit</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="quick-actions-section">
          <h4>⚡ Quick Actions</h4>
          <div class="quick-actions-grid">
            <button class="quick-action-btn" id="find-contacts">
              <span class="icon">🔍</span>
              <span>Find Contacts</span>
            </button>
            <button class="quick-action-btn" id="create-deal">
              <span class="icon">💰</span>
              <span>New Deal</span>
            </button>
            <button class="quick-action-btn" id="log-visit">
              <span class="icon">📝</span>
              <span>Log Visit</span>
            </button>
            <button class="quick-action-btn" id="analyze-site">
              <span class="icon">🧠</span>
              <span>AI Analysis</span>
            </button>
          </div>
        </div>
        
        <div class="website-insights">
          <h4>🌐 Website Intelligence</h4>
          <div class="insights-grid">
            <div class="insight-item">
              <span class="label">Technology:</span>
              <span class="value">${this.detectTechnology().join(', ') || 'Unknown'}</span>
            </div>
            <div class="insight-item">
              <span class="label">Industry:</span>
              <span class="value">${this.guessIndustry()}</span>
            </div>
            <div class="insight-item">
              <span class="label">Emails Found:</span>
              <span class="value">${this.extractContactInfo().emails.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="context-panel-footer">
        <button class="open-crm-btn" id="open-full-crm">Open Full CRM</button>
      </div>
    `;
  }

  bindContextPanelEvents() {
    // Close button
    document.getElementById('close-context')?.addEventListener('click', () => {
      this.toggleContextPanel();
    });

    // Add company
    document.getElementById('add-company')?.addEventListener('click', () => {
      this.addCompanyToCRM();
    });

    // Quick actions
    document.getElementById('find-contacts')?.addEventListener('click', () => {
      this.findContactsOnPage();
    });

    document.getElementById('create-deal')?.addEventListener('click', () => {
      this.createNewDeal();
    });

    document.getElementById('log-visit')?.addEventListener('click', () => {
      this.logWebsiteVisit();
    });

    document.getElementById('analyze-site')?.addEventListener('click', () => {
      this.analyzeWithAI();
    });

    // Open full CRM
    document.getElementById('open-full-crm')?.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        action: 'openTab',
        url: 'https://attributeai.com/crm'
      });
    });
  }

  async addCompanyToCRM() {
    try {
      const companyData = {
        name: this.extractCompanyName(),
        domain: this.currentDomain,
        website: window.location.origin,
        industry: this.guessIndustry(),
        size: this.guessCompanySize(),
        description: this.extractCompanyDescription(),
        contactInfo: this.extractContactInfo(),
        technology: this.detectTechnology(),
        source: 'Website Extension',
        firstVisit: new Date().toISOString()
      };

      const response = await fetch(`${this.apiBaseUrl}/crm/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      });

      if (response.ok) {
        const newCompany = await response.json();
        this.companyInfo = newCompany;
        this.showNotification('✅ Company added to CRM successfully!');
        this.updateContextPanel();
      }
    } catch (error) {
      console.error('Error adding company:', error);
      this.showNotification('❌ Failed to add company. Please try again.');
    }
  }

  updateContextPanel() {
    if (this.contextPanel) {
      this.contextPanel.remove();
      this.contextPanel = null;
      this.showContextPanel();
    }
  }

  findContactsOnPage() {
    this.showNotification('🔍 Scanning page for contact information...');
    
    const emails = this.extractContactInfo().emails;
    if (emails.length > 0) {
      const contactsFound = emails.map(email => ({
        email,
        source: 'page-scan',
        company: this.extractCompanyName()
      }));
      
      // Open CRM with pre-filled contact data
      const url = `https://attributeai.com/crm/contacts/bulk-add?data=${encodeURIComponent(JSON.stringify(contactsFound))}`;
      chrome.runtime.sendMessage({
        action: 'openTab',
        url: url
      });
    } else {
      this.showNotification('ℹ️ No email addresses found on this page.');
    }
  }

  createNewDeal() {
    const companyId = this.companyInfo?.id;
    const url = `https://attributeai.com/crm/deals/new${companyId ? `?companyId=${companyId}` : ''}`;
    chrome.runtime.sendMessage({
      action: 'openTab',
      url: url
    });
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `attributeai-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  formatDate(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}

// Initialize Website Intelligence
new WebsiteIntelligence();
