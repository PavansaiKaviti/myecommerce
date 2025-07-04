import connectdb from "@/config/mongoose/Mongoosedb";
import Product from "@/models/products/Productmodel";
import { requireAdminUser } from "@/utils/getuser/User";

export const dynamic = "force-dynamic";
export const GET = async (request) => {
  // Admin authentication/authorization
  const adminCheck = await requireAdminUser();
  if (!adminCheck.ok) return adminCheck.response;

  try {
    // Connect to the database
    await connectdb();
    const url = new URL(request.url);
    const pagesize = 4;
    const pages = Math.ceil((await Product.countDocuments()) / pagesize);
    const page =
      url.searchParams.get("page") > pages ? 1 : url.searchParams.get("page");
    const skip = (page - 1) * pagesize;

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
