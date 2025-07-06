// Professional logging utility for production
class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isVerbose = localStorage.getItem('attributeai_debug') === 'true';
  }

  log(message, data = null) {
    if (this.isDevelopment || this.isVerbose) {
      if (data) {
        console.log(`🔍 AttributeAI: ${message}`, data);
      } else {
        console.log(`🔍 AttributeAI: ${message}`);
      }
    }
  }

  warn(message, data = null) {
    if (this.isDevelopment || this.isVerbose) {
      if (data) {
        console.warn(`⚠️ AttributeAI: ${message}`, data);
      } else {
        console.warn(`⚠️ AttributeAI: ${message}`);
      }
    }
  }

  error(message, error = null) {
    // Always log errors, even in production
    if (error) {
      console.error(`❌ AttributeAI: ${message}`, error);
    } else {
      console.error(`❌ AttributeAI: ${message}`);
    }

    // In production, could send to error monitoring service
    if (!this.isDevelopment && window.gtag) {
      window.gtag('event', 'error', {
        event_category: 'application_error',
        event_label: message,
        value: 1
      });
    }
  }

  success(message, data = null) {
    if (this.isDevelopment || this.isVerbose) {
      if (data) {
        console.log(`✅ AttributeAI: ${message}`, data);
      } else {
        console.log(`✅ AttributeAI: ${message}`);
      }
    }
  }

  debug(message, data = null) {
    if (this.isVerbose) {
      if (data) {
        console.debug(`🐛 AttributeAI Debug: ${message}`, data);
      } else {
        console.debug(`🐛 AttributeAI Debug: ${message}`);
      }
    }
  }

  // Performance timing helper
  time(label) {
    if (this.isDevelopment || this.isVerbose) {
      console.time(`⏱️ AttributeAI: ${label}`);
    }
  }

  timeEnd(label) {
    if (this.isDevelopment || this.isVerbose) {
      console.timeEnd(`⏱️ AttributeAI: ${label}`);
    }
  }
}

// Export singleton instance
export default new Logger();

// Usage examples:
// import logger from '../utils/logger';
// 
// logger.log('User authenticated successfully');
// logger.warn('API rate limit approaching');
// logger.error('Failed to save user data', error);
// logger.success('Content generated successfully');
// logger.debug('Raw API response', responseData);
