// controllers/serviceSubscription.controller.js
import Service from "../models/service.model.js";
import User from "../models/user.model.js";
import { razorpay } from "../utils/razorpay.js";

export const createServiceSubscription = async (req, res) => {
  const userId = req.user._id;
  const { serviceId, pkgId } = req.params;


  const service = await Service.findById(serviceId);
  if (!service) return res.status(404).json({ message: "Service not found" });

  const pkg = service.packages.id(pkgId);
  if (!pkg?.planId) {
    return res.status(400).json({ message: "Package or planId missing" });
  }


  const user = await User.findById(userId);
  let customerId = user.razorpayCustomerId;
  if (!customerId) {
    const customer = await razorpay.customers.create({
      name:    user.name,
      email:   user.email,
      contact: user.billingDetails.phoneNumber,
    });
    customerId = customer.id;
    user.razorpayCustomerId = customerId;
    await user.save();
  }


  const subscription = await razorpay.subscriptions.create({
    plan_id:         pkg.planId,
    customer_notify: 1,
    customer_id:     customerId,
    total_count:     pkg.billingCycle === "yearly" ? 1 : 12,
  });

 
  user.subscriptions.push({
    subscriptionId: subscription.id,
    packageId:      pkg._id,
    status:         subscription.status,
    currentStart:   new Date(subscription.start_at * 1000),
    currentEnd:     new Date(subscription.current_end * 1000),
  });
  await user.save();


  res.json({
    subscriptionId: subscription.id,
    razorpayKey:    process.env.RAZORPAY_KEY_ID,
  });
};
