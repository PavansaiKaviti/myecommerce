import cloudinary from "@/config/cloudinary/Cloudinary";
import Product from "@/models/products/Productmodel";
import User from "@/models/usermodel/Usermodel";
import { getuser } from "@/utils/getuser/User";
// Assuming you have a Cloudinary utility setup

export const PUT = async (request, { params }) => {
  try {
    const { id } = params;
    const formData = await request.formData();
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

    const name = formData.get("name") || findProduct.name;
    const description = formData.get("description") || findProduct.description;
    const brand = formData.get("brand") || findProduct.brand;
    const category = formData.get("category") || findProduct.category;
    const price = formData.get("price") || findProduct.price;
    const countInStock =
      formData.get("countInStock") || findProduct.countInStock;
    let image = formData.get("image");

    if (image) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray).toString("base64");

      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageData}`,
        { folder: "backgroundimages" }
      );

      image = result.secure_url;
    } else {
      image = findProduct.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        user: findUser._id,
        name,
        description,
        brand,
        category,
        price,
        countInStock,
        image,
      },
      { new: true }
    );

    return new Response(
      JSON.stringify({
        message: "Product updated successfully",
        product: updatedProduct,
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
