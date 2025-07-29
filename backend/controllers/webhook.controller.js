import crypto from "crypto";

import User from "../models/user.model.js";

export const handleRazorpayWebhook = async (req, res) => {


    console.log("🔔 Webhook hit:", req.headers["x-razorpay-signature"]);

  const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", razorpaySecret)
    .update(req.body.toString("utf8"))
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).send("Invalid signature");
  }

  const event = JSON.parse(req.body.toString("utf8"));

  try {
    if (event.event === "subscription.charged") {
      const subId = event.payload.subscription.entity.id;
      const payment = event.payload.payment.entity;

      // Find user with this subscription
      const user = await User.findOne({ "packageSubscriptions.subscriptionId": subId });

      if (!user) return res.status(404).send("User not found for subscription");

      const sub = user.packageSubscriptions.find((s) => s.subscriptionId === subId);

      
      sub.renewalLogs.push({
        paymentId: payment.id,
        date: new Date(payment.created_at * 1000),
        amount: payment.amount / 100,
        status: "paid",
      });

      // Update next billing
      const nextBillingAt = event.payload.subscription.entity.current_end;
      sub.nextBillingDate = new Date(nextBillingAt * 1000);
      sub.paymentStatus = "paid";
      sub.status = "active";

      await user.save();
    }

    if (event.event === "payment.failed") {
      const subId = event.payload.payment.entity.subscription_id;
      const payment = event.payload.payment.entity;

      const user = await User.findOne({ "packageSubscriptions.subscriptionId": subId });
      if (!user) return res.status(404).send("User not found for failed payment");

      const sub = user.packageSubscriptions.find((s) => s.subscriptionId === subId);
      sub.renewalLogs.push({
        paymentId: payment.id,
        date: new Date(payment.created_at * 1000),
        amount: payment.amount / 100,
        status: "failed",
      });

      sub.paymentStatus = "failed";
       

      await user.save();
    }

    return res.status(200).send("Webhook processed");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Server error");
  }
};
