import cloudinary from "@/config/cloudinary/Cloudinary";
import Product from "@/models/products/Productmodel";
import { requireAdminUser } from "@/utils/getuser/User";
import { validateAndSanitize } from "@/utils/validation/InputValidation";
import {
  SecurityMiddleware,
  RateLimiters,
} from "@/utils/middleware/SecurityMiddleware";

export const POST = async (request) => {
  // Admin authentication/authorization
  const adminCheck = await requireAdminUser();
  if (!adminCheck.ok) return adminCheck.response;
  try {
    // Rate limiting
    const clientIP = SecurityMiddleware.getClientIP(request);
    const rateLimitResult = SecurityMiddleware.rateLimit(
      RateLimiters.upload,
      clientIP
    );

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil(
            (rateLimitResult.resetTime - Date.now()) / 1000
          ),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
            "Retry-After": Math.ceil(
              (rateLimitResult.resetTime - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    // Parse form data
    const formData = await request.formData();

    // Extract and validate form fields
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      brand: formData.get("brand"),
      category: formData.get("category"),
      price: formData.get("price"),
      countInStock: formData.get("countInStock"),
    };

    // Validate product data
    const validation = validateAndSanitize.product(productData);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({
          message: "Invalid product data",
          errors: validation.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate image file
    const imageFile = formData.get("image");
    if (!imageFile) {
      return new Response(
        JSON.stringify({ message: "Product image is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const fileValidation = SecurityMiddleware.validateFileUpload(imageFile, {
      maxSize: 10 * 1024 * 1024, // 10MB for product images
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
    });

    if (!fileValidation.isValid) {
      return new Response(JSON.stringify({ message: fileValidation.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Upload image to Cloudinary with security measures
    const imageBuffer = await imageFile.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(imageBuffer));
    const imageData = Buffer.from(imageArray);
    const imageBase64 = imageData.toString("base64");

    // Generate unique folder name for better organization
    const folderName = `products/${new Date().getFullYear()}/${
      new Date().getMonth() + 1
    }`;

    const result = await cloudinary.uploader.upload(
      `data:${imageFile.type};base64,${imageBase64}`,
      {
        folder: folderName,
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" }, // Limit image size
          { quality: "auto:good" }, // Optimize quality
        ],
        public_id: `${Date.now()}_${SecurityMiddleware.generateSecureToken(8)}`, // Unique filename
      }
    );

    // Create product with validated data
    const uploadProduct = await Product.create({
      user: adminCheck.user._id,
      ...validation.value,
      image: result.secure_url,
    });

    // Log successful product creation
    SecurityMiddleware.logSecurityEvent("product_created", {
      userId: adminCheck.user.id,
      productId: uploadProduct._id,
      productName: validation.value.name,
      severity: "info",
    });

    return new Response(
      JSON.stringify({
        message: "Product added successfully",
        productId: uploadProduct._id,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.resetTime.toString(),
        },
      }
    );
  } catch (error) {
    // Log security event
    SecurityMiddleware.logSecurityEvent("product_creation_error", {
      error: error.message,
      stack: error.stack,
      severity: "error",
    });

    // Sanitize error for production
    const sanitizedError = SecurityMiddleware.sanitizeError(error);

    return new Response(JSON.stringify({ message: sanitizedError.message }), {
      status: sanitizedError.status,
      headers: { "Content-Type": "application/json" },
    });
  }
};
