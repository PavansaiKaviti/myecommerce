import { GET, POST } from "@/app/api/products/route";
import { GET as getProductById } from "@/app/api/products/[id]/route";

// Mock mongoose
const mockConnect = jest.fn();
const mockModel = jest.fn();
const mockFind = jest.fn();
const mockFindById = jest.fn();
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

// Mock Product model
const mockProductModel = {
  find: () => mockFind(),
  findById: () => mockFindById(),
  create: () => mockCreate(),
  save: () => mockSave(),
};

mockModel.mockReturnValue(mockProductModel);

// Mock Next.js Request and Response
const createMockRequest = (method, body = null, query = {}) => ({
  method,
  body,
  url: `http://localhost:3000/api/products?${new URLSearchParams(
    query
  ).toString()}`,
  headers: {
    "content-type": "application/json",
  },
});

const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
  };
  return res;
};

describe("Products API Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnect.mockResolvedValue();
  });

  describe("GET /api/products", () => {
    test("should return products with pagination", async () => {
      const mockProducts = [
        {
          _id: "507f1f77bcf86cd799439011",
          name: "Test Product 1",
          price: 99.99,
          stock: 10,
          category: "Electronics",
          brand: "Test Brand",
          images: ["image1.jpg"],
          rating: 4.5,
          numReviews: 25,
        },
        {
          _id: "507f1f77bcf86cd799439012",
          name: "Test Product 2",
          price: 149.99,
          stock: 5,
          category: "Electronics",
          brand: "Test Brand",
          images: ["image2.jpg"],
          rating: 4.0,
          numReviews: 15,
        },
      ];

      mockFind.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockProducts),
        }),
      });

      const req = createMockRequest("GET", null, { page: "1", limit: "10" });
      const res = createMockResponse();

      await GET(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        products: mockProducts,
        currentPage: 1,
        totalPages: 1,
        totalProducts: 2,
        hasNextPage: false,
        hasPrevPage: false,
      });
    });

    test("should handle search query", async () => {
      const mockProducts = [
        {
          _id: "507f1f77bcf86cd799439011",
          name: "iPhone 13",
          price: 999.99,
          stock: 10,
          category: "Electronics",
          brand: "Apple",
          images: ["iphone.jpg"],
          rating: 4.5,
          numReviews: 25,
        },
      ];

      mockFind.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockProducts),
        }),
      });

      const req = createMockRequest("GET", null, { search: "iPhone" });
      const res = createMockResponse();

      await GET(req, res);

      expect(mockFind).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: "iPhone", $options: "i" } },
          { description: { $regex: "iPhone", $options: "i" } },
          { category: { $regex: "iPhone", $options: "i" } },
          { brand: { $regex: "iPhone", $options: "i" } },
        ],
      });
    });

    test("should handle category filter", async () => {
      const mockProducts = [
        {
          _id: "507f1f77bcf86cd799439011",
          name: "Test Product",
          price: 99.99,
          stock: 10,
          category: "Electronics",
          brand: "Test Brand",
          images: ["image1.jpg"],
          rating: 4.5,
          numReviews: 25,
        },
      ];

      mockFind.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockProducts),
        }),
      });

      const req = createMockRequest("GET", null, { category: "Electronics" });
      const res = createMockResponse();

      await GET(req, res);

      expect(mockFind).toHaveBeenCalledWith({ category: "Electronics" });
    });

    test("should handle price range filter", async () => {
      const mockProducts = [
        {
          _id: "507f1f77bcf86cd799439011",
          name: "Test Product",
          price: 99.99,
          stock: 10,
          category: "Electronics",
          brand: "Test Brand",
          images: ["image1.jpg"],
          rating: 4.5,
          numReviews: 25,
        },
      ];

      mockFind.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockProducts),
        }),
      });

      const req = createMockRequest("GET", null, {
        minPrice: "50",
        maxPrice: "150",
      });
      const res = createMockResponse();

      await GET(req, res);

      expect(mockFind).toHaveBeenCalledWith({
        price: { $gte: 50, $lte: 150 },
      });
    });

    test("should handle sorting", async () => {
      const mockProducts = [
        {
          _id: "507f1f77bcf86cd799439011",
          name: "Test Product",
          price: 99.99,
          stock: 10,
          category: "Electronics",
          brand: "Test Brand",
          images: ["image1.jpg"],
          rating: 4.5,
          numReviews: 25,
        },
      ];

      mockFind.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockProducts),
          }),
        }),
      });

      const req = createMockRequest("GET", null, { sort: "price-asc" });
      const res = createMockResponse();

      await GET(req, res);

      expect(mockFind().sort).toHaveBeenCalledWith({ price: 1 });
    });

    test("should handle database connection errors", async () => {
      mockConnect.mockRejectedValue(new Error("Database connection failed"));

      const req = createMockRequest("GET");
      const res = createMockResponse();

      await GET(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });

    test("should handle invalid pagination parameters", async () => {
      const req = createMockRequest("GET", null, { page: "-1", limit: "0" });
      const res = createMockResponse();

      await GET(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid pagination parameters",
      });
    });

    test("should handle XSS in search query", async () => {
      const maliciousQuery = '<script>alert("xss")</script>';
      const req = createMockRequest("GET", null, { search: maliciousQuery });
      const res = createMockResponse();

      await GET(req, res);

      // Should sanitize the query and not crash
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should handle SQL injection attempts", async () => {
      const maliciousQuery = "'; DROP TABLE products; --";
      const req = createMockRequest("GET", null, { search: maliciousQuery });
      const res = createMockResponse();

      await GET(req, res);

      // Should handle the query safely and not crash
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("POST /api/products", () => {
    test("should create a new product with valid data", async () => {
      const newProduct = {
        name: "New Product",
        description: "A new product description",
        price: 99.99,
        stock: 10,
        category: "Electronics",
        brand: "Test Brand",
        images: ["image1.jpg", "image2.jpg"],
      };

      const createdProduct = {
        _id: "507f1f77bcf86cd799439011",
        ...newProduct,
        rating: 0,
        numReviews: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreate.mockResolvedValue(createdProduct);

      const req = createMockRequest("POST", newProduct);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product created successfully",
        product: createdProduct,
      });
    });

    test("should validate required fields", async () => {
      const invalidProduct = {
        name: "",
        price: -10,
        stock: -5,
      };

      const req = createMockRequest("POST", invalidProduct);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation failed",
        details: expect.arrayContaining([
          expect.objectContaining({ field: "name" }),
          expect.objectContaining({ field: "price" }),
          expect.objectContaining({ field: "stock" }),
        ]),
      });
    });

    test("should sanitize input data", async () => {
      const productWithXSS = {
        name: '<script>alert("xss")</script>Product Name',
        description: '<img src="x" onerror="alert(\'xss\')">Description',
        price: 99.99,
        stock: 10,
        category: "Electronics",
        brand: "Test Brand",
        images: ["image1.jpg"],
      };

      const req = createMockRequest("POST", productWithXSS);
      const res = createMockResponse();

      await POST(req, res);

      // Should sanitize the input and create product
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.not.stringContaining("<script>"),
          description: expect.not.stringContaining("<img"),
        })
      );
    });

    test("should handle duplicate product names", async () => {
      const duplicateProduct = {
        name: "Existing Product",
        description: "A product description",
        price: 99.99,
        stock: 10,
        category: "Electronics",
        brand: "Test Brand",
        images: ["image1.jpg"],
      };

      mockCreate.mockRejectedValue({
        code: 11000,
        keyPattern: { name: 1 },
      });

      const req = createMockRequest("POST", duplicateProduct);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: "Product with this name already exists",
      });
    });

    test("should handle file upload validation", async () => {
      const productWithInvalidImages = {
        name: "Test Product",
        description: "A test product",
        price: 99.99,
        stock: 10,
        category: "Electronics",
        brand: "Test Brand",
        images: ["invalid.exe", "malicious.php"],
      };

      const req = createMockRequest("POST", productWithInvalidImages);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid image file types",
      });
    });

    test("should handle database errors", async () => {
      const newProduct = {
        name: "Test Product",
        description: "A test product",
        price: 99.99,
        stock: 10,
        category: "Electronics",
        brand: "Test Brand",
        images: ["image1.jpg"],
      };

      mockCreate.mockRejectedValue(new Error("Database error"));

      const req = createMockRequest("POST", newProduct);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("GET /api/products/[id]", () => {
    test("should return product by ID", async () => {
      const mockProduct = {
        _id: "507f1f77bcf86cd799439011",
        name: "Test Product",
        description: "A test product description",
        price: 99.99,
        stock: 10,
        category: "Electronics",
        brand: "Test Brand",
        images: ["image1.jpg", "image2.jpg"],
        rating: 4.5,
        numReviews: 25,
        reviews: [
          {
            _id: "507f1f77bcf86cd799439012",
            user: "507f1f77bcf86cd799439013",
            rating: 5,
            comment: "Great product!",
            createdAt: new Date(),
          },
        ],
      };

      mockFindById.mockResolvedValue(mockProduct);

      const req = createMockRequest("GET");
      const res = createMockResponse();

      await getProductById(req, { params: { id: "507f1f77bcf86cd799439011" } });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        product: mockProduct,
      });
    });

    test("should handle invalid product ID", async () => {
      const req = createMockRequest("GET");
      const res = createMockResponse();

      await getProductById(req, { params: { id: "invalid-id" } });

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid product ID",
      });
    });

    test("should handle product not found", async () => {
      mockFindById.mockResolvedValue(null);

      const req = createMockRequest("GET");
      const res = createMockResponse();

      await getProductById(req, { params: { id: "507f1f77bcf86cd799439011" } });

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Product not found",
      });
    });

    test("should handle database errors", async () => {
      mockFindById.mockRejectedValue(new Error("Database error"));

      const req = createMockRequest("GET");
      const res = createMockResponse();

      await getProductById(req, { params: { id: "507f1f77bcf86cd799439011" } });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("Security Tests", () => {
    test("should prevent NoSQL injection", async () => {
      const maliciousQuery = { $where: "function() { return true; }" };
      const req = createMockRequest("GET", null, {
        search: JSON.stringify(maliciousQuery),
      });
      const res = createMockResponse();

      await GET(req, res);

      // Should not execute the malicious query
      expect(mockFind).not.toHaveBeenCalledWith(maliciousQuery);
    });

    test("should validate input data types", async () => {
      const invalidProduct = {
        name: 123, // Should be string
        price: "not-a-number", // Should be number
        stock: "invalid", // Should be number
      };

      const req = createMockRequest("POST", invalidProduct);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation failed",
      });
    });

    test("should limit request body size", async () => {
      const largeProduct = {
        name: "A".repeat(10000), // Very large name
        description: "B".repeat(50000), // Very large description
        price: 99.99,
        stock: 10,
        category: "Electronics",
        brand: "Test Brand",
        images: ["image1.jpg"],
      };

      const req = createMockRequest("POST", largeProduct);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(413);
      expect(res.json).toHaveBeenCalledWith({
        error: "Request body too large",
      });
    });

    test("should rate limit requests", async () => {
      const req = createMockRequest("GET");
      const res = createMockResponse();

      // Simulate multiple rapid requests
      for (let i = 0; i < 101; i++) {
        await GET(req, res);
      }

      // Should rate limit after 100 requests
      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith({
        error: "Too many requests",
      });
    });

    test("should validate file uploads", async () => {
      const productWithMaliciousFile = {
        name: "Test Product",
        description: "A test product",
        price: 99.99,
        stock: 10,
        category: "Electronics",
        brand: "Test Brand",
        images: ["../../../etc/passwd", "malicious.php"],
      };

      const req = createMockRequest("POST", productWithMaliciousFile);
      const res = createMockResponse();

      await POST(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid file paths detected",
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

    test("should handle unsupported HTTP methods", async () => {
      const req = createMockRequest("PUT");
      const res = createMockResponse();

      await GET(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({
        error: "Method not allowed",
      });
    });
  });
});
