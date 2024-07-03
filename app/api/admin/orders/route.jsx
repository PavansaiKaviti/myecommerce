import connectdb from "@/config/mongoose/Mongoosedb";
import Oder from "@/models/odermodel/Odermodel";
import User from "@/models/usermodel/Usermodel";
import { getuser } from "@/utils/getuser/User";

// export const GET = async (request) => {
//   try {
//     // Connect to the database
//     await connectdb();
//     const url = new URL(request.url);
//     const pagesize = 4;
//     const pages = Math.ceil((await Oder.countDocuments()) / pagesize);
//     const page =
//       url.searchParams.get("page") > pages ? 1 : url.searchParams.get("page");
//     const skip = (page - 1) * pagesize;

//     // Get the authenticated user
//     const { user } = await getuser();

//     if (!user) {
//       return new Response(JSON.stringify({ message: "User not loggedin" }), {
//         status: 401,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     }

//     // Find the user in the database
//     const finduser = await User.findById(user.id);
//     if (!finduser) {
//       return new Response(JSON.stringify({ message: "User not found" }), {
//         status: 404,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     }

//     // Check if the user is an admin
//     if (!finduser.isAdmin) {
//       return new Response(JSON.stringify({ message: "Not authorized" }), {
//         status: 403,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     }

//     // Retrieve all users from the database
//     const orders = await Oder.find({}).skip(skip).limit(pagesize);
//     if (orders.length === 0) {
//       return new Response(JSON.stringify({ message: "No users found" }), {
//         status: 204,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     }
//     // Return the list of users
//     return new Response(JSON.stringify({ orders, pages }), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return new Response(
//       JSON.stringify({
//         message: "Internal server error",
//         error: error.message,
//       }),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
// };

export const dynamic = "force-dynamic";
export const GET = async (request) => {
  try {
    // Connect to the database
    await connectdb();
    const url = new URL(request.url);
    const pagesize = 4;
    const totalOrders = await Oder.countDocuments();
    const pages = Math.ceil(totalOrders / pagesize);
    const page = Math.min(Number(url.searchParams.get("page") || 1), pages);
    const skip = (page - 1) * pagesize;

    // Get the authenticated user
    const userResponse = await getuser();

    if (!userResponse?.user) {
      return new Response(JSON.stringify({ message: "User not logged in" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
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

    // Retrieve orders from the database
    const orders = await Oder.find({}).skip(skip).limit(pagesize);
    if (!orders.length) {
      return new Response(JSON.stringify({ message: "No orders found" }), {
        status: 204,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Return the list of orders
    return new Response(JSON.stringify({ orders, pages }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
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
