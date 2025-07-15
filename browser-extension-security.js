// Secure content script utilities for browser extension

class SecureContentHandler {
    constructor() {
        this.allowedDomains = [
            'linkedin.com',
            'github.com',
            'twitter.com',
            'facebook.com'
        ];
        this.sanitizer = this.createSanitizer();
    }

    createSanitizer() {
        return {
            sanitizeHTML: (html) => {
                const div = document.createElement('div');
                div.textContent = html;
                return div.innerHTML;
            },
            
            sanitizeURL: (url) => {
                try {
                    const parsed = new URL(url);
                    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                        return null;
                    }
                    return parsed.href;
                } catch {
                    return null;
                }
            },
            
            sanitizeText: (text) => {
                return text.replace(/[<>&"']/g, (char) => {
                    const map = {
                        '<': '&lt;',
                        '>': '&gt;',
                        '&': '&amp;',
                        '"': '&quot;',
                        "'": '&#x27;'
                    };
                    return map[char];
                });
            }
        };
    }

    isAllowedDomain(url) {
        try {
            const domain = new URL(url).hostname.toLowerCase();
            return this.allowedDomains.some(allowed => 
                domain === allowed || domain.endsWith('.' + allowed)
            );
        } catch {
            return false;
        }
    }

    secureCreateElement(tag, properties = {}) {
        const element = document.createElement(tag);
        
        for (const [key, value] of Object.entries(properties)) {
            if (key === 'innerHTML' || key === 'outerHTML') {
                element.textContent = value; // Use textContent instead
            } else if (key === 'href' && tag === 'a') {
                const sanitizedURL = this.sanitizer.sanitizeURL(value);
                if (sanitizedURL) {
                    element.href = sanitizedURL;
                    element.rel = 'noopener noreferrer';
                    element.target = '_blank';
                }
            } else if (key === 'src' && (tag === 'img' || tag === 'iframe')) {
                const sanitizedURL = this.sanitizer.sanitizeURL(value);
                if (sanitizedURL) {
                    element.src = sanitizedURL;
                }
            } else if (typeof value === 'string') {
                element.setAttribute(key, this.sanitizer.sanitizeText(value));
            } else {
                element[key] = value;
            }
        }
        
        return element;
    }

    securePostMessage(data, targetOrigin = '*') {
        const sanitizedData = {
            type: this.sanitizer.sanitizeText(data.type || ''),
            action: this.sanitizer.sanitizeText(data.action || ''),
            payload: data.payload ? this.sanitizeObject(data.payload) : null,
            timestamp: Date.now()
        };
        
        // Only post to AttributeAI domains
        const allowedOrigins = [
            'https://leafy-biscotti-c87e93.netlify.app',
            'https://attributeai.app',
            'http://localhost:3000'
        ];
        
        if (targetOrigin === '*' || allowedOrigins.includes(targetOrigin)) {
            window.postMessage(sanitizedData, targetOrigin);
        }
    }

    sanitizeObject(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return typeof obj === 'string' ? this.sanitizer.sanitizeText(obj) : obj;
        }
        
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            const cleanKey = this.sanitizer.sanitizeText(key);
            if (Array.isArray(value)) {
                sanitized[cleanKey] = value.map(item => this.sanitizeObject(item));
            } else if (typeof value === 'object') {
                sanitized[cleanKey] = this.sanitizeObject(value);
            } else {
                sanitized[cleanKey] = this.sanitizeObject(value);
            }
        }
        return sanitized;
    }

    // Secure data extraction from LinkedIn/websites
    extractContactData() {
        if (!this.isAllowedDomain(window.location.href)) {
            console.warn('Domain not allowed for data extraction');
            return null;
        }

        const data = {};
        
        // Safe query selectors with fallbacks
        const selectors = {
            name: [
                '.pv-text-details__left-panel h1',
                '.top-card-layout__title',
                'h1[data-anonymize="person-name"]'
            ],
            title: [
                '.pv-text-details__left-panel .text-body-medium',
                '.top-card-layout__headline'
            ],
            company: [
                '.pv-text-details__left-panel .text-body-small',
                '.top-card-layout__company'
            ]
        };

        for (const [field, selectorList] of Object.entries(selectors)) {
            for (const selector of selectorList) {
                try {
                    const element = document.querySelector(selector);
                    if (element && element.textContent.trim()) {
                        data[field] = this.sanitizer.sanitizeText(
                            element.textContent.trim()
                        );
                        break;
                    }
                } catch (error) {
                    console.warn(`Failed to extract ${field}:`, error);
                }
            }
        }

        return Object.keys(data).length > 0 ? data : null;
    }
}

// Make available globally in content script
window.SecureContentHandler = SecureContentHandler;

// Usage example:
const handler = new SecureContentHandler();
const contactData = handler.extractContactData();
if (contactData) {
    handler.securePostMessage({
        type: 'CONTACT_EXTRACTED',
        action: 'SAVE_CONTACT',
        payload: contactData
    });
}
