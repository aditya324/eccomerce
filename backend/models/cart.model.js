import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  months: { type: Number, required: true },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [CartItemSchema],
  couponCode: String,
  discount: { type: Number, default: 0 },
  subtotal: Number,
  total: Number
}, { timestamps: true });

export default mongoose.model("Cart", CartSchema);




// const CartItemSchema = new mongoose.Schema({
//   type: { type: String, enum: ["service", "package"], required: true },
//   itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "items.type" }, // points to either Service or Package
//   months: Number,
//   price: Number,
//   subtotal: Number
// });