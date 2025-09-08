const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// General API rate limit
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

// Strict rate limit for authentication endpoints
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts, please try again later.'
);

// Rate limit for order creation
const orderLimiter = createRateLimit(
  5 * 60 * 1000, // 5 minutes
  10, // limit each IP to 10 orders per 5 minutes
  'Too many orders created, please wait before creating another order.'
);

// Rate limit for address operations
const addressLimiter = createRateLimit(
  10 * 60 * 1000, // 10 minutes
  20, // limit each IP to 20 address operations per 10 minutes
  'Too many address operations, please try again later.'
);

// Security headers configuration
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:5000"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove potential XSS patterns
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // Log suspicious activities
    if (res.statusCode >= 400 || duration > 5000) {
      console.warn('Suspicious activity:', logData);
    }
  });
  
  next();
};

// Validate request size
const validateRequestSize = (req, res, next) => {
  const contentLength = parseInt(req.get('content-length') || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request entity too large',
      maxSize: '10MB'
    });
  }
  
  next();
};

// IP whitelist for admin operations (optional)
const adminIPWhitelist = (req, res, next) => {
  // In production, you might want to restrict admin access to specific IPs
  const allowedIPs = process.env.ADMIN_ALLOWED_IPS?.split(',') || [];
  
  if (allowedIPs.length > 0 && !allowedIPs.includes(req.ip)) {
    console.warn(`Admin access attempt from unauthorized IP: ${req.ip}`);
    return res.status(403).json({
      error: 'Access denied from this IP address'
    });
  }
  
  next();
};

module.exports = {
  generalLimiter,
  authLimiter,
  orderLimiter,
  addressLimiter,
  securityHeaders,
  sanitizeInput,
  requestLogger,
  validateRequestSize,
  adminIPWhitelist
};
