import cloudinary from "@/config/cloudinary/Cloudinary";
import Product from "@/models/products/Productmodel";
import User from "@/models/usermodel/Usermodel";
import { getuser } from "@/utils/getuser/User";

export const POST = async (request) => {
  try {
    const formData = await request.formData();
    const { user } = await getuser();
    const finduser = await User.findById(user.id);
    const name = formData.get("name");
    const description = formData.get("description");
    const brand = formData.get("brand");
    const category = formData.get("category");
    const price = formData.get("price");
    const imageraw = formData.get("image");
    const countInStock = formData.get("countInStock");
    if (!finduser?.isAdmin) {
      return new Response(JSON.stringify({ message: "not authorized" }), {
        status: 404,
      });
    }
    // Convert the image file to a data URL
    // Upload the image data URL to Cloudinary
    const imageBuffer = await imageraw.arrayBuffer();
    const imageArray = Array.from(new Uint8Array(imageBuffer));
    const imageData = Buffer.from(imageArray);
    // convert image data to base64
    const imageBase64 = imageData.toString("base64");
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBase64}`,
      {
        folder: "backgroundimages",
      }
    );
    const uploadProduct = await Product.create({
      user: finduser._id,
      name,
      description,
      brand,
      category,
      price,
      countInStock,
      image: result.secure_url,
    });
    return new Response(
      JSON.stringify({ message: "product added successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error }), {
      status: 404,
    });
  }
};
