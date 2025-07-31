import crypto from "crypto";

import User from "../models/user.model.js";

export const handleRazorpayWebhook = async (req, res) => {
  const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
  const signature = req.headers["x-razorpay-signature"];


  const body = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", razorpaySecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.log("❌ Invalid Razorpay webhook signature");
    return res.status(400).send("Invalid signature");
  }

  try {

    const event = JSON.parse(body.toString("utf8"));
    console.log("📥 Event Received:", event.event);

    let subId;
    let payloadEntity;


    if (event.event.startsWith("subscription.")) {
      payloadEntity = event.payload.subscription.entity;
      subId = payloadEntity.id;
    } else if (event.event.startsWith("payment.")) {
      payloadEntity = event.payload.payment.entity;
      subId = payloadEntity.subscription_id;
    }


    if (!subId) {
      console.log("⚠️ Could not find a subscriptionId in the payload. Ignoring event.");
      return res.status(200).send("Event received but no action required.");
    }

    const user = await User.findOne({
      $or: [
        { "packageSubscriptions.subscriptionId": subId },
        { "subscriptions.subscriptionId": subId },
      ],
    });

    if (!user) {
      console.log("❌ User not found for subscriptionId:", subId);
      return res.status(404).send("User not found for subscription");
    }

    let sub =
      user.packageSubscriptions.find((s) => s.subscriptionId === subId) ||
      user.subscriptions.find((s) => s.subscriptionId === subId);

    if (!sub) {
      console.log("⚠️ Subscription not found inside user document for subId:", subId);
      return res.status(404).send("Subscription object not found on user");
    }

    sub.renewalLogs = sub.renewalLogs || [];

   
    if (event.event === "subscription.charged") {
      const payment = event.payload.payment.entity;
      sub.status = "active";
      sub.paymentStatus = "paid";
      sub.nextBillingDate = new Date(payloadEntity.current_end * 1000);
      sub.renewalLogs.push({
        paymentId: payment.id,
        date: new Date(payment.created_at * 1000),
        amount: payment.amount / 100,
        status: "paid",
      });
      console.log(`✅ Subscription successfully charged for subId: ${subId}`);

    } else if (event.event === "subscription.activated") {
      sub.status = "active";
      sub.paymentStatus = "paid";
      sub.nextBillingDate = new Date(payloadEntity.current_end * 1000);
      console.log(`✅ Subscription activated for subId: ${subId}`);

    } else if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
    
      sub.status = "on_hold";
      sub.paymentStatus = "failed";
      sub.renewalLogs.push({
        paymentId: payment.id,
        date: new Date(payment.created_at * 1000),
        amount: payment.amount / 100,
        status: "failed",
      });
      console.log(`❌ Payment failed for subId: ${subId}`);

    } else if (event.event === "subscription.halted" || event.event === "subscription.cancelled") {
        sub.status = "cancelled";
        sub.nextBillingDate = null;
        console.log(` Subscription ${event.event} for subId: ${subId}`);
    } else {
      console.log(`🤷‍♀️ Unhandled event type: ${event.event}`);
    }

    await user.save();

    res.status(200).send("Webhook processed successfully");

  } catch (error) {
    console.error(" Webhook processing error:", error.message);
    res.status(500).send("Internal Server Error");
  }
};