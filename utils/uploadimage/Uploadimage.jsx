import cloudinary from "@/config/cloudinary/Cloudinary";

const imageupload = async (file, fileType = "image/jpeg") => {
  try {
    // Create a stream from the buffer
    const { Readable } = require("stream");
    const stream = Readable.from(file);

    // Upload using stream
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "backgroundimages",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.log("Upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.pipe(uploadStream);
    });

    const result = await uploadPromise;
    const imageUrl = result.secure_url || result.url;
    return imageUrl;
  } catch (error) {
    console.log("Upload function error:", error);
    return null;
  }
};

export default imageupload;
