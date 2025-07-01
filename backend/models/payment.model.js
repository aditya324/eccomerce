import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },

  amount: Number,
  currency: { type: String, default: "INR" },
  provider: { type: String, default: "razorpay" },

  providerOrderId: String,
  providerPaymentId: String,
  providerSignature: String,

  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  paidAt: Date
}, { timestamps: true });

export default mongoose.model("Payment", PaymentSchema);
