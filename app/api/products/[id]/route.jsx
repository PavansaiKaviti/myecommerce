import connectdb from "@/config/mongoose/Mongoosedb";
import Product from "@/models/products/Productmodel";

export const GET = async (request, { params }) => {
  try {
    await connectdb();
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), {
        status: 400,
      });
    }

    const productfound = await Product.findById(id);

    // const productpopulate = await productfound.populate("reviews");

    // console.log(productpopulate);

    if (!productfound) {
      return new Response(JSON.stringify({ message: "No product found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(productfound), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "no products" }), {
      status: 500,
    });
  }
};
