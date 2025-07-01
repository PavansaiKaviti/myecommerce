import { rateLimit } from "@/utils/middleware/SecurityMiddleware";
import {
  generateCSRFToken,
  validateCSRFToken,
  hashPassword,
  comparePassword,
  generateJWT,
  verifyJWT,
} from "@/utils/security/SecurityUtils";

// Mock bcrypt
jest.mock("bcryptjs", () => ({
  hash: jest.fn((password, saltRounds) =>
    Promise.resolve(`hashed_${password}`)
  ),
  compare: jest.fn((password, hash) =>
    Promise.resolve(password === "correct_password")
  ),
  genSalt: jest.fn(() => Promise.resolve("salt")),
}));

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn((payload, secret, options) => "mock.jwt.token"),
  verify: jest.fn((token, secret) => {
    if (token === "valid.token") {
      return { userId: "123", email: "test@example.com" };
    }
    throw new Error("Invalid token");
  }),
}));

// Mock crypto
jest.mock("crypto", () => ({
  randomBytes: jest.fn(() => ({ toString: () => "random-token" })),
  createHash: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(() => "hashed-token"),
  })),
}));

describe("Security Utilities Tests", () => {
  describe("CSRF Token Generation and Validation", () => {
    test("should generate valid CSRF tokens", () => {
      const token = generateCSRFToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    test("should validate correct CSRF tokens", () => {
      const token = generateCSRFToken();
      expect(validateCSRFToken(token)).toBe(true);
    });

    test("should reject invalid CSRF tokens", () => {
      expect(validateCSRFToken("")).toBe(false);
      expect(validateCSRFToken("invalid-token")).toBe(false);
      expect(validateCSRFToken(null)).toBe(false);
      expect(validateCSRFToken(undefined)).toBe(false);
    });
  });

  describe("Password Hashing and Comparison", () => {
    test("should hash passwords correctly", async () => {
      const password = "testpassword";
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
    });

    test("should compare passwords correctly", async () => {
      const password = "correct_password";
      const hashedPassword = await hashPassword(password);
      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    test("should reject incorrect passwords", async () => {
      const password = "wrong_password";
      const hashedPassword = await hashPassword("correct_password");
      const isValid = await comparePassword(password, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe("JWT Token Generation and Verification", () => {
    test("should generate valid JWT tokens", () => {
      const payload = { userId: "123", email: "test@example.com" };
      const token = generateJWT(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    test("should verify valid JWT tokens", () => {
      const token = "valid.token";
      const decoded = verifyJWT(token);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe("123");
      expect(decoded.email).toBe("test@example.com");
    });

    test("should reject invalid JWT tokens", () => {
      expect(() => verifyJWT("invalid.token")).toThrow("Invalid token");
      expect(() => verifyJWT("")).toThrow("Invalid token");
      expect(() => verifyJWT(null)).toThrow("Invalid token");
    });
  });
});

describe("Security Middleware Tests", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      ip: "192.168.1.1",
      method: "GET",
      url: "/api/test",
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("Rate Limiting", () => {
    test("should allow requests within rate limit", () => {
      const rateLimitMiddleware = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: "Too many requests from this IP",
      });

      rateLimitMiddleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should block requests exceeding rate limit", () => {
      const rateLimitMiddleware = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1,
        message: "Too many requests from this IP",
      });

      // First request should pass
      rateLimitMiddleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);

      // Reset mock
      mockNext.mockClear();

      // Second request should be blocked
      rateLimitMiddleware(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Too many requests from this IP",
      });
    });
  });

  describe("Security Headers", () => {
    test("should set security headers", () => {
      const securityHeaders = (req, res, next) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "1; mode=block");
        res.setHeader(
          "Strict-Transport-Security",
          "max-age=31536000; includeSubDomains"
        );
        res.setHeader("Content-Security-Policy", "default-src 'self'");
        next();
      };

      securityHeaders(mockReq, mockRes, mockNext);
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "X-Content-Type-Options",
        "nosniff"
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith("X-Frame-Options", "DENY");
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "X-XSS-Protection",
        "1; mode=block"
      );
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("Input Validation Middleware", () => {
    test("should validate request body", () => {
      const validateBody = (schema) => (req, res, next) => {
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: "Request body is required" });
        }
        next();
      };

      mockReq.body = { test: "data" };
      validateBody()(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should reject empty request body", () => {
      const validateBody = (schema) => (req, res, next) => {
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: "Request body is required" });
        }
        next();
      };

      mockReq.body = {};
      validateBody()(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Request body is required",
      });
    });
  });

  describe("Authentication Middleware", () => {
    test("should allow authenticated requests", () => {
      const requireAuth = (req, res, next) => {
        if (req.headers.authorization) {
          return next();
        }
        return res.status(401).json({ error: "Authentication required" });
      };

      mockReq.headers.authorization = "Bearer valid-token";
      requireAuth(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should reject unauthenticated requests", () => {
      const requireAuth = (req, res, next) => {
        if (req.headers.authorization) {
          return next();
        }
        return res.status(401).json({ error: "Authentication required" });
      };

      requireAuth(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Authentication required",
      });
    });
  });

  describe("Authorization Middleware", () => {
    test("should allow authorized requests", () => {
      const requireRole = (role) => (req, res, next) => {
        if (req.user && req.user.role === role) {
          return next();
        }
        return res.status(403).json({ error: "Insufficient permissions" });
      };

      mockReq.user = { role: "admin" };
      requireRole("admin")(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should reject unauthorized requests", () => {
      const requireRole = (role) => (req, res, next) => {
        if (req.user && req.user.role === role) {
          return next();
        }
        return res.status(403).json({ error: "Insufficient permissions" });
      };

      mockReq.user = { role: "user" };
      requireRole("admin")(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Insufficient permissions",
      });
    });
  });

  describe("CSRF Protection", () => {
    test("should validate CSRF tokens", () => {
      const validateCSRF = (req, res, next) => {
        const token = req.headers["x-csrf-token"];
        if (!token || !validateCSRFToken(token)) {
          return res.status(403).json({ error: "Invalid CSRF token" });
        }
        next();
      };

      const validToken = generateCSRFToken();
      mockReq.headers["x-csrf-token"] = validToken;
      validateCSRF(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should reject invalid CSRF tokens", () => {
      const validateCSRF = (req, res, next) => {
        const token = req.headers["x-csrf-token"];
        if (!token || !validateCSRFToken(token)) {
          return res.status(403).json({ error: "Invalid CSRF token" });
        }
        next();
      };

      mockReq.headers["x-csrf-token"] = "invalid-token";
      validateCSRF(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid CSRF token",
      });
    });
  });

  describe("File Upload Security", () => {
    test("should validate file uploads", () => {
      const validateFileUpload = (req, res, next) => {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(req.file.mimetype)) {
          return res.status(400).json({ error: "Invalid file type" });
        }

        if (req.file.size > 5 * 1024 * 1024) {
          // 5MB limit
          return res.status(400).json({ error: "File too large" });
        }

        next();
      };

      mockReq.file = {
        mimetype: "image/jpeg",
        size: 1024 * 1024, // 1MB
      };

      validateFileUpload(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test("should reject invalid file types", () => {
      const validateFileUpload = (req, res, next) => {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(req.file.mimetype)) {
          return res.status(400).json({ error: "Invalid file type" });
        }

        next();
      };

      mockReq.file = {
        mimetype: "application/octet-stream",
        size: 1024 * 1024,
      };

      validateFileUpload(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid file type" });
    });

    test("should reject files that are too large", () => {
      const validateFileUpload = (req, res, next) => {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        if (req.file.size > 5 * 1024 * 1024) {
          // 5MB limit
          return res.status(400).json({ error: "File too large" });
        }

        next();
      };

      mockReq.file = {
        mimetype: "image/jpeg",
        size: 10 * 1024 * 1024, // 10MB
      };

      validateFileUpload(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "File too large" });
    });
  });

  describe("SQL Injection Prevention", () => {
    test("should sanitize SQL queries", () => {
      const sanitizeQuery = (query) => {
        // Remove SQL injection patterns
        const sqlPatterns = [
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
          /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/gi,
          /(\b(OR|AND)\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/gi,
        ];

        let sanitized = query;
        sqlPatterns.forEach((pattern) => {
          sanitized = sanitized.replace(pattern, "");
        });

        return sanitized.trim();
      };

      const maliciousQuery = "SELECT * FROM users WHERE id = 1 OR 1=1";
      const sanitized = sanitizeQuery(maliciousQuery);
      expect(sanitized).not.toContain("OR 1=1");
    });
  });

  describe("XSS Prevention", () => {
    test("should sanitize user input", () => {
      const sanitizeInput = (input) => {
        if (typeof input !== "string") return input;

        return input
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#x27;")
          .replace(/\//g, "&#x2F;");
      };

      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain("<script>");
      expect(sanitized).toContain("&lt;script&gt;");
    });
  });

  describe("Error Handling", () => {
    test("should handle errors securely", () => {
      const errorHandler = (err, req, res, next) => {
        console.error(err.stack);

        // Don't expose internal errors to client
        const statusCode = err.statusCode || 500;
        const message =
          statusCode === 500 ? "Internal server error" : err.message;

        res.status(statusCode).json({
          error: message,
          ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        });
      };

      const error = new Error("Test error");
      error.statusCode = 400;

      errorHandler(error, mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Test error",
      });
    });

    test("should not expose stack traces in production", () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";

      const errorHandler = (err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        const message =
          statusCode === 500 ? "Internal server error" : err.message;

        res.status(statusCode).json({
          error: message,
          ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        });
      };

      const error = new Error("Database error");
      error.statusCode = 500;

      errorHandler(error, mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });

      process.env.NODE_ENV = originalEnv;
    });
  });
});
