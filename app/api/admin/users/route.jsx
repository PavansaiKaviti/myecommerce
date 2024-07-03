import connectdb from "@/config/mongoose/Mongoosedb";
import User from "@/models/usermodel/Usermodel";
import { getuser } from "@/utils/getuser/User";

export const dynamic = "force-dynamic";
export const GET = async () => {
  try {
    // Connect to the database
    await connectdb();
    // Get the authenticated user
    const userResponse = await getuser();
    if (!userResponse?.user) {
      return new Response(
        JSON.stringify({ message: "User not authenticated" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Find the user in the database
    const finduser = await User.findById(userResponse?.userid);
    if (!finduser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Check if the user is an admin
    if (!finduser.isAdmin) {
      return new Response(JSON.stringify({ message: "Not authorized" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Retrieve all users from the database
    const users = await User.find({});
    if (users.length === 0) {
      return new Response(JSON.stringify({ message: "No users found" }), {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Return the list of users
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
