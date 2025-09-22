import { NextResponse } from "next/server";
import connectdb from "@/config/mongoose/Mongoosedb";
import User from "@/models/usermodel/Usermodel";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { name, email, password, username } = await request.json();

    // Connect to database
    await connectdb();

    // Validation
    if (!name || !email || !password || !username) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Check if username is taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      username,
    });

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
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 