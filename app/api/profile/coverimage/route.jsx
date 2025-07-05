import Bgimage from "@/models/bgmodel/Backgroundimage";
import { getuser } from "@/utils/getuser/User";
import imageupload from "@/utils/uploadimage/Uploadimage";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const userResponse = await getuser();

    // Check if user exists
    if (!userResponse && !userResponse?.user) {
      return new Response(JSON.stringify({ message: "No user found" }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 404,
      });
    }
    const findimage = await Bgimage.findOne({ user: userResponse?.userid });
    if (!findimage) {
      return new Response(JSON.stringify({ message: "user not autorized" }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify({ image: findimage.coverImage }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: error }), {
      status: 200,
    });
  }
};

export const POST = async (request) => {
  try {
    const userResponse = await getuser();

    // Check if user exists
    if (!userResponse || !userResponse?.user) {
      return new Response(JSON.stringify({ message: "No user found" }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 404,
      });
    }

    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return new Response(JSON.stringify({ message: "No image provided" }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
      });
    }

    // Convert file to buffer and get file info
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileType = imageFile.type || "image/jpeg";

    // Upload to Cloudinary
    const imageUrl = await imageupload(buffer, fileType);

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ message: "Failed to upload image" }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 500,
        }
      );
    }

    // Save to database
    const existingImage = await Bgimage.findOne({ user: userResponse.userid });

    if (existingImage) {
      // Update existing record
      existingImage.coverImage = imageUrl;
      await existingImage.save();
    } else {
      // Create new record
      await Bgimage.create({
        user: userResponse.userid,
        coverImage: imageUrl,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Cover image uploaded successfully",
        image: imageUrl,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error uploading cover image:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 500,
    });
  }
};
