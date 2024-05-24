import connectdb from "@/config/mongoose/Mongoosedb";
import Product from "@/models/products/Productmodel";

export const GET = async () => {
  try {
    await connectdb();
    const products = await Product.find({});
    if (!products) {
      return new Response(JSON.stringify({ message: "no products found" }), {
        status: 204,
      }); // 204 stands for no content status was successfull
    }
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.log(error);
  }
};
