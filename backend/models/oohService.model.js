import mongoose from "mongoose";


const OOHSubcategoryPackageSchema = new mongoose.Schema({
  title: String,
  price: Number,
  billingCycle: { type: String, default: "monthly" },
  features: [String],
  planId: String,
});


const OOHSubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  packages: [OOHSubcategoryPackageSchema],
});


const FAQSchema = new mongoose.Schema({
  question: String,
  answer: String,
});


const OOHServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: {
      type: [String],
      default: [],
    },
    thumbnail: String,
    videoUrl: String,
    subcategories: [OOHSubcategorySchema],
    faqs: [FAQSchema],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);



export default mongoose.model("OOHService", OOHServiceSchema);
