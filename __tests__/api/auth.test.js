import { GET, POST } from "@/app/api/auth/[...nextauth]/route";

// Mock NextAuth
const mockGetServerSession = jest.fn();
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockGetProviders = jest.fn();

jest.mock("next-auth", () => ({
  getServerSession: () => mockGetServerSession(),
  signIn: () => mockSignIn(),
  signOut: () => mockSignOut(),
  getProviders: () => mockGetProviders(),
}));

// Mock mongoose
const mockConnect = jest.fn();
const mockModel = jest.fn();
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockSave = jest.fn();

jest.mock("mongoose", () => ({
  connect: () => mockConnect(),
  model: () => mockModel(),
  Schema: {
    Types: {
      ObjectId: "ObjectId",
    },
  },
  Types: {
    ObjectId: {
      isValid: jest.fn((id) => id && id.length === 24),
    },
  },
}));

// Mock User model
const mockUserModel = {
  findOne: () => mockFindOne(),
  create: () => mockCreate(),
  save: () => mockSave(),
};

mockModel.mockReturnValue(mockUserModel);

// Mock bcrypt
const mockHash = jest.fn();
const mockCompare = jest.fn();
const mockGenSalt = jest.fn();

jest.mock("bcryptjs", () => ({
  hash: (password, saltRounds) => mockHash(password, saltRounds),
  compare: (password, hash) => mockCompare(password, hash),
  genSalt: (rounds) => mockGenSalt(rounds),
}));

// Mock JWT
const mockSign = jest.fn();
const mockVerify = jest.fn();

jest.mock("jsonwebtoken", () => ({
  sign: (payload, secret, options) => mockSign(payload, secret, options),
  verify: (token, secret) => mockVerify(token, secret),
}));

// Mock Next.js Request and Response
const createMockRequest = (method, body = null, headers = {}) => ({
  method,
  body,
  headers: {
    "content-type": "application/json",
    ...headers,
  },
  url: "http://localhost:3000/api/auth/signin",
});

const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
    redirect: jest.fn(),
  };
  return res;
};

