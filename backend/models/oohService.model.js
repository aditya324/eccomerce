import mongoose from "mongoose";


const PackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  billingCycle: { type: String, enum: ["monthly", "yearly"], default: "monthly" },
  features: [{ type: String }],
  planId: { type: String },


  packageType: { type: String, enum: ["Digital", "Static"], required: true },
  subType: { type: String }, 
});


const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});


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


    packages: [PackageSchema],
    faqs: [FAQSchema],

    rating: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isOOH: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);


OOHServiceSchema.index({
  title: "text",
  description: "text",
  includes: "text",
  "packages.packageType": 1,
  "packages.subType": 1,
});

export default mongoose.model("OOHService", OOHServiceSchema);
