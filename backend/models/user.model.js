import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    googleId: { type: String, unique: true, sparse: true },
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    billingDetails: {
      firstName: String,
      companyName: String,
      streetAddress: String,
      apartment: String,
      city: String,
      phoneNumber: String,
      emailAddress: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
