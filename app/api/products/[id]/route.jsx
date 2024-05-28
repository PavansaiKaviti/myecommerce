import Product from "@/models/products/Productmodel";

export const GET = async (request, { params }) => {
  try {
    const { id } = params;
    const productfound = await Product.findById(id);
    if (Object.keys(productfound).length === 0) {
      return new Response(JSON.stringify({ message: "no product found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(productfound), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
};
