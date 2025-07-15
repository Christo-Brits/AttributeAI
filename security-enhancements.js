// Enhanced security configuration for server/api-proxy.js

// ADD THIS TO YOUR HELMET CONFIGURATION:
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", // Only for critical inline scripts
                "https://www.googletagmanager.com", 
                "https://static.hotjar.com"
            ],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: [
                "'self'", 
                "https://api.anthropic.com", 
                "https://api.openai.com",
                "https://xpyfoutwwjslivrmbflm.supabase.co"
            ],
            frameSrc: ["'none'"], // Prevent iframe embedding
            objectSrc: ["'none'"], // Prevent object/embed
            baseUri: ["'self'"], // Restrict base tag
            formAction: ["'self'"] // Restrict form submissions
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    
    // Additional security headers
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    noSniff: true, // X-Content-Type-Options: nosniff
    frameguard: { action: 'deny' }, // X-Frame-Options: DENY
    xssFilter: true, // X-XSS-Protection: 1; mode=block
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

// Enhanced input validation
const validateAndSanitize = [
    body('content').optional().isLength({ max: 50000 }).trim().escape(),
    body('keywords').optional().isArray({ max: 100 }),
    body('url').optional().isURL({ protocols: ['http', 'https'] }),
    body('email').optional().isEmail().normalizeEmail(),
    
    // Custom validation function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Invalid input',
                details: errors.array().map(err => ({
                    field: err.param,
                    message: err.msg,
                    value: err.value
                }))
            });
        }
        next();
    }
];

// Request size limiting by endpoint
app.use('/api/generate-content', express.json({ limit: '1mb' }));
app.use('/api/keyword-intelligence', express.json({ limit: '100kb' }));
app.use('/api/claude-chat', express.json({ limit: '500kb' }));

// Enhanced error handling with security considerations
const secureErrorHandler = (error, req, res, next) => {
    // Log error details securely (don't expose in response)
    console.error('API Error:', {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : '[REDACTED]',
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
        userId: req.user?.id || 'anonymous'
    });

    // Send safe error response
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return res.status(503).json({ 
            error: 'Service temporarily unavailable',
            code: 'SERVICE_UNAVAILABLE'
        });
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({ 
            error: 'Invalid request data',
            code: 'VALIDATION_ERROR',
            details: isDevelopment ? error.details : undefined
        });
    }

    // Generic error response (don't leak sensitive info)
    res.status(500).json({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: isDevelopment ? error.message : 'Something went wrong',
        requestId: req.id || 'unknown'
    });
};

module.exports = { validateAndSanitize, secureErrorHandler };
