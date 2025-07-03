import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true }, 
    billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
     planId: { type: String },

    serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }], 

    features: [String], 
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Package", PackageSchema);
