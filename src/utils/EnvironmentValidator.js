// Environment validation for production security
// YC-ready environment variable validation

class EnvironmentValidator {
  constructor() {
    this.requiredVars = {
      production: [
        'REACT_APP_SUPABASE_URL',
        'REACT_APP_SUPABASE_ANON_KEY',
        'REACT_APP_GOOGLE_CLIENT_ID',
        'REACT_APP_SITE_URL'
      ],
      server: [
        'CLAUDE_API_KEY',
        'OPENAI_API_KEY',
        'SUPABASE_SERVICE_ROLE_KEY'
      ]
    };
    
    this.optionalVars = [
      'REACT_APP_GA_MEASUREMENT_ID',
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY'
    ];
  }

  validateClientEnvironment() {
    const errors = [];
    const warnings = [];
    
    // Check required frontend variables
    this.requiredVars.production.forEach(varName => {
      const value = process.env[varName];
      
      if (!value) {
        errors.push(`Missing required environment variable: ${varName}`);
      } else if (value.includes('your_') || value.includes('placeholder')) {
        errors.push(`Invalid placeholder value for: ${varName}`);
      } else if (varName.includes('URL') && !this.isValidUrl(value)) {
        errors.push(`Invalid URL format for: ${varName}`);
      }
    });

    // Check optional variables
    this.optionalVars.forEach(varName => {
      const value = process.env[varName];
      if (!value) {
        warnings.push(`Optional environment variable not set: ${varName}`);
      }
    });

    return { errors, warnings };
  }

  validateServerEnvironment() {
    const errors = [];
    const warnings = [];
    
    // Check server-side variables (for API proxy)
    this.requiredVars.server.forEach(varName => {
      const value = process.env[varName];
      
      if (!value) {
        warnings.push(`Server environment variable not set: ${varName}`);
      } else if (value.includes('your_') || value.includes('placeholder')) {
        errors.push(`Invalid placeholder value for server var: ${varName}`);
      }
    });

    return { errors, warnings };
  }

  isValidUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  validateSupabaseConfig() {
    const url = process.env.REACT_APP_SUPABASE_URL;
    const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      return { valid: false, error: 'Supabase configuration missing' };
    }

    if (!url.includes('supabase.co')) {
      return { valid: false, error: 'Invalid Supabase URL format' };
    }

    if (!key.startsWith('eyJ')) {
      return { valid: false, error: 'Invalid Supabase key format' };
    }

    return { valid: true };
  }

  generateReport() {
    const clientValidation = this.validateClientEnvironment();
    const serverValidation = this.validateServerEnvironment();
    const supabaseValidation = this.validateSupabaseConfig();
    
    const report = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      client: clientValidation,
      server: serverValidation,
      supabase: supabaseValidation,
      summary: {
        ready: clientValidation.errors.length === 0 && supabaseValidation.valid,
        criticalIssues: clientValidation.errors.length + 
                       serverValidation.errors.length + 
                       (supabaseValidation.valid ? 0 : 1),
        warnings: clientValidation.warnings.length + serverValidation.warnings.length
      }
    };

    return report;
  }

  logReport(report = null) {
    const validationReport = report || this.generateReport();
    
    console.group('🔒 Environment Validation Report');
    console.log('Environment:', validationReport.environment);
    console.log('Timestamp:', validationReport.timestamp);
    
    if (validationReport.summary.ready) {
      console.log('✅ Environment is production-ready');
    } else {
      console.error('❌ Environment has critical issues');
    }
    
    if (validationReport.client.errors.length > 0) {
      console.group('❌ Client Environment Errors');
      validationReport.client.errors.forEach(error => console.error(error));
      console.groupEnd();
    }
    
    if (validationReport.server.errors.length > 0) {
      console.group('❌ Server Environment Errors');
      validationReport.server.errors.forEach(error => console.error(error));
      console.groupEnd();
    }
    
    if (!validationReport.supabase.valid) {
      console.error('❌ Supabase Configuration Error:', validationReport.supabase.error);
    }
    
    if (validationReport.summary.warnings > 0) {
      console.group('⚠️ Warnings');
      validationReport.client.warnings.forEach(warning => console.warn(warning));
      validationReport.server.warnings.forEach(warning => console.warn(warning));
      console.groupEnd();
    }
    
    console.groupEnd();
    
    return validationReport;
  }

  // Startup validation - call this in App.js
  validateOnStartup() {
    const report = this.generateReport();
    
    if (process.env.NODE_ENV === 'development') {
      this.logReport(report);
    }
    
    // In production, only log critical errors
    if (process.env.NODE_ENV === 'production' && !report.summary.ready) {
      console.error('Production environment validation failed:', {
        criticalIssues: report.summary.criticalIssues,
        errors: [...report.client.errors, ...report.server.errors]
      });
    }
    
    return report;
  }
}

// Create singleton instance
const envValidator = new EnvironmentValidator();

// Export for use in components
export default envValidator;

// Auto-validate on import in development
if (process.env.NODE_ENV === 'development') {
  envValidator.validateOnStartup();
}
