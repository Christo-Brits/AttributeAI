// LinkedIn Integration for AttributeAI CRM
// Detects contacts, extracts profile data, and integrates with CRM

class LinkedInCRMIntegration {
  constructor() {
    this.apiBaseUrl = 'https://attributeai.com/api';
    this.crmPanel = null;
    this.currentProfile = null;
    this.isProcessing = false;
    
    this.init();
  }

  async init() {
    console.log('🔗 AttributeAI LinkedIn CRM Integration loaded');
    
    // Wait for page to fully load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  async setup() {
    // Detect if we're on a profile page
    if (this.isProfilePage()) {
      await this.extractProfileData();
      this.addCRMPanel();
      this.setupObserver();
    }
    
    // Add floating action button for quick CRM access
    this.addFloatingCRMButton();
  }

  isProfilePage() {
    return window.location.pathname.includes('/in/') || 
           window.location.pathname.includes('/profile/view/');
  }

  async extractProfileData() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const profile = {
        firstName: this.extractFirstName(),
        lastName: this.extractLastName(),
        fullName: this.extractFullName(),
        headline: this.extractHeadline(),
        company: this.extractCurrentCompany(),
        position: this.extractCurrentPosition(),
        location: this.extractLocation(),
        profileUrl: window.location.href.split('?')[0],
        avatar: this.extractProfileImage(),
        connections: this.extractConnectionCount(),
        about: this.extractAbout(),
        experience: this.extractExperience(),
        education: this.extractEducation(),
        skills: this.extractSkills(),
        contactInfo: this.extractContactInfo(),
        timestamp: new Date().toISOString()
      };

      this.currentProfile = profile;
      
      // Check if this contact already exists in CRM
      await this.checkExistingContact(profile);
      
