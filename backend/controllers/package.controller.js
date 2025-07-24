


import User from "../models/user.model.js"
import Category from "../models/category.model.js";
import Package from "../models/package.model.js";
import Service from "../models/service.model.js";
import { razorpay } from "../utils/razorpay.js";



export const createPackage = async (req, res) => {
  try {
    const {
      title,
      slug,
      price,
      billingCycle,
      serviceIds,
      features,
      category,
      isFeatured,
      planId,
    } = req.body;

    if (!title || !slug || !price || !serviceIds.length || !planId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existingServices = await Service.find({ _id: { $in: serviceIds } });
    if (existingServices.length !== serviceIds.length) {
      return res.status(400).json({ message: "One or more serviceIds are invalid." });
    }

    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(400).json({ message: "Invalid category ID." });
      }
    }

    const existing = await Package.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Slug already exists." });
    }

    const newPackage = new Package({
      title,
      slug,
      price,
      billingCycle,
      serviceIds,
      features,
      category,
      isFeatured,
      planId, 
    });

    const saved = await newPackage.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ message: "Failed to create package" });
  }
};





export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate("serviceIds");

    res.status(200).json(packages);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "failed to fetch orders" });
  }
};


export const createStandalonePackagePlan = async (req, res) => {
  try {
    const { packageId } = req.params;

    const pkg = await Package.findById(packageId).populate("category");
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    if (pkg.planId) {
      return res.status(400).json({ message: "Plan ID already exists for this package" });
    }

    // Razorpay requires: period, interval, item (name, amount, currency)
    const plan = await razorpay.plans.create({
      period: pkg.billingCycle, // "monthly" or "yearly"
      interval: 1,
      item: {
        name: pkg.title,
        amount: pkg.price * 100, // Convert to paisa
        currency: "INR",
        description: `Subscription plan for ${pkg.title}`,
      },
      notes: {
        packageId: pkg._id.toString(),
        category: pkg.category?.toString() || "uncategorized",
        createdBy: "Sunrise Admin"
      }
    });


    pkg.planId = plan.id;
    await pkg.save();

    res.status(200).json({
      success: true,
      message: "Razorpay plan created successfully",
      planId: plan.id,
      packageId: pkg._id,
    });
  } catch (err) {
    console.error("Create Plan Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};





export const getPackageById = async (req, res) => {
  const { id } = req.params;

  console.log("package",id)

  try {
    const pkg = await Package.findById(id).populate("serviceIds");

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(pkg);
  } catch (err) {
    console.error("Error fetching package by ID:", err);
    res.status(500).json({ message: "Failed to fetch package" });
  }
};





export const getPacakgeByCategory = async (req, res)=>{
 const { slug } = req.params

  try {
 
    const category = await Category.findOne({ slug })
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }


    const plans = await Package.find({ category: category._id })


    return res.json(plans)
  } catch (err) {
    console.error('Failed to load plans', err)
    return res.status(500).json({ message: 'Failed to load plans' })
  }
}




export const subscribeToPackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const pkg = await Package.findById(packageId);

    if (!pkg || !pkg.planId) {
      return res.status(404).json({ message: "Package not found or plan ID missing" });
    }

    if (!user.razorpayCustomerId) {
      return res.status(400).json({ message: "User has no Razorpay customer ID" });
    }


    const razorSubscription = await razorpay.subscriptions.create({
      plan_id: pkg.planId,
      total_count: pkg.billingCycle === "yearly" ? 12 : 1,
      customer_notify: 1,
      customer_id: user.razorpayCustomerId,
      notes: {
        userId: user._id.toString(),
        packageTitle: pkg.title
      }
    });


    user.packageSubscriptions.push({
      subscriptionId: razorSubscription.id,
      packageId: pkg._id,
      status: "created",
      currentStart: new Date(razorSubscription.start_at * 1000),
      currentEnd: new Date(razorSubscription.end_at * 1000)
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscription created successfully",
      razorpaySubscriptionId: razorSubscription.id,
      customerId: user.razorpayCustomerId,
      packageTitle: pkg.title
    });
  } catch (err) {
    console.error("Package Subscription Error:", err);
    res.status(500).json({ message: "Failed to create subscription", error: err.message });
  }
};

