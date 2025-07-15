// Gmail and Outlook Email Tracking Integration
// Automatically inject tracking pixels and log email activity to AttributeAI CRM

class EmailTracker {
    constructor() {
        this.attributeaiEndpoint = 'https://attributeai.app/api/email-tracking';
        this.supabaseEndpoint = 'https://xpyfoutwwjslivrmbflm.supabase.co/rest/v1';
        this.trackingPixelId = 'attributeai-tracking-pixel';
        this.init();
    }

    init() {
        console.log('🚀 AttributeAI Email Tracker initialized');
        
        // Detect email platform
        if (window.location.hostname.includes('mail.google.com')) {
            this.platform = 'gmail';
            this.initGmailTracking();
        } else if (window.location.hostname.includes('outlook')) {
            this.platform = 'outlook';
            this.initOutlookTracking();
        }
        
        // Listen for messages from background script
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'trackEmailSent') {
                this.logEmailActivity(request.data);
            }
        });
    }

    initGmailTracking() {
        console.log('📧 Initializing Gmail tracking');
        
        // Watch for compose window changes
        this.observeGmailCompose();
        
        // Watch for sent emails
        this.observeGmailSent();
        
        // Add tracking UI to compose window
        this.addGmailTrackingUI();
    }

    initOutlookTracking() {
        console.log('📧 Initializing Outlook tracking');
        
        // Similar implementation for Outlook
        this.observeOutlookCompose();
        this.observeOutlookSent();
        this.addOutlookTrackingUI();
    }

    observeGmailCompose() {
        // Watch for Gmail compose windows
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && 
                        (node.matches('[role="dialog"]') || 
                         node.querySelector('[role="dialog"]'))) {
                        this.detectComposeWindow(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    detectComposeWindow(element) {
        // Look for compose dialog
        const composeDialog = element.matches('[role="dialog"]') ? element : element.querySelector('[role="dialog"]');
        
        if (composeDialog && composeDialog.querySelector('[name="to"]')) {
            console.log('📝 Compose window detected');
            this.addTrackingToCompose(composeDialog);
        }
    }

    addTrackingToCompose(composeElement) {
        // Add AttributeAI tracking controls to compose window
        const trackingPanel = this.createTrackingPanel();
        
        // Find the best place to insert tracking controls
        const toolbar = composeElement.querySelector('[role="toolbar"]') || 
                       composeElement.querySelector('.gU.Up') ||
                       composeElement.querySelector('.aoD.hl');
        
        if (toolbar && !toolbar.querySelector('.attributeai-tracking-panel')) {
            toolbar.appendChild(trackingPanel);
        }
    }

    createTrackingPanel() {
        const panel = document.createElement('div');
        panel.className = 'attributeai-tracking-panel';
        panel.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 8px;
            background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%);
            border-radius: 6px;
            font-size: 12px;
            color: white;
            margin-left: 8px;
        `;
        
        panel.innerHTML = `
            <div style="display: flex; align-items: center; gap: 4px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                </svg>
                <span>AttributeAI</span>
            </div>
            <label style="display: flex; align-items: center; gap: 4px; cursor: pointer;">
                <input type="checkbox" id="attributeai-track-email" checked style="margin: 0;">
                <span>Track</span>
            </label>
        `;
        
        return panel;
    }

    observeGmailSent() {
        // Watch for "Message sent" notifications
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const sentNotification = node.querySelector('[data-message-text*="sent"]') ||
                                               node.querySelector('.bAq .b8 .UC') ||
                                               node.textContent?.includes('Message sent');
                        
                        if (sentNotification) {
                            console.log('📤 Email sent detected');
                            this.handleEmailSent();
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    async handleEmailSent() {
        // Extract email data from the compose window
        const emailData = this.extractEmailData();
        
        if (emailData && this.isTrackingEnabled()) {
            console.log('📊 Tracking email:', emailData);
            
            // Generate tracking pixel
            const trackingId = this.generateTrackingId();
            
            // Log to AttributeAI
            await this.logEmailActivity({
                type: 'email_sent',
                to: emailData.to,
                subject: emailData.subject,
                trackingId: trackingId,
                timestamp: new Date().toISOString(),
                platform: this.platform
            });

            // Show success notification
            this.showTrackingNotification('Email tracked in AttributeAI CRM');
        }
    }

    extractEmailData() {
        try {
            // Extract email details from Gmail interface
            const toField = document.querySelector('[name="to"]')?.value ||
                           document.querySelector('.vR .vT')?.textContent;
            
            const subjectField = document.querySelector('[name="subjectbox"]')?.value ||
                               document.querySelector('.aoT')?.textContent;
            
            const bodyElement = document.querySelector('[contenteditable="true"]') ||
                              document.querySelector('.Am.Al.editable');
            
            return {
                to: toField?.trim(),
                subject: subjectField?.trim(),
                body: bodyElement?.textContent?.trim(),
                hasTracking: this.isTrackingEnabled()
            };
        } catch (error) {
            console.error('Error extracting email data:', error);
            return null;
        }
    }

    isTrackingEnabled() {
        const checkbox = document.querySelector('#attributeai-track-email');
        return checkbox ? checkbox.checked : true; // Default to enabled
    }

    generateTrackingId() {
        return 'trk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async logEmailActivity(activityData) {
        try {
            // Try to log to AttributeAI backend
            await fetch(`${this.attributeaiEndpoint}/log-activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(activityData)
            });

            // Also try to log directly to Supabase
            await this.logToSupabase(activityData);
            
            console.log('✅ Email activity logged successfully');
        } catch (error) {
            console.error('❌ Error logging email activity:', error);
            
            // Store locally for retry later
            this.storeLocalActivity(activityData);
        }
    }

    async logToSupabase(activityData) {
        try {
            const response = await fetch(`${this.supabaseEndpoint}/email_activities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': 'your-supabase-anon-key',
                    'Authorization': 'Bearer your-supabase-anon-key'
                },
                body: JSON.stringify({
                    ...activityData,
                    user_id: await this.getUserId(),
                    contact_email: activityData.to,
                    created_at: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`Supabase error: ${response.status}`);
            }
        } catch (error) {
            console.error('Supabase logging error:', error);
        }
    }

    async getUserId() {
        // Get user ID from extension storage
        return new Promise((resolve) => {
            chrome.storage.sync.get(['attributeai_user_id'], (result) => {
                resolve(result.attributeai_user_id || 'anonymous');
            });
        });
    }

    storeLocalActivity(activityData) {
        // Store activity locally for later sync
        chrome.storage.local.get(['pending_activities'], (result) => {
            const activities = result.pending_activities || [];
            activities.push(activityData);
            
            chrome.storage.local.set({
                pending_activities: activities
            });
        });
    }

    showTrackingNotification(message) {
        // Create a small notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Outlook-specific methods
    observeOutlookCompose() {
        // Similar to Gmail but for Outlook selectors
        console.log('Watching Outlook compose windows...');
        // Implementation would be similar but with Outlook-specific selectors
    }

    observeOutlookSent() {
        // Watch for Outlook sent confirmations
        console.log('Watching Outlook sent notifications...');
        // Implementation would be similar but with Outlook-specific selectors
    }

    addOutlookTrackingUI() {
        // Add tracking UI to Outlook compose
        console.log('Adding Outlook tracking UI...');
        // Implementation would be similar but with Outlook-specific selectors
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .attributeai-tracking-panel {
        transition: all 0.2s ease;
    }
    
    .attributeai-tracking-panel:hover {
        background: linear-gradient(135deg, #1d4ed8 0%, #8b5cf6 100%);
        transform: scale(1.02);
    }
`;
document.head.appendChild(style);

// Initialize email tracker
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new EmailTracker();
    });
} else {
    new EmailTracker();
}