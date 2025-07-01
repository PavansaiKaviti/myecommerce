// Security configuration constants and settings
export const SecurityConfig = {
  // Rate limiting settings
  RATE_LIMITS: {
    API: {
      requests: 100,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    AUTH: {
      requests: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    REVIEW: {
      requests: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
    },
    UPLOAD: {
      requests: 10,
      windowMs: 60 * 60 * 1000, // 1 hour
    },
    ADMIN: {
      requests: 1000,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
  },

  // File upload settings
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
    ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
    MAX_FILES_PER_REQUEST: 1,
    SECURE_FILENAME_LENGTH: 32,
  },

  // Input validation settings
  VALIDATION: {
    MAX_LENGTHS: {
      USERNAME: 30,
      EMAIL: 255,
      PRODUCT_NAME: 100,
      PRODUCT_DESCRIPTION: 1000,
      BRAND: 50,
      CATEGORY: 50,
      REVIEW_MESSAGE: 500,
      SHIPPING_ADDRESS: 500,
    },
    MIN_LENGTHS: {
      USERNAME: 2,
      PASSWORD: 8,
      PRODUCT_NAME: 1,
      PRODUCT_DESCRIPTION: 10,
    },
    PRICE: {
      MIN: 0,
      MAX: 999999.99,
      DECIMAL_PLACES: 2,
    },
    RATING: {
      MIN: 1,
      MAX: 5,
      STEP: 0.5,
    },
    STOCK: {
      MIN: 0,
      MAX: 999999,
    },
  },

  // Session settings
  SESSION: {
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
    UPDATE_AGE: 60 * 60 * 1000, // 1 hour
    SECURE: process.env.NODE_ENV === "production",
    HTTP_ONLY: true,
    SAME_SITE: "lax",
  },

  // Password settings
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    MAX_AGE: 90 * 24 * 60 * 60 * 1000, // 90 days
  },

  // Account lockout settings
  ACCOUNT_LOCKOUT: {
    MAX_ATTEMPTS: 5,
    LOCK_DURATION: 2 * 60 * 60 * 1000, // 2 hours
    RESET_AFTER: 15 * 60 * 1000, // 15 minutes
  },

  // CORS settings
  CORS: {
    ALLOWED_ORIGINS: [
      process.env.NEXT_PUBLIC_DOMAIN_API || "http://localhost:3000",
      process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3000",
    ],
    ALLOWED_METHODS: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    ALLOWED_HEADERS: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    EXPOSE_HEADERS: [
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
      "X-Total-Count",
    ],
    CREDENTIALS: true,
    MAX_AGE: 86400, // 24 hours
  },

  // Security headers
  SECURITY_HEADERS: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.stripe.com https://js.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com;",
  },

  // Logging settings
  LOGGING: {
    LEVEL: process.env.NODE_ENV === "production" ? "warn" : "info",
    SECURITY_EVENTS: true,
    SENSITIVE_FIELDS: ["password", "token", "secret", "key"],
    MAX_LOG_SIZE: 10 * 1024 * 1024, // 10MB
    ROTATION_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Database settings
  DATABASE: {
    CONNECTION_TIMEOUT: 30000, // 30 seconds
    QUERY_TIMEOUT: 10000, // 10 seconds
    MAX_POOL_SIZE: 10,
    MIN_POOL_SIZE: 2,
    MAX_IDLE_TIME: 30000, // 30 seconds
  },

  // API settings
  API: {
    VERSION: "v1",
    PREFIX: "/api",
    TIMEOUT: 30000, // 30 seconds
    MAX_PAYLOAD_SIZE: 10 * 1024 * 1024, // 10MB
    PAGINATION: {
      DEFAULT_LIMIT: 10,
      MAX_LIMIT: 100,
      DEFAULT_PAGE: 1,
    },
  },

  // Environment-specific settings
  ENVIRONMENT: {
    IS_PRODUCTION: process.env.NODE_ENV === "production",
    IS_DEVELOPMENT: process.env.NODE_ENV === "development",
    IS_TEST: process.env.NODE_ENV === "test",
  },
};

// Security utility functions
export const SecurityUtils = {
  // Generate secure random string
  generateSecureToken: (length = 32) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  },

  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate URL format
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Sanitize HTML content
  sanitizeHtml: (html) => {
    // Basic HTML sanitization - in production, use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");
  },

  // Validate file type
  isValidFileType: (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
  },

  // Validate file size
  isValidFileSize: (file, maxSize) => {
    return file.size <= maxSize;
  },

  // Generate secure filename
  generateSecureFilename: (originalName, extension) => {
    const timestamp = Date.now();
    const randomString = SecurityUtils.generateSecureToken(8);
    return `${timestamp}_${randomString}${extension}`;
  },

  // Mask sensitive data
  maskSensitiveData: (data, fields = ["password", "token", "secret"]) => {
    const masked = { ...data };

    fields.forEach((field) => {
      if (masked[field]) {
        masked[field] = "*".repeat(Math.min(masked[field].length, 8));
      }
    });

    return masked;
  },

  // Validate pagination parameters
  validatePagination: (
    page,
    limit,
    maxLimit = SecurityConfig.API.PAGINATION.MAX_LIMIT
  ) => {
    const pageNum =
      parseInt(page) || SecurityConfig.API.PAGINATION.DEFAULT_PAGE;
    const limitNum =
      parseInt(limit) || SecurityConfig.API.PAGINATION.DEFAULT_LIMIT;

    if (pageNum < 1) {
      return { isValid: false, error: "Page number must be greater than 0" };
    }

    if (limitNum < 1 || limitNum > maxLimit) {
      return {
        isValid: false,
        error: `Limit must be between 1 and ${maxLimit}`,
      };
    }

    return {
      isValid: true,
      page: pageNum,
      limit: limitNum,
      skip: (pageNum - 1) * limitNum,
    };
  },
};

// Export default configuration
export default SecurityConfig;
