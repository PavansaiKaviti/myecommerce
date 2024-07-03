import mongoose from "mongoose";

const backimgSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  coverImage: {
    type: String,
  },
});

const Bgimage =
  mongoose.models.Bgimage || mongoose.model("Bgimage", backimgSchema);

export default Bgimage;
