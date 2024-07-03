import cloudinary from "@/config/cloudinary/Cloudinary";
import Bgimage from "@/models/bgmodel/Backgroundimage";
import { getuser } from "@/utils/getuser/User";

// export const POST = async (request) => {
//   try {
//     const { user } = await getuser();
//     const formdata = await request.formData();
//     const image = formdata.get("image");
//     const findprevimage = await Bgimage.findOne({ user: user.id });
//     if (!image) {
//       return new Response("No image file found", { status: 400 });
//     }
//     // Convert the image file to a data URL
//     // Upload the image data URL to Cloudinary
//     const imageBuffer = await image.arrayBuffer();
//     const imageArray = Array.from(new Uint8Array(imageBuffer));
//     const imageData = Buffer.from(imageArray);
//     // convert image data to base64
//     const imageBase64 = imageData.toString("base64");
//     const result = await cloudinary.uploader.upload(
//       `data:image/png;base64,${imageBase64}`,
//       {
//         folder: "backgroundimages",
//       }
//     );

//     if (findprevimage?.user.toString() === user.id) {
//       await Bgimage.findByIdAndUpdate(findprevimage._id, {
//         coverImage: result.secure_url,
//       });
//       return new Response(
//         JSON.stringify({ message: "previous image uploaded" }),
//         { status: 200 }
//       );
//     }
//     await Bgimage.create({
//       user: user.id,
//       coverImage: result.secure_url,
//     });
//     return new Response(JSON.stringify({ message: "image uploaded" }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.log(error);
//     return new Response(JSON.stringify({ message: error }), {
//       status: 404,
//     });
//   }
// };

export const POST = async (request) => {
  try {
    const { user } = await getuser();
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 401,
      });
    }

    const formdata = await request.formData();
    const image = formdata.get("image");

    if (!image) {
      return new Response(JSON.stringify({ message: "No image file found" }), {
        status: 400,
      });
    }

    const imageBuffer = await image.arrayBuffer();
    const imageData = Buffer.from(imageBuffer);
    const imageBase64 = imageData.toString("base64");

    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBase64}`,
      {
        folder: "backgroundimages",
      }
    );

    const findprevimage = await Bgimage.findOne({ user: user.id });
    if (findprevimage) {
      await Bgimage.findByIdAndUpdate(findprevimage._id, {
        coverImage: result.secure_url,
      });
      return new Response(
        JSON.stringify({
          message: "Previous image updated",
          url: result.secure_url,
        }),
        { status: 200 }
      );
    }

    await Bgimage.create({
      user: user.id,
      coverImage: result.secure_url,
    });
    return new Response(
      JSON.stringify({ message: "Image uploaded", url: result.secure_url }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return new Response(
      JSON.stringify({
        message: "Error uploading image",
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
};
