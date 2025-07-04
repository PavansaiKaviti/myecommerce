import Oder from "@/models/odermodel/Odermodel";
import { getuser } from "@/utils/getuser/User";

export const GET = async (request) => {
  try {
    console.log("Order API: Starting request");

    // Get the authenticated user (handle null)
    const userResult = await getuser();
    const user = userResult ? userResult.user : null;
    console.log(
      "Order API: User data:",
      user ? { id: user.id, email: user.email } : "No user"
    );

    let oders;

    if (user && user.id) {
      // If user is authenticated, fetch their orders
      console.log(
        "Order API: Fetching orders for authenticated user:",
        user.id
      );
      oders = await Oder.find({ user: user.id }).populate("items");
    } else {
      // If user is not authenticated (e.g., immediately after payment),
      // fetch the most recent order (this is temporary for payment completion)
      console.log(
        "Order API: User not authenticated, fetching most recent order"
      );
      oders = await Oder.find().populate("items");
    }

    console.log("Order API: Found orders count:", oders.length);

    const sortedOders = oders.sort((a, b) => b.createdAt - a.createdAt);
    console.log(
      "Order API: Most recent order:",
      sortedOders[0]
        ? { id: sortedOders[0]._id, createdAt: sortedOders[0].createdAt }
        : "No orders"
    );

    // Return the most recent order
    return new Response(JSON.stringify(sortedOders[0] || null), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Order API: Error details:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch orders",
        details: error.message,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
};
