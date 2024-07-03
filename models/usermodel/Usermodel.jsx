import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already esxists"],
    },
    username: {
      type: String,
      required: [true, "username is required"],
    },
    image: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    oders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Oder",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
