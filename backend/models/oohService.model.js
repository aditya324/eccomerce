import mongoose from "mongoose";

// Package schema to support filtering
const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  features: [{ type: String }],
  planId: { type: String },

  // New fields for filtering
  packageType: { type: String, enum: ["Digital", "Static"], required: true },
  subType: { type: String }, // e.g., "Hoardings", "Railway Station", "Pop-ups"
});

// FAQ schema
const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

// Full OOH Service schema
const OOHServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    vendorName: { type: String },
    price: { type: Number },
    thumbnail: { type: String },
    videoUrl: { type: String },
    includes: [{ type: String }],
    description: {
      type: [String],
      default: [],
    },

    // List of pricing plans under this service
    packages: [PackageSchema],
    faqs: [FAQSchema],

    rating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isOOH: { type: Boolean, default: true }, // This helps in differentiating from regular services
  },
  { timestamps: true }
);

// Index for full-text search and filter optimization
OOHServiceSchema.index({
  title: "text",
  description: "text",
  includes: "text",
  "packages.packageType": 1,
  "packages.subType": 1,
});

export default mongoose.model("OOHService", OOHServiceSchema);
