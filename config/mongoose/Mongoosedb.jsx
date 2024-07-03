import mongoose from "mongoose";
import colors from "colors";
import Product from "@/models/products/Productmodel";
import User from "@/models/usermodel/Usermodel";
import Bgimage from "@/models/bgmodel/Backgroundimage";

let connected = false;

//models
Product();
User();
Bgimage();

const connectdb = async () => {
  // Enable strict query mode throws if there is any undefined fields are used by Mongoodb,

  mongoose.set("strictQuery", true);
  // if its already connected
  if (connected) {
    console.log("mongoosedb connected already...".inverse.red);
    return;
  }
  try {
    await mongoose.connect(process.env.MONGOOSE_URL);
    console.log("mongoosedb Connected...".inverse.green);
    connected = true;
  } catch (error) {
    console.log("error in connecting db:".inverse.red, error);
  }
};

export default connectdb;
