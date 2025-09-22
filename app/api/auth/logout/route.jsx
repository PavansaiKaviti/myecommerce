import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Clear any session cookies or tokens
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear any authentication cookies
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");
    response.cookies.delete("next-auth.csrf-token");
    response.cookies.delete("__Host-next-auth.csrf-token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
