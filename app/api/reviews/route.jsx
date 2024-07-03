import Message from "@/models/messagemodel/Messagemodel";
import Product from "@/models/products/Productmodel";
import { getuser } from "@/utils/getuser/User";

export const POST = async (request) => {
  try {
    const { userid } = await getuser();
    // Check if userid exists
    if (!userid) {
      return new Response(
        JSON.stringify({ message: "User not authenticated" }),
        { status: 401 }
      );
    }

    const rawdata = await request.text();
    const body = JSON.parse(rawdata);

    // Validate input data
    if (!body.productid || !body.message || !body.rating) {
      return new Response(JSON.stringify({ message: "Invalid input data" }), {
        status: 400,
      });
    }

    // verify productid
    const findProduct = await Product.findById(body.productid);

    if (!findProduct) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 400,
      });
    }

    const createMessage = await Message.create({
      user: userid,
      product: body.productid,
      message: body.message,
      rating: parseFloat(body.rating),
    });

    findProduct.messages.push(createMessage._id);
    findProduct.save();

    return new Response(JSON.stringify({ message: "Review submitted" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
};
