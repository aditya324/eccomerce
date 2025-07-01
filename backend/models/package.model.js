import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g. "Pro Plan"
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true }, // ₹75000
    billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },

    serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }], // bundle

    features: [String], // extra notes like "Website + SEO + UIUX"
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // optional grouping

    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Package", PackageSchema);
