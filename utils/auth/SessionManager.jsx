import jwt from "jsonwebtoken";

// Verify JWT token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

// Extract token from request headers
export const extractToken = (request) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
};

// Middleware to protect routes
export const authenticateUser = async (request) => {
  try {
    const token = extractToken(request);
    if (!token) {
      return { authenticated: false, error: "No token provided" };
    }

    const { valid, payload, error } = verifyToken(token);
    if (!valid) {
      return { authenticated: false, error };
    }

    return { authenticated: true, user: payload };
  } catch (error) {
    return { authenticated: false, error: "Authentication failed" };
  }
}; 