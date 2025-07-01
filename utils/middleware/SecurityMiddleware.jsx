import {
  apiRateLimiter,
  authRateLimiter,
  reviewRateLimiter,
} from "../validation/InputValidation";

// Security middleware utilities
export const SecurityMiddleware = {
  // Rate limiting middleware
  rateLimit: (limiter, identifier) => {
    if (!limiter.isAllowed(identifier)) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + limiter.windowMs,
        error: "Rate limit exceeded",
      };
    }

    return {
      allowed: true,
      remaining: limiter.getRemaining(identifier),
      resetTime: Date.now() + limiter.windowMs,
    };
  },

  // Get client IP address
  getClientIP: (request) => {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const cfConnectingIP = request.headers.get("cf-connecting-ip");

    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }

    if (realIP) {
      return realIP;
    }

    if (cfConnectingIP) {
      return cfConnectingIP;
    }

    return "unknown";
  },

  // Validate and sanitize request body
  validateBody: (body, schema) => {
    const errors = [];
    const validated = {};

    for (const [key, validator] of Object.entries(schema)) {
      const value = body[key];
      const result = validator(value);

      if (!result.isValid) {
        errors.push(`${key}: ${result.error}`);
      } else {
        validated[key] = result.value;
      }
    }

    return {
      isValid: errors.length === 0,
      data: validated,
      errors: errors.length > 0 ? errors : null,
    };
  },

  // Log security events
  logSecurityEvent: (event, details) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      severity: details.severity || "info",
    };

    // In production, this should be sent to a proper logging service
    console.log("SECURITY EVENT:", JSON.stringify(logEntry, null, 2));
  },

  // Validate file upload
  validateFileUpload: (file, options = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB
      allowedTypes = ["image/jpeg", "image/png", "image/webp"],
      allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"],
    } = options;

    if (!file) {
      return { isValid: false, error: "No file provided" };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
      };
    }

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: "Invalid file type" };
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!hasValidExtension) {
      return { isValid: false, error: "Invalid file extension" };
    }

    return { isValid: true, file };
  },

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

  // Validate ObjectId
  validateObjectId: (id) => {
    if (!id || typeof id !== "string") {
      return false;
    }

    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
  },

  // Sanitize error messages for production
  sanitizeError: (
    error,
    isProduction = process.env.NODE_ENV === "production"
  ) => {
    if (isProduction) {
      // Don't expose internal errors in production
      return {
        message: "An error occurred",
        status: 500,
      };
    }

    return {
      message: error.message || "Internal server error",
      status: error.status || 500,
      stack: error.stack,
    };
  },

  // Validate pagination parameters
  validatePagination: (page, limit = 10, maxLimit = 100) => {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

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

// Specific rate limiters for different endpoints
export const RateLimiters = {
  api: apiRateLimiter,
  auth: authRateLimiter,
  review: reviewRateLimiter,

  // Custom rate limiters
  upload: new (class extends apiRateLimiter.constructor {
    constructor() {
      super(10, 60 * 60 * 1000); // 10 uploads per hour
    }
  })(),

  admin: new (class extends apiRateLimiter.constructor {
    constructor() {
      super(1000, 15 * 60 * 1000); // 1000 requests per 15 minutes for admin
    }
  })(),
};
