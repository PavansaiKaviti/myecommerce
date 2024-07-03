import User from "@/models/usermodel/Usermodel";
import { getuser } from "@/utils/getuser/User";

export const dynamic = "force-dynamic";
export const GET = async (request) => {
  try {
    const { user } = await getuser();
    const id = user.id;
    if (!id) {
      return new Response({ message: "no user" }, { status: 400 });
    }
    const userFound = await User.findById(id);

    if (userFound._id.toString() !== id) {
      return new Response({ message: "not a user" }, { status: 404 });
    }
    return new Response(JSON.stringify(userFound), { status: 200 });
  } catch (error) {
    return new Response({ error });
  }
};
