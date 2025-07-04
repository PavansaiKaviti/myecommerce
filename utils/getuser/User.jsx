import { getServerSession } from "next-auth/next";
import { authOptions } from "../Google/Authprovider";

export const getuser = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return null;
    }
    return {
      user: session.user,
      userid: session.user.id,
      isAdmin: session.isAdmin,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export async function requireAdminUser() {
  const { user } = await getuser();
  if (!user) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ message: "User not authenticated" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }
  const UserModel = (await import("@/models/usermodel/Usermodel")).default;
  const finduser = await UserModel.findById(user.id);
  if (!finduser?.isAdmin) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ message: "Not authorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }
  return { ok: true, user: finduser };
}
