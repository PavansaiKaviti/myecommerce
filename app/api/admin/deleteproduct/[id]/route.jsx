import Product from "@/models/products/Productmodel";
import { requireAdminUser } from "@/utils/getuser/User";
// Assuming you have a Cloudinary utility setup

export const DELETE = async (request, { params }) => {
  const adminCheck = await requireAdminUser();
  if (!adminCheck.ok) return adminCheck.response;
  try {
    const { id } = params;
    const findProduct = await Product.findById(id);
    if (!findProduct) {
      return new Response(JSON.stringify({ message: "product not found" }), {
        status: 404,
      });
    }
    await Product.findByIdAndDelete(id);
    return new Response(
      JSON.stringify({
        message: "Product deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
