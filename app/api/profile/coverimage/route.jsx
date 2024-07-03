import Bgimage from "@/models/bgmodel/Backgroundimage";
import { getuser } from "@/utils/getuser/User";

export const dynamic = "force-dynamic";
export const GET = async () => {
  try {
    const userResponse = await getuser();

    // Check if user exists
    if (!userResponse && !userResponse?.user) {
      return new Response(JSON.stringify({ message: "No user found" }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 404,
      });
    }
    const findimage = await Bgimage.findOne({ user: userResponse?.userid });
    if (!findimage) {
      return new Response(JSON.stringify({ message: "user not autorized" }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify({ image: findimage.coverImage }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: error }), {
      status: 200,
    });
  }
};
