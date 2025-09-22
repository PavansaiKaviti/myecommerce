import { NextResponse } from "next/server";
import connectdb from "@/config/mongoose/Mongoosedb";
import User from "@/models/usermodel/Usermodel";
import { authenticateUser } from "@/utils/auth/SessionManager";

export async function GET(request) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    // Connect to database
    await connectdb();

    // Get user data
    const user = await User.findById(authResult.user.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return user data (without sensitive information)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
      coverImage: user.coverImage,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      hasPassword: !!user.password, // Check if user has password set
    };

    return NextResponse.json({
      user: userResponse,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const { name, username, image, coverImage } = await request.json();

    // Connect to database
    await connectdb();

    // Get user
    const user = await User.findById(authResult.user.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user fields
    if (name) user.name = name;
    if (username) {
      // Check if username is taken by another user
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: user._id } 
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 409 }
        );
      }
      user.username = username;
    }
    if (image !== undefined) user.image = image;
    if (coverImage !== undefined) user.coverImage = coverImage;

    await user.save();

    // Return updated user data
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
      coverImage: user.coverImage,
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      hasPassword: !!user.password,
    };

    return NextResponse.json({
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 