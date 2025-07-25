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


export const verifyPackagePayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    console.log("Subscription ID:", razorpay_subscription_id);
    console.log("Payment ID:", razorpay_payment_id);
    console.log("Signature from frontend:", razorpay_signature);

   const generatedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
  .digest("hex");

    console.log("Signature generated:", generatedSignature);

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature. Payment verification failed." });
    }

    const user = await User.findById(userId);
    const subscription = user.packageSubscriptions.find(
      (sub) => sub.subscriptionId === razorpay_subscription_id
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found in user record" });
    }

    subscription.paymentId = razorpay_payment_id;
    subscription.paymentSignature = razorpay_signature;
    subscription.paymentStatus = "paid";
    subscription.status = "active";

    await user.save();

    res.status(200).json({ success: true, message: "Payment verified and subscription activated" });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ success: false, message: "Verification failed", error: error.message });
  }
};






