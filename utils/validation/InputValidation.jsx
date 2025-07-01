import DOMPurify from "isomorphic-dompurify";

// Input validation and sanitization utilities
export const validateAndSanitize = {
  // Text input validation
  text: (input, maxLength = 255) => {
    if (!input || typeof input !== "string") {
      return { isValid: false, value: null, error: "Invalid text input" };
    }

    // Remove extra whitespace
    const trimmed = input.trim();

    if (trimmed.length === 0) {
      return { isValid: false, value: null, error: "Text cannot be empty" };
    }

    if (trimmed.length > maxLength) {
      return {
        isValid: false,
        value: null,
        error: `Text must be ${maxLength} characters or less`,
      };
    }

    // Sanitize HTML content
    const sanitized = DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [] });

    return { isValid: true, value: sanitized, error: null };
  },

  // Email validation
  email: (input) => {
    if (!input || typeof input !== "string") {
      return { isValid: false, value: null, error: "Invalid email format" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmed = input.trim().toLowerCase();

    if (!emailRegex.test(trimmed)) {
      return { isValid: false, value: null, error: "Invalid email format" };
    }

    return { isValid: true, value: trimmed, error: null };
  },

  // Number validation
  number: (input, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const num = parseFloat(input);

    if (isNaN(num)) {
      return { isValid: false, value: null, error: "Invalid number" };
    }

    if (num < min || num > max) {
      return {
        isValid: false,
        value: null,
        error: `Number must be between ${min} and ${max}`,
      };
    }

    return { isValid: true, value: num, error: null };
  },

  // Price validation
  price: (input) => {
    const num = parseFloat(input);

    if (isNaN(num) || num < 0) {
      return { isValid: false, value: null, error: "Invalid price" };
    }

    // Round to 2 decimal places
    const rounded = Math.round(num * 100) / 100;

    return { isValid: true, value: rounded, error: null };
  },

  // Rating validation
  rating: (input) => {
    const num = parseFloat(input);

    if (isNaN(num) || num < 1 || num > 5) {
      return {
        isValid: false,
        value: null,
        error: "Rating must be between 1 and 5",
      };
    }

    return { isValid: true, value: num, error: null };
  },

  // ObjectId validation
  objectId: (input) => {
    if (!input || typeof input !== "string") {
      return { isValid: false, value: null, error: "Invalid ID format" };
    }

    const objectIdRegex = /^[0-9a-fA-F]{24}$/;

    if (!objectIdRegex.test(input)) {
      return { isValid: false, value: null, error: "Invalid ID format" };
    }

    return { isValid: true, value: input, error: null };
  },

  // File validation
  file: (
    file,
    allowedTypes = ["image/jpeg", "image/png", "image/webp"],
    maxSize = 5 * 1024 * 1024
  ) => {
    if (!file) {
      return { isValid: false, value: null, error: "No file provided" };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, value: null, error: "Invalid file type" };
    }

    if (file.size > maxSize) {
      return { isValid: false, value: null, error: "File size too large" };
    }

    return { isValid: true, value: file, error: null };
  },

  // Product data validation
  product: (data) => {
    const errors = [];
    const validated = {};

    // Validate name
    const nameValidation = validateAndSanitize.text(data.name, 100);
    if (!nameValidation.isValid) {
      errors.push(`Name: ${nameValidation.error}`);
    } else {
      validated.name = nameValidation.value;
    }

    // Validate description
    const descValidation = validateAndSanitize.text(data.description, 1000);
    if (!descValidation.isValid) {
      errors.push(`Description: ${descValidation.error}`);
    } else {
      validated.description = descValidation.value;
    }

    // Validate brand
    const brandValidation = validateAndSanitize.text(data.brand, 50);
    if (!brandValidation.isValid) {
      errors.push(`Brand: ${brandValidation.error}`);
    } else {
      validated.brand = brandValidation.value;
    }

    // Validate category
    const categoryValidation = validateAndSanitize.text(data.category, 50);
    if (!categoryValidation.isValid) {
      errors.push(`Category: ${categoryValidation.error}`);
    } else {
      validated.category = categoryValidation.value;
    }

    // Validate price
    const priceValidation = validateAndSanitize.price(data.price);
    if (!priceValidation.isValid) {
      errors.push(`Price: ${priceValidation.error}`);
    } else {
      validated.price = priceValidation.value;
    }

    // Validate stock
    const stockValidation = validateAndSanitize.number(
      data.countInStock,
      0,
      999999
    );
    if (!stockValidation.isValid) {
      errors.push(`Stock: ${stockValidation.error}`);
    } else {
      validated.countInStock = stockValidation.value;
    }

    return {
      isValid: errors.length === 0,
      value: validated,
      errors: errors.length > 0 ? errors : null,
    };
  },

  // Review data validation
  review: (data) => {
    const errors = [];
    const validated = {};

    // Validate message
    const messageValidation = validateAndSanitize.text(data.message, 500);
    if (!messageValidation.isValid) {
      errors.push(`Message: ${messageValidation.error}`);
    } else {
      validated.message = messageValidation.value;
    }

    // Validate rating
    const ratingValidation = validateAndSanitize.rating(data.rating);
    if (!ratingValidation.isValid) {
      errors.push(`Rating: ${ratingValidation.error}`);
    } else {
      validated.rating = ratingValidation.value;
    }

    // Validate product ID
    const productIdValidation = validateAndSanitize.objectId(data.productid);
    if (!productIdValidation.isValid) {
      errors.push(`Product ID: ${productIdValidation.error}`);
    } else {
      validated.productid = productIdValidation.value;
    }

    return {
      isValid: errors.length === 0,
      value: validated,
      errors: errors.length > 0 ? errors : null,
    };
  },
};

// Rate limiting utility
export class RateLimiter {
  constructor(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    // 15 minutes
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }

    const userRequests = this.requests.get(identifier);

    // Remove old requests outside the window
    const validRequests = userRequests.filter(
      (timestamp) => timestamp > windowStart
    );

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  getRemaining(identifier) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!this.requests.has(identifier)) {
      return this.maxRequests;
    }

    const userRequests = this.requests.get(identifier);
    const validRequests = userRequests.filter(
      (timestamp) => timestamp > windowStart
    );

    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

// Create rate limiter instances
export const apiRateLimiter = new RateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 auth attempts per 15 minutes
export const reviewRateLimiter = new RateLimiter(10, 60 * 60 * 1000); // 10 reviews per hour
