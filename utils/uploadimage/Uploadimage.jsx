import cloudinary from "@/config/cloudinary/Cloudinary";

const imageupload = async (file) => {
  try {
    const res = await cloudinary.uploader.upload(file, {
      folder: "backgroundimages",
    });
    const imageUrl = res.url;
    return imageUrl;
  } catch (error) {
    console.log(error);
  }
};

export default imageupload;