      console.log('✅ LinkedIn profile extracted:', profile);
      
    } catch (error) {
      console.error('❌ Error extracting LinkedIn profile:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  extractFullName() {
    const selectors = [
      'h1.text-heading-xlarge',
      '.pv-text-details__left-panel h1',
      '.pv-top-card--list h1',
      '[data-generated-suggestion-target]'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element.textContent.trim();
    }
    return null;
  }

  extractFirstName() {
    const fullName = this.extractFullName();
    return fullName ? fullName.split(' ')[0] : null;
  }

  extractLastName() {
    const fullName = this.extractFullName();
    if (!fullName) return null;
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : null;
  }

  extractHeadline() {
    const selectors = [
      '.text-body-medium.break-words',
      '.pv-text-details__left-panel .text-body-medium',
      '.pv-top-card--list .text-body-medium'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim().length > 10) {
        return element.textContent.trim();
      }
    }
    return null;
  }

  extractCurrentCompany() {
    const selectors = [
      '.pv-text-details__right-panel .inline-show-more-text',
      '.pv-entity__summary-info h3',
      '.experience-item__title'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element.textContent.trim();
    }
    return null;
  }

  extractCurrentPosition() {
    const headline = this.extractHeadline();
    if (headline && headline.includes(' at ')) {
      return headline.split(' at ')[0].trim();
    }
    return headline;
  }

  extractLocation() {
    const selectors = [
      '.pv-text-details__left-panel .text-body-small.inline.t-black--light',
      '.pv-top-card--list .text-body-small'
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.includes(',')) {
        return element.textContent.trim();
      }
    }
    return null;
  }

  extractProfileImage() {
    const img = document.querySelector('.pv-top-card__photo img, .profile-photo-edit__preview img');
    return img ? img.src : null;
  }

  extractConnectionCount() {
    const connectionElement = document.querySelector('.pv-top-card--list-bullet .t-black--light');
    if (connectionElement) {
      const text = connectionElement.textContent;
      const match = text.match(/(\d+[\+,\d]*)\s*connection/i);
      return match ? match[1] : null;
    }
    return null;
  }

  extractAbout() {
    const aboutSection = document.querySelector('.pv-about-section .pv-about__summary-text');
    return aboutSection ? aboutSection.textContent.trim() : null;
  }

  extractExperience() {
    const experiences = [];
    const experienceItems = document.querySelectorAll('.pv-entity__summary-info');
    
    experienceItems.forEach(item => {
      const title = item.querySelector('h3')?.textContent?.trim();
      const company = item.querySelector('.pv-entity__secondary-title')?.textContent?.trim();
      const duration = item.querySelector('.pv-entity__bullet-item')?.textContent?.trim();
      
      if (title) {
        experiences.push({ title, company, duration });
      }
    });
    
    return experiences.slice(0, 3); // Top 3 experiences
  }

  extractEducation() {
    const education = [];
    const educationItems = document.querySelectorAll('.pv-education-entity');
    
    educationItems.forEach(item => {
      const school = item.querySelector('.pv-entity__school-name')?.textContent?.trim();
      const degree = item.querySelector('.pv-entity__degree-name')?.textContent?.trim();
      
      if (school) {
        education.push({ school, degree });
      }
    });
    
    return education.slice(0, 2); // Top 2 education entries
  }

  extractSkills() {
    const skills = [];
    const skillElements = document.querySelectorAll('.pv-skill-category-entity__name');
    
    skillElements.forEach(skill => {
      const skillName = skill.textContent.trim();
      if (skillName) skills.push(skillName);
    });
    
    return skills.slice(0, 10); // Top 10 skills
  }

  extractContactInfo() {
    // This would require additional API calls or premium LinkedIn access
    // For now, we'll extract what's publicly available
    return {
      email: null, // Would need to be manually added or found through other means
      phone: null,
      website: null
    };
  }

  async checkExistingContact(profile) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/crm/contacts/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedinUrl: profile.profileUrl,
          name: profile.fullName,
          company: profile.company
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        this.currentProfile.existingContact = result.contact;
        this.currentProfile.isExisting = !!result.contact;
      }
    } catch (error) {
      console.error('Error checking existing contact:', error);
    }
  }

  addCRMPanel() {
    if (this.crmPanel) return;

    const panel = document.createElement('div');
    panel.className = 'attributeai-crm-panel';
    panel.innerHTML = this.getCRMPanelHTML();
    
    // Find the best insertion point
    const insertionPoint = document.querySelector('.pv-top-card__content') || 
                          document.querySelector('.pv-text-details__left-panel') ||
                          document.querySelector('main');
    
    if (insertionPoint) {
      insertionPoint.insertAdjacentElement('afterend', panel);
      this.crmPanel = panel;
      this.bindCRMPanelEvents();
    }
  }

  getCRMPanelHTML() {
    const profile = this.currentProfile;
    const isExisting = profile?.isExisting;
    
    return `
      <div class="attributeai-linkedin-panel">
        <div class="panel-header">
          <img src="${chrome.runtime.getURL('icons/icon32.png')}" alt="AttributeAI" class="panel-logo">
          <span class="panel-title">AttributeAI CRM</span>
          <div class="panel-status ${isExisting ? 'existing' : 'new'}">
            ${isExisting ? '✓ In CRM' : '+ New Contact'}
          </div>
        </div>
        
        <div class="panel-content">
          ${isExisting ? this.getExistingContactHTML() : this.getNewContactHTML()}
        </div>
        
        <div class="panel-actions">
          ${isExisting ? `
            <button class="btn-primary" id="view-contact">View in CRM</button>
            <button class="btn-secondary" id="update-contact">Update Info</button>
          ` : `
            <button class="btn-primary" id="add-contact">Add to CRM</button>
            <button class="btn-secondary" id="save-for-later">Save for Later</button>
          `}
        </div>
        
        <div class="panel-quick-actions">
          <button class="quick-action" id="log-activity">
            <span class="icon">📝</span>
            <span>Log Activity</span>
          </button>
          <button class="quick-action" id="create-deal">
            <span class="icon">💰</span>
            <span>Create Deal</span>
          </button>
          <button class="quick-action" id="schedule-followup">
            <span class="icon">📅</span>
            <span>Schedule</span>
          </button>
        </div>
      </div>
    `;
  }

  getExistingContactHTML() {
    const contact = this.currentProfile.existingContact;
    return `
      <div class="contact-summary">
        <h4>${contact.name}</h4>
        <p class="company">${contact.company}</p>
        <p class="last-activity">Last activity: ${this.formatDate(contact.lastActivity)}</p>
        <div class="deal-status">
          <span class="label">Current Deal:</span>
          <span class="value">${contact.currentDeal || 'None'}</span>
        </div>
      </div>
    `;
  }

  getNewContactHTML() {
    const profile = this.currentProfile;
    return `
      <div class="new-contact-preview">
        <h4>${profile.fullName}</h4>
        <p class="position">${profile.position || profile.headline}</p>
        <p class="company">${profile.company}</p>
        <p class="location">${profile.location}</p>
        <div class="confidence-score">
          <span class="label">Profile Quality:</span>
          <span class="score">${this.calculateProfileScore()}%</span>
        </div>
      </div>
    `;
  }

  calculateProfileScore() {
    const profile = this.currentProfile;
    let score = 0;
    
    if (profile.fullName) score += 20;
    if (profile.company) score += 20;
    if (profile.position || profile.headline) score += 20;
    if (profile.location) score += 10;
    if (profile.about) score += 10;
    if (profile.experience?.length > 0) score += 10;
    if (profile.avatar) score += 10;
    
    return score;
  }

  bindCRMPanelEvents() {
    // View existing contact
    const viewBtn = document.getElementById('view-contact');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => this.viewContactInCRM());
    }

    // Add new contact
    const addBtn = document.getElementById('add-contact');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addContactToCRM());
    }

    // Quick actions
    document.getElementById('log-activity')?.addEventListener('click', () => this.logActivity());
    document.getElementById('create-deal')?.addEventListener('click', () => this.createDeal());
    document.getElementById('schedule-followup')?.addEventListener('click', () => this.scheduleFollowup());
  }

  async addContactToCRM() {
    if (!this.currentProfile) return;

    try {
      const response = await fetch(`${this.apiBaseUrl}/crm/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.currentProfile,
          source: 'LinkedIn Extension',
          tags: ['LinkedIn', 'Prospect']
        })
      });

      if (response.ok) {
        const newContact = await response.json();
        this.showNotification('✅ Contact added to CRM successfully!');
        this.currentProfile.existingContact = newContact;
        this.currentProfile.isExisting = true;
        this.updateCRMPanel();
      } else {
        throw new Error('Failed to add contact');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      this.showNotification('❌ Failed to add contact. Please try again.');
    }
  }

  viewContactInCRM() {
    const contactId = this.currentProfile.existingContact?.id;
    if (contactId) {
      const url = `https://attributeai.com/crm/contacts/${contactId}`;
      chrome.runtime.sendMessage({
        action: 'openTab',
        url: url
      });
    }
  }

  async logActivity() {
    const activity = {
      contactId: this.currentProfile.existingContact?.id,
      type: 'LinkedIn Profile View',
      description: `Viewed LinkedIn profile: ${window.location.href}`,
      timestamp: new Date().toISOString(),
      metadata: {
        profileUrl: window.location.href,
        source: 'LinkedIn Extension'
      }
    };

    try {
      await fetch(`${this.apiBaseUrl}/crm/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
      
      this.showNotification('📝 Activity logged successfully!');
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  createDeal() {
    const contactId = this.currentProfile.existingContact?.id;
    const url = `https://attributeai.com/crm/deals/new?contactId=${contactId}`;
    chrome.runtime.sendMessage({
      action: 'openTab',
      url: url
    });
  }

  scheduleFollowup() {
    const contactId = this.currentProfile.existingContact?.id;
    const url = `https://attributeai.com/crm/calendar/new?contactId=${contactId}`;
    chrome.runtime.sendMessage({
      action: 'openTab',
      url: url
    });
  }

  updateCRMPanel() {
    if (this.crmPanel) {
      const content = this.crmPanel.querySelector('.panel-content');
      const actions = this.crmPanel.querySelector('.panel-actions');
      
      if (content && actions) {
        content.innerHTML = this.currentProfile.isExisting ? 
          this.getExistingContactHTML() : this.getNewContactHTML();
        actions.innerHTML = this.currentProfile.isExisting ? `
          <button class="btn-primary" id="view-contact">View in CRM</button>
          <button class="btn-secondary" id="update-contact">Update Info</button>
        ` : `
          <button class="btn-primary" id="add-contact">Add to CRM</button>
          <button class="btn-secondary" id="save-for-later">Save for Later</button>
        `;
        
        this.bindCRMPanelEvents();
      }
    }
  }

  addFloatingCRMButton() {
    const button = document.createElement('div');
    button.className = 'attributeai-floating-crm';
    button.innerHTML = `
      <div class="floating-btn" title="AttributeAI CRM">
        <img src="${chrome.runtime.getURL('icons/icon32.png')}" alt="CRM">
      </div>
    `;
    
    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        action: 'openTab',
        url: 'https://attributeai.com/crm'
      });
    });
    
    document.body.appendChild(button);
  }

  setupObserver() {
    // Watch for navigation changes within LinkedIn
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if we've navigated to a new profile
          setTimeout(() => {
            if (this.isProfilePage() && !this.isProcessing) {
              this.extractProfileData();
            }
          }, 1000);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
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

// Initialize LinkedIn CRM Integration
new LinkedInCRMIntegration();
