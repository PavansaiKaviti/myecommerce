import connectdb from "@/config/mongoose/Mongoosedb";
import Product from "@/models/products/Productmodel";
import User from "@/models/usermodel/Usermodel";
import { getuser } from "@/utils/getuser/User";

export const dynamic = "force-dynamic";
export const GET = async (request) => {
  try {
    // Connect to the database
    await connectdb();
    const url = new URL(request.url);
    const pagesize = 4;
    const pages = Math.ceil((await Product.countDocuments()) / pagesize);
    const page =
      url.searchParams.get("page") > pages ? 1 : url.searchParams.get("page");
    const skip = (page - 1) * pagesize;
    // Get the authenticated user
    const userResponse = await getuser();
    if (!userResponse?.user) {
      return new Response(
        JSON.stringify({ message: "User not authenticated" }),
        {
          status: 401,
        }
      );
    }
    // Find the user in the database
    const finduser = await User.findById(userResponse?.userid);
    if (!finduser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Check if the user is an admin
    if (!finduser.isAdmin) {
      return new Response(JSON.stringify({ message: "Not authorized" }), {
        status: 403, // 403 Forbidden indicates the server understood the request but refuses to authorize it
      });
    }
    // Retrieve products from the database
    const products = await Product.find({}).skip(skip).limit(pagesize);
    if (!products) {
      return new Response(JSON.stringify({ message: "no products found" }), {
        status: 204,
      }); // 204 stands for no content status was successfull
    }

    // Return the list of products
    return new Response(JSON.stringify({ products, pages }), { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
};
