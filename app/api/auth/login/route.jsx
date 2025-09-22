import { NextResponse } from "next/server";
import connectdb from "@/config/mongoose/Mongoosedb";
import User from "@/models/usermodel/Usermodel";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Connect to database
    await connectdb();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user with password
    const user = await User.findByEmailWithPassword(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.isLocked) {
      return NextResponse.json(
        { error: "Account is temporarily locked due to too many failed attempts" },
        { status: 423 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 401 }
      );
    }

    // Check if user has password (Google-only users)
    if (!user.password) {
      return NextResponse.json(
        { 
          error: "This account was created with Google. Please use Google sign-in or create a password to link your account.",
          requiresPassword: true,
          email: user.email
        },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
    };

    return NextResponse.json(
      {
        message: "Login successful",
        user: userResponse,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 