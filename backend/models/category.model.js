import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    icon: { type: String }, // optional image/icon
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema); 
