import Service from "../models/service.model.js";
import User from "../models/user.model.js";
import { razorpay } from "../utils/razorpay.js";


export const createServiceSubscription = async (req, res) => {
  try {
    const userId = req.user._id;
    const { serviceId, pkgId } = req.params;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const pkg = service.packages.id(pkgId);
    if (!pkg?.planId) {
      return res.status(400).json({ message: "Package or planId missing" });
    }

    const user = await User.findById(userId);
    let customerId = user.razorpayCustomerId;

    // Create a Razorpay Customer if one doesn't exist for the user
    if (!customerId) {
      const customer = await razorpay.customers.create({
        name: user.name,
        email: user.email,
        contact: user.billingDetails.phoneNumber,
      });
      customerId = customer.id;
      user.razorpayCustomerId = customerId;
      await user.save();
    }


    const subscription = await razorpay.subscriptions.create({
      plan_id: pkg.planId,
      customer_id: customerId,
      customer_notify: 1,
  
      total_count: pkg.billingCycle === "yearly" ? 12 : 6,
    });


    const newSubscription = {
      subscriptionId: subscription.id,
      packageId: pkg._id,
      status: subscription.status, // Will be 'created' initially
      currentStart: new Date(subscription.start_at * 1000),
    };


    if (subscription.current_end) {
      newSubscription.currentEnd = new Date(subscription.current_end * 1000);
    }
    
    user.subscriptions.push(newSubscription);
    await user.save();

   
    res.json({
      subscriptionId: subscription.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("createServiceSubscription error:", err);
    res
      .status(500)
      .json({ message: "Failed to create subscription", error: err.message });
  }
};



export const getMySubscriptions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("subscriptions");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // For each subscription, fetch the corresponding service and package details
    const detailedSubscriptions = await Promise.all(
      user.subscriptions.map(async (sub) => {
        // Find the service that contains the packageId
        const service = await Service.findOne(
          { "packages._id": sub.packageId },
          {
            title: 1,
            slug: 1,
            thumbnail: 1,
            "packages.$": 1, // Projection to return only the matching package
          }
        );

        // If service or package is deleted, it might not be found
        if (!service || !service.packages || service.packages.length === 0) {
          return null; 
        }

        const pkg = service.packages[0];

        return {
          subscriptionId: sub.subscriptionId,
          status: sub.status,
          currentStart: sub.currentStart,
          currentEnd: sub.currentEnd,
          paymentId: sub.paymentId,
          paymentStatus: sub.paymentStatus,
          service: {
            id: service._id,
            title: service.title,
            slug: service.slug,
            thumbnail: service.thumbnail,
          },
          package: {
            id: pkg._id,
            title: pkg.title,
            price: pkg.price,
            billingCycle: pkg.billingCycle,
          },
        };
      })
    );

    // Filter out any null results before sending the response
    res.json(detailedSubscriptions.filter(Boolean));
    
  } catch (err) {
    console.error("getMySubscriptions error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch subscriptions", error: err.message });
  }
};