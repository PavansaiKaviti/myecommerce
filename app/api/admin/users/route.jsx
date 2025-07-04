import connectdb from "@/config/mongoose/Mongoosedb";
import User from "@/models/usermodel/Usermodel";
import { requireAdminUser } from "@/utils/getuser/User";

export const dynamic = "force-dynamic";
export const GET = async () => {
  const adminCheck = await requireAdminUser();
  if (!adminCheck.ok) return adminCheck.response;
  try {
    // Connect to the database
    await connectdb();
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