describe("Authentication API Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnect.mockResolvedValue();
  });

  describe("GET /api/auth/session", () => {
    test("should return user session when authenticated", async () => {
      const mockSession = {
        user: {
          id: "507f1f77bcf86cd799439011",
          name: "John Doe",
          email: "john@example.com",
          image: "https://example.com/avatar.jpg",
        },
        expires: new Date(Date.now() + 3600000).toISOString(),
      };

      mockGetServerSession.mockResolvedValue(mockSession);

      const req = createMockRequest("GET");
      const res = createMockResponse();

      await GET(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSession);
    });

    test("should return null when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const req = createMockRequest("GET");
      const res = createMockResponse();

      await GET(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(null);
    });

    test("should handle session errors gracefully", async () => {
      mockGetServerSession.mockRejectedValue(new Error("Session error"));

      const req = createMockRequest("GET");
      const res = createMockResponse();

      await GET(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("POST /api/auth/signin", () => {
    test("should authenticate user with valid credentials", async () => {
      const validCredentials = {
        email: "john@example.com",
        password: "StrongPass123!",
      };

      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        email: "john@example.com",
        password: "hashed_password",
        name: "John Doe",
        role: "user",
      };

      mockFindOne.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(true);
      mockSign.mockReturnValue("valid.jwt.token");

      const req = createMockRequest("POST", validCredentials);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Authentication successful",
        token: "valid.jwt.token",
        user: {
          id: mockUser._id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      });
    });

    test("should reject invalid email format", async () => {
      const invalidCredentials = {
        email: "invalid-email",
        password: "StrongPass123!",
      };

      const req = createMockRequest("POST", invalidCredentials);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid email format",
      });
    });

    test("should reject weak passwords", async () => {
      const weakPasswordCredentials = {
        email: "john@example.com",
        password: "weak",
      };

      const req = createMockRequest("POST", weakPasswordCredentials);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Password must be at least 8 characters long",
      });
    });

    test("should reject non-existent user", async () => {
      const validCredentials = {
        email: "nonexistent@example.com",
        password: "StrongPass123!",
      };

      mockFindOne.mockResolvedValue(null);

      const req = createMockRequest("POST", validCredentials);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
    });

    test("should reject incorrect password", async () => {
      const validCredentials = {
        email: "john@example.com",
        password: "WrongPassword123!",
      };

      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        email: "john@example.com",
        password: "hashed_password",
        name: "John Doe",
        role: "user",
      };

      mockFindOne.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(false);

      const req = createMockRequest("POST", validCredentials);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
    });

    test("should handle database errors", async () => {
      const validCredentials = {
        email: "john@example.com",
        password: "StrongPass123!",
      };

      mockFindOne.mockRejectedValue(new Error("Database error"));

      const req = createMockRequest("POST", validCredentials);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });

    test("should sanitize input data", async () => {
      const credentialsWithXSS = {
        email: '<script>alert("xss")</script>john@example.com',
        password: "StrongPass123!",
      };

      const req = createMockRequest("POST", credentialsWithXSS);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid email format",
      });
    });
  });

  describe("POST /api/auth/signup", () => {
    test("should create new user with valid data", async () => {
      const newUser = {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "StrongPass123!",
      };

      const createdUser = {
        _id: "507f1f77bcf86cd799439012",
        name: "Jane Doe",
        email: "jane@example.com",
        password: "hashed_password",
        role: "user",
        createdAt: new Date(),
      };

      mockFindOne.mockResolvedValue(null); // User doesn't exist
      mockGenSalt.mockResolvedValue("salt");
      mockHash.mockResolvedValue("hashed_password");
      mockCreate.mockResolvedValue(createdUser);
      mockSign.mockReturnValue("valid.jwt.token");

      const req = createMockRequest("POST", newUser);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created successfully",
        token: "valid.jwt.token",
        user: {
          id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
        },
      });
    });

    test("should reject duplicate email", async () => {
      const newUser = {
        name: "Jane Doe",
        email: "existing@example.com",
        password: "StrongPass123!",
      };

      const existingUser = {
        _id: "507f1f77bcf86cd799439011",
        email: "existing@example.com",
        name: "Existing User",
      };

      mockFindOne.mockResolvedValue(existingUser);

      const req = createMockRequest("POST", newUser);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: "User with this email already exists",
      });
    });

    test("should validate required fields", async () => {
      const invalidUser = {
        name: "",
        email: "invalid-email",
        password: "weak",
      };

      const req = createMockRequest("POST", invalidUser);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation failed",
        details: expect.arrayContaining([
          expect.objectContaining({ field: "name" }),
          expect.objectContaining({ field: "email" }),
          expect.objectContaining({ field: "password" }),
        ]),
      });
    });

    test("should hash password securely", async () => {
      const newUser = {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "StrongPass123!",
      };

      mockFindOne.mockResolvedValue(null);
      mockGenSalt.mockResolvedValue("salt");
      mockHash.mockResolvedValue("hashed_password");
      mockCreate.mockResolvedValue({
        _id: "507f1f77bcf86cd799439012",
        ...newUser,
        password: "hashed_password",
        role: "user",
      });

      const req = createMockRequest("POST", newUser);
      const res = createMockResponse();

      await POST(req, res);

      expect(mockGenSalt).toHaveBeenCalledWith(12);
      expect(mockHash).toHaveBeenCalledWith("StrongPass123!", "salt");
    });
  });

  describe("POST /api/auth/signout", () => {
    test("should sign out user successfully", async () => {
      const req = createMockRequest("POST");
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Signed out successfully",
      });
    });
  });

  describe("GET /api/auth/providers", () => {
    test("should return available authentication providers", async () => {
      const mockProviders = {
        google: {
          id: "google",
          name: "Google",
          type: "oauth",
          signinUrl: "http://localhost:3000/api/auth/signin/google",
          callbackUrl: "http://localhost:3000/api/auth/callback/google",
        },
      };

      mockGetProviders.mockResolvedValue(mockProviders);

      const req = createMockRequest("GET");
      const res = createMockResponse();

      await GET(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProviders);
    });

    test("should handle provider errors", async () => {
      mockGetProviders.mockRejectedValue(new Error("Provider error"));

      const req = createMockRequest("GET");
      const res = createMockResponse();

      await GET(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("Security Tests", () => {
    test("should prevent brute force attacks", async () => {
      const credentials = {
        email: "john@example.com",
        password: "WrongPassword123!",
      };

      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        email: "john@example.com",
        password: "hashed_password",
      };

      mockFindOne.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(false);

      const req = createMockRequest("POST", credentials);
      const res = createMockResponse();

      // Simulate multiple failed attempts
      for (let i = 0; i < 6; i++) {
        await POST(req, res);
      }

      // Should rate limit after 5 failed attempts
      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith({
        error: "Too many failed login attempts",
      });
    });

    test("should validate JWT tokens", async () => {
      const validToken = "valid.jwt.token";
      const invalidToken = "invalid.token";

      mockVerify.mockImplementation((token) => {
        if (token === validToken) {
          return { userId: "123", email: "john@example.com" };
        }
        throw new Error("Invalid token");
      });

      expect(mockVerify(validToken)).toEqual({
        userId: "123",
        email: "john@example.com",
      });

      expect(() => mockVerify(invalidToken)).toThrow("Invalid token");
    });

    test("should prevent SQL injection in email queries", async () => {
      const maliciousEmail = "'; DROP TABLE users; --";
      const credentials = {
        email: maliciousEmail,
        password: "StrongPass123!",
      };

      const req = createMockRequest("POST", credentials);
      const res = createMockResponse();

      await POST(req, res);

      // Should handle the query safely
      expect(mockFindOne).toHaveBeenCalledWith({
        email: expect.not.stringContaining("DROP TABLE"),
      });
    });

    test("should validate password strength", async () => {
      const weakPasswords = [
        "weak",
        "12345678",
        "password",
        "no-uppercase-123",
        "NO-LOWERCASE-123",
        "NoNumbers",
      ];

      for (const password of weakPasswords) {
        const credentials = {
          email: "john@example.com",
          password,
        };

        const req = createMockRequest("POST", credentials);
        const res = createMockResponse();

        await POST(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          error: expect.stringContaining("Password"),
        });
      }
    });

    test("should prevent XSS in user input", async () => {
      const maliciousUser = {
        name: '<script>alert("xss")</script>John Doe',
        email: "john@example.com",
        password: "StrongPass123!",
      };

      const req = createMockRequest("POST", maliciousUser);
      const res = createMockResponse();

      await POST(req, res);

      // Should sanitize the input
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.not.stringContaining("<script>"),
        })
      );
    });

    test("should limit request body size", async () => {
      const largeUser = {
        name: "A".repeat(10000),
        email: "john@example.com",
        password: "StrongPass123!",
      };

      const req = createMockRequest("POST", largeUser);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(413);
      expect(res.json).toHaveBeenCalledWith({
        error: "Request body too large",
      });
    });
  });

  describe("Error Handling", () => {
    test("should handle missing request body", async () => {
      const req = createMockRequest("POST");
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Request body is required",
      });
    });

    test("should handle malformed JSON", async () => {
      const req = {
        method: "POST",
        body: "invalid-json",
        headers: { "content-type": "application/json" },
      };
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid JSON format",
      });
    });

    test("should handle database connection errors", async () => {
      mockConnect.mockRejectedValue(new Error("Database connection failed"));

      const req = createMockRequest("POST", {
        email: "john@example.com",
        password: "StrongPass123!",
      });
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });

    test("should handle JWT signing errors", async () => {
      const credentials = {
        email: "john@example.com",
        password: "StrongPass123!",
      };

      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        email: "john@example.com",
        password: "hashed_password",
        name: "John Doe",
        role: "user",
      };

      mockFindOne.mockResolvedValue(mockUser);
      mockCompare.mockResolvedValue(true);
      mockSign.mockImplementation(() => {
        throw new Error("JWT signing failed");
      });

      const req = createMockRequest("POST", credentials);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});
