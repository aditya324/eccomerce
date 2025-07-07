import mongoose from "mongoose";
const PackageSchema = new mongoose.Schema({
  title: String,
  price: Number,
  billingCycle: { type: String, default: "monthly" },
  features: [String],
  planId: { type: String },
});

const FAQSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    vendorName: String,
    price: Number,
    thumbnail: String,
    videoUrl: String,
    includes: [String],
    description: {
      type: [String], 
      default: [],
      required: true,
    },
    packages: [PackageSchema],
    faqs: [FAQSchema],
    rating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ServiceSchema.index({
  title: "text",
  description: "text",
  includes: "text",
});

export default mongoose.model("Service", ServiceSchema);
