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

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user already has a password
    if (user.password) {
      return NextResponse.json(
        { error: "User already has a password set" },
        { status: 409 }
      );
    }

    // Update user with password
    user.password = password;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return user data and token
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
        message: "Password added successfully. You can now use both Google and email/password login.",
        user: userResponse,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Add password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 