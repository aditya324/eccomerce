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









export const getMySubscriptions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("subscriptions")
      .populate({
        path: "subscriptions.packageId",
        populate: {
          path:   "serviceIds",
          model:  "Service",
          select: "title slug thumbnail",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const detailed = user.subscriptions.map((sub) => {
      const pkg      = sub.packageId;
      const services = Array.isArray(pkg?.serviceIds)
        ? pkg.serviceIds
        : [];

      return {
        subscriptionId: sub.subscriptionId,
        status:         sub.status,
        currentStart:   sub.currentStart,
        currentEnd:     sub.currentEnd,
        paymentId:      sub.paymentId,
        paymentStatus:  sub.paymentStatus,

        package: {
          id:           pkg._id,
          title:        pkg.title,
          price:        pkg.price,
          billingCycle: pkg.billingCycle,
        },

        services: services.map((s) => ({
          id:        s._id,
          title:     s.title,
          slug:      s.slug,
          thumbnail: s.thumbnail,
        })),
      };
    });

    res.json(detailed);
  } catch (err) {
    console.error("getMySubscriptions error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch subscriptions", error: err.message });
  }
};
