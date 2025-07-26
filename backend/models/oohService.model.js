import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
  title: String,
  price: Number,
  billingCycle: { type: String, default: "monthly" },
  features: [String],
  planId: { type: String },
});

const SubcategorySchema = new mongoose.Schema({
  title: String, // e.g., "LED Screens", "Platform TV"
  packages: [PackageSchema],
});

const FAQSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const OOHServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    city: {
  type: String,
  required: true,
  trim: true
},
    description: { type: [String], default: [] },
    thumbnail: String,
    videoUrl: String,
    subcategories: [SubcategorySchema],
    faqs: [FAQSchema],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("OOHService", OOHServiceSchema);
