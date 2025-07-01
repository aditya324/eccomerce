import mongoose from "mongoose"

const OrderItemSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  months: Number,
  price: Number,
  subtotal: Number
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [OrderItemSchema],
  billingDetails: {
    firstName: String,
    companyName: String,
    streetAddress: String,
    apartment: String,
    city: String,
    phoneNumber: String,
    emailAddress: String
  },
  total: Number,
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  placedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
