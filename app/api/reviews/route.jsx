import Message from "@/models/messagemodel/Messagemodel";
import Product from "@/models/products/Productmodel";
import { getuser } from "@/utils/getuser/User";
import {
  validateAndSanitize,
  reviewRateLimiter,
} from "@/utils/validation/InputValidation";
import { SecurityMiddleware } from "@/utils/middleware/SecurityMiddleware";

export const POST = async (request) => {
  try {
    // Rate limiting
    const clientIP = SecurityMiddleware.getClientIP(request);
    const rateLimitResult = SecurityMiddleware.rateLimit(
      reviewRateLimiter,
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

    // Authentication check
    const { userid } = await getuser();
    if (!userid) {
      return new Response(
        JSON.stringify({ message: "User not authenticated" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse and validate request body
    const rawdata = await request.text();
    let body;

    try {
      body = JSON.parse(rawdata);
    } catch (parseError) {
      return new Response(JSON.stringify({ message: "Invalid JSON format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate review data
    const validation = validateAndSanitize.review(body);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({
          message: "Invalid input data",
          errors: validation.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { productid, message, rating } = validation.value;

    // Verify product exists
    const findProduct = await Product.findById(productid);
    if (!findProduct) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await Message.findOne({
      user: userid,
      product: productid,
    });

    if (existingReview) {
      return new Response(
        JSON.stringify({ message: "You have already reviewed this product" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create review
    const createMessage = await Message.create({
      user: userid,
      product: productid,
      message,
      rating,
    });

    // Update product with review
    findProduct.messages.push(createMessage._id);
    await findProduct.save();

    // Log successful review creation
    SecurityMiddleware.logSecurityEvent("review_created", {
      userId: userid,
      productId: productid,
      rating,
      severity: "info",
    });

    return new Response(
      JSON.stringify({ message: "Review submitted successfully" }),
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
    SecurityMiddleware.logSecurityEvent("review_creation_error", {
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
