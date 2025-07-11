import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  subscriptionId:    String,
  packageId:         { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
  status:            String,
  currentStart:      Date,
  currentEnd:        Date,
  paymentId:         String,
  paymentStatus:     String,
  paymentSignature:  String,
}, { _id: false });

const UserSchema = new mongoose.Schema(
  {
    name:                String,
    email:               { type: String, required: true, unique: true },
    googleId:            { type: String, unique: true, sparse: true },
    password:            String,
    role:                { type: String, enum: ["user", "admin"], default: "user" },
    razorpayCustomerId:  { type: String },     
    subscriptions:       [SubscriptionSchema], 
    billingDetails: {
      firstName:         String,
      companyName:       String,
      streetAddress:     String,
      apartment:         String,
      city:              String,
      phoneNumber:       String,
      emailAddress:      String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);



