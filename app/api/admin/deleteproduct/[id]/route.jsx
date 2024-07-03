import Product from "@/models/products/Productmodel";
import User from "@/models/usermodel/Usermodel";
import { getuser } from "@/utils/getuser/User";
// Assuming you have a Cloudinary utility setup

export const DELETE = async (request, { params }) => {
  try {
    const { id } = params;
    const { user } = await getuser();

    const findUser = await User.findById(user.id);
    if (!findUser?.isAdmin) {
      return new Response(JSON.stringify({ message: "not authorized" }), {
        status: 403,
      });
    }

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
