import User from "@/models/usermodel/Usermodel";
import { requireAdminUser } from "@/utils/getuser/User";

export const DELETE = async (request, { params }) => {
  const adminCheck = await requireAdminUser();
  if (!adminCheck.ok) return adminCheck.response;
  try {
    // Extract id from params
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is missing" }), {
        status: 400,
      });
    }
    // Finding user
    const findUser = await User.findById(id);
    if (!findUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 400,
      });
    }
    const deleteUser = await User.findByIdAndDelete(id);
    return new Response(
      JSON.stringify({ message: "User deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
