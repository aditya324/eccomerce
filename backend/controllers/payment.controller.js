import crypto from "crypto";

import User from "../models/user.model.js";

export const verifySubscriptionPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ ok: false, message: "Invalid signature" });
    }

    const user = await User.findOne({
      "subscriptions.subscriptionId": razorpay_subscription_id,
    });
    if (!user) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const sub = user.subscriptions.find(
      (s) => s.subscriptionId === razorpay_subscription_id
    );
    sub.paymentId = razorpay_payment_id;
    sub.paymentStatus = "captured";
    sub.paymentSignature = razorpay_signature;
    sub.status = "active";

    await user.save();

    return res.json({ ok: true });
  } catch (err) {
    console.error("verifySubscriptionPayment error:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Server error during payment verification" });
  }
};
