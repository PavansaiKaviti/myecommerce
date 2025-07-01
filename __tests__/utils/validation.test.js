import {
  validateEmail,
  validatePassword,
  validateProductData,
  validateUserData,
  sanitizeInput,
  validateImageFile,
  validatePrice,
  validateStock,
  validateReviewData,
  validateOrderData,
  validateShippingAddress,
  validatePaymentData,
  validateAdminData,
  validateSearchQuery,
  validatePaginationParams,
  validateFileUpload,
  validateApiKey,
  validateSession,
  validateCSRF,
  validateRateLimit,
} from "@/utils/validation/InputValidation";

describe("Input Validation Tests", () => {
  describe("Email Validation", () => {
    test("should validate correct email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name+tag@domain.co.uk")).toBe(true);
      expect(validateEmail("123@test.org")).toBe(true);
    });

    test("should reject invalid email addresses", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@domain.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });

    test("should reject emails with XSS attempts", () => {
      expect(validateEmail('<script>alert("xss")</script>@test.com')).toBe(
        false
      );
      expect(validateEmail('test@<script>alert("xss")</script>.com')).toBe(
        false
      );
    });
  });

  describe("Password Validation", () => {
    test("should validate strong passwords", () => {
      expect(validatePassword("StrongPass123!")).toBe(true);
      expect(validatePassword("MySecureP@ssw0rd")).toBe(true);
      expect(validatePassword("Complex123$Password")).toBe(true);
    });

    test("should reject weak passwords", () => {
      expect(validatePassword("weak")).toBe(false);
      expect(validatePassword("12345678")).toBe(false);
      expect(validatePassword("password")).toBe(false);
      expect(validatePassword("")).toBe(false);
      expect(validatePassword("no-uppercase-123")).toBe(false);
      expect(validatePassword("NO-LOWERCASE-123")).toBe(false);
      expect(validatePassword("NoNumbers")).toBe(false);
    });

    test("should reject passwords that are too short", () => {
      expect(validatePassword("Abc1!")).toBe(false);
    });
  });

  describe("Product Data Validation", () => {
    test("should validate correct product data", () => {
      const validProduct = {
        name: "Test Product",
        description: "A test product description",
        price: 99.99,
        stock: 10,
        category: "Electronics",
        brand: "Test Brand",
        images: ["image1.jpg", "image2.jpg"],
      };

      expect(validateProductData(validProduct)).toBe(true);
    });

    test("should reject invalid product data", () => {
      expect(validateProductData({})).toBe(false);
      expect(validateProductData({ name: "" })).toBe(false);
      expect(validateProductData({ name: "Test", price: -10 })).toBe(false);
      expect(validateProductData({ name: "Test", stock: -5 })).toBe(false);
      expect(
        validateProductData({ name: '<script>alert("xss")</script>' })
      ).toBe(false);
    });

    test("should reject products with invalid price", () => {
      const invalidProduct = {
        name: "Test Product",
        price: "invalid",
        stock: 10,
      };

      expect(validateProductData(invalidProduct)).toBe(false);
    });
  });

  describe("User Data Validation", () => {
    test("should validate correct user data", () => {
      const validUser = {
        email: "test@example.com",
        password: "StrongPass123!",
        fullName: "John Doe",
      };

      expect(validateUserData(validUser)).toBe(true);
    });

    test("should reject invalid user data", () => {
      expect(validateUserData({})).toBe(false);
      expect(validateUserData({ email: "invalid" })).toBe(false);
      expect(
        validateUserData({ email: "test@example.com", password: "weak" })
      ).toBe(false);
      expect(
        validateUserData({
          email: "test@example.com",
          fullName: '<script>alert("xss")</script>',
        })
      ).toBe(false);
    });
  });

  describe("Input Sanitization", () => {
    test("should sanitize HTML content", () => {
      const maliciousInput = '<script>alert("xss")</script>Hello World';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain("<script>");
      expect(sanitized).toContain("Hello World");
    });

    test("should handle null and undefined inputs", () => {
      expect(sanitizeInput(null)).toBe("");
      expect(sanitizeInput(undefined)).toBe("");
      expect(sanitizeInput("")).toBe("");
    });

    test("should preserve safe HTML", () => {
      const safeInput = "<p>This is <strong>safe</strong> content</p>";
      const sanitized = sanitizeInput(safeInput);
      expect(sanitized).toContain("This is safe content");
    });
  });

  describe("Image File Validation", () => {
    test("should validate correct image files", () => {
      const validFile = {
        name: "test.jpg",
        type: "image/jpeg",
        size: 1024 * 1024, // 1MB
      };

      expect(validateImageFile(validFile)).toBe(true);
    });

    test("should reject invalid image files", () => {
      const invalidFile = {
        name: "test.exe",
        type: "application/octet-stream",
        size: 1024 * 1024,
      };

      expect(validateImageFile(invalidFile)).toBe(false);
    });

    test("should reject files that are too large", () => {
      const largeFile = {
        name: "test.jpg",
        type: "image/jpeg",
        size: 10 * 1024 * 1024, // 10MB
      };

      expect(validateImageFile(largeFile)).toBe(false);
    });
  });

  describe("Price Validation", () => {
    test("should validate correct prices", () => {
      expect(validatePrice(10.99)).toBe(true);
      expect(validatePrice(0)).toBe(true);
      expect(validatePrice(999999.99)).toBe(true);
    });

    test("should reject invalid prices", () => {
      expect(validatePrice(-10)).toBe(false);
      expect(validatePrice("invalid")).toBe(false);
      expect(validatePrice(null)).toBe(false);
      expect(validatePrice(undefined)).toBe(false);
    });
  });

  describe("Stock Validation", () => {
    test("should validate correct stock values", () => {
      expect(validateStock(0)).toBe(true);
      expect(validateStock(100)).toBe(true);
      expect(validateStock(999999)).toBe(true);
    });

    test("should reject invalid stock values", () => {
      expect(validateStock(-1)).toBe(false);
      expect(validateStock("invalid")).toBe(false);
      expect(validateStock(null)).toBe(false);
      expect(validateStock(undefined)).toBe(false);
    });
  });

  describe("Review Data Validation", () => {
    test("should validate correct review data", () => {
      const validReview = {
        rating: 5,
        comment: "Great product!",
        productId: "507f1f77bcf86cd799439011",
      };

      expect(validateReviewData(validReview)).toBe(true);
    });

    test("should reject invalid review data", () => {
      expect(validateReviewData({})).toBe(false);
      expect(validateReviewData({ rating: 6 })).toBe(false);
      expect(validateReviewData({ rating: 0 })).toBe(false);
      expect(
        validateReviewData({
          rating: 5,
          comment: '<script>alert("xss")</script>',
        })
      ).toBe(false);
    });
  });

  describe("Order Data Validation", () => {
    test("should validate correct order data", () => {
      const validOrder = {
        products: ["507f1f77bcf86cd799439011"],
        totalAmount: 99.99,
        shippingAddress: {
          street: "123 Main St",
          city: "Test City",
          state: "Test State",
          zipCode: "12345",
          country: "Test Country",
        },
      };

      expect(validateOrderData(validOrder)).toBe(true);
    });

    test("should reject invalid order data", () => {
      expect(validateOrderData({})).toBe(false);
      expect(validateOrderData({ products: [] })).toBe(false);
      expect(validateOrderData({ products: ["id"], totalAmount: -10 })).toBe(
        false
      );
    });
  });

  describe("Shipping Address Validation", () => {
    test("should validate correct shipping address", () => {
      const validAddress = {
        street: "123 Main St",
        city: "Test City",
        state: "Test State",
        zipCode: "12345",
        country: "Test Country",
      };

      expect(validateShippingAddress(validAddress)).toBe(true);
    });

    test("should reject invalid shipping address", () => {
      expect(validateShippingAddress({})).toBe(false);
      expect(validateShippingAddress({ street: "" })).toBe(false);
      expect(
        validateShippingAddress({ street: '<script>alert("xss")</script>' })
      ).toBe(false);
    });
  });

  describe("Payment Data Validation", () => {
    test("should validate correct payment data", () => {
      const validPayment = {
        amount: 99.99,
        currency: "usd",
        paymentMethod: "card",
      };

      expect(validatePaymentData(validPayment)).toBe(true);
    });

    test("should reject invalid payment data", () => {
      expect(validatePaymentData({})).toBe(false);
      expect(validatePaymentData({ amount: -10 })).toBe(false);
      expect(validatePaymentData({ amount: 100, currency: "invalid" })).toBe(
        false
      );
    });
  });

  describe("Admin Data Validation", () => {
    test("should validate correct admin data", () => {
      const validAdmin = {
        email: "admin@example.com",
        role: "admin",
        permissions: ["read", "write"],
      };

      expect(validateAdminData(validAdmin)).toBe(true);
    });

    test("should reject invalid admin data", () => {
      expect(validateAdminData({})).toBe(false);
      expect(validateAdminData({ email: "invalid" })).toBe(false);
      expect(
        validateAdminData({ email: "admin@example.com", role: "invalid" })
      ).toBe(false);
    });
  });

  describe("Search Query Validation", () => {
    test("should validate correct search queries", () => {
      expect(validateSearchQuery("test product")).toBe(true);
      expect(validateSearchQuery("")).toBe(true);
      expect(validateSearchQuery("a".repeat(100))).toBe(true);
    });

    test("should reject invalid search queries", () => {
      expect(validateSearchQuery("a".repeat(101))).toBe(false);
      expect(validateSearchQuery('<script>alert("xss")</script>')).toBe(false);
      expect(validateSearchQuery(null)).toBe(false);
    });
  });

  describe("Pagination Parameters Validation", () => {
    test("should validate correct pagination parameters", () => {
      expect(validatePaginationParams({ page: 1, limit: 10 })).toBe(true);
      expect(validatePaginationParams({ page: 5, limit: 20 })).toBe(true);
    });

    test("should reject invalid pagination parameters", () => {
      expect(validatePaginationParams({ page: 0 })).toBe(false);
      expect(validatePaginationParams({ page: 1, limit: 0 })).toBe(false);
      expect(validatePaginationParams({ page: 1, limit: 101 })).toBe(false);
    });
  });

  describe("File Upload Validation", () => {
    test("should validate correct file uploads", () => {
      const validFile = {
        name: "test.jpg",
        type: "image/jpeg",
        size: 1024 * 1024,
      };

      expect(validateFileUpload(validFile, ["image/jpeg", "image/png"])).toBe(
        true
      );
    });

    test("should reject invalid file uploads", () => {
      const invalidFile = {
        name: "test.exe",
        type: "application/octet-stream",
        size: 1024 * 1024,
      };

      expect(validateFileUpload(invalidFile, ["image/jpeg"])).toBe(false);
    });
  });

  describe("API Key Validation", () => {
    test("should validate correct API keys", () => {
      expect(validateApiKey("sk_test_1234567890abcdef")).toBe(true);
      expect(validateApiKey("pk_test_1234567890abcdef")).toBe(true);
    });

    test("should reject invalid API keys", () => {
      expect(validateApiKey("")).toBe(false);
      expect(validateApiKey("invalid-key")).toBe(false);
      expect(validateApiKey(null)).toBe(false);
    });
  });

  describe("Session Validation", () => {
    test("should validate correct sessions", () => {
      const validSession = {
        user: { id: "507f1f77bcf86cd799439011", email: "test@example.com" },
        expires: new Date(Date.now() + 3600000).toISOString(),
      };

      expect(validateSession(validSession)).toBe(true);
    });

    test("should reject invalid sessions", () => {
      expect(validateSession(null)).toBe(false);
      expect(validateSession({})).toBe(false);
      expect(validateSession({ user: null })).toBe(false);
    });
  });

  describe("CSRF Validation", () => {
    test("should validate correct CSRF tokens", () => {
      const validToken = "csrf-token-1234567890abcdef";
      expect(validateCSRF(validToken)).toBe(true);
    });

    test("should reject invalid CSRF tokens", () => {
      expect(validateCSRF("")).toBe(false);
      expect(validateCSRF("invalid")).toBe(false);
      expect(validateCSRF(null)).toBe(false);
    });
  });

  describe("Rate Limit Validation", () => {
    test("should validate rate limit data", () => {
      const validRateLimit = {
        ip: "192.168.1.1",
        endpoint: "/api/products",
        timestamp: Date.now(),
        count: 1,
      };

      expect(validateRateLimit(validRateLimit)).toBe(true);
    });

    test("should reject invalid rate limit data", () => {
      expect(validateRateLimit({})).toBe(false);
      expect(validateRateLimit({ ip: "" })).toBe(false);
      expect(validateRateLimit({ ip: "192.168.1.1", count: -1 })).toBe(false);
    });
  });
});
