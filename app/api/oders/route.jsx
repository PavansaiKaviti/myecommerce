import Oder from "@/models/odermodel/Odermodel";
import { getuser } from "@/utils/getuser/User";

export const dynamic = "force-dynamic";
export const GET = async (request) => {
  try {
    // Retrieve user from the session
    const { user } = await getuser();
    // Check if user exists
    if (!user && !user?.id) {
      return new Response(JSON.stringify({ message: "No user found" }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 404,
      });
    }

    // Fetch orders from the database
    const oders = await Oder.find({ user: user.id }).populate("items");

    // Check if orders exist
    if (!oders || oders?.length === 0) {
      return new Response(JSON.stringify({ message: "No Oders " }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 404,
      });
    }

    // Return orders in the response
    return new Response(JSON.stringify(oders), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
};
