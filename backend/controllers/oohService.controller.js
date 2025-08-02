import mongoose from "mongoose";

import OOHService from "../models/oohService.model.js";
import { razorpay } from "../utils/razorpay.js";
import User from "../models/user.model.js"

export const createOOHService = async (req, res) => {
  try {
    const service = new OOHService(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getAllOOHServices = async (req, res) => {
  try {
    const services = await OOHService.find();
    res.status(200).json({service:services});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getOOHServiceById = async (req, res) => {
  try {
    const service = await OOHService.findById(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateOOHService = async (req, res) => {
  try {
    const service = await OOHService.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteOOHService = async (req, res) => {
  try {
    const service = await OOHService.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOOHServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const service = await OOHService.findOne({ slug });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getPackagesBySubType = async (req, res) => {
  try {
    const { id } = req.params;
    const { subType } = req.query;

    if (!subType) {
      return res.status(400).json({ error: "subType is required" });
    }

    const service = await OOHService.findById(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    const matchingPackages = service.packages
      .filter(pkg => pkg.subType === subType)
      .slice(0, 3); 

    res.json({ packages: matchingPackages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const createOOHServicePackagePlan = async (req, res) => {
  try {
    const { serviceId, pkgId } = req.params;

    const oohService = await OOHService.findById(serviceId);
    if (!oohService) {
      return res.status(404).json({ message: "OOH Service not found" });
    }

    const pkg = oohService.packages.id(pkgId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found in OOH Service" });
    }

    if (pkg.planId) {
      return res.status(400).json({ message: "Package already has a Razorpay plan" });
    }

    const period = "monthly"; 
    const interval = 1;
    const amount = pkg.price * 100;
    const name = `${oohService.title} — ${pkg.title}`;

    let plan;
    try {
      plan = await razorpay.plans.create({
        period,
        interval,
        item: {
          name,
          amount,
          currency: "INR",
          description: `${oohService.title} / ${pkg.title} — ${period} subscription`,
        },
      });
    } catch (err) {
      console.error("❌ Razorpay error:", err);
      return res.status(500).json({ message: "Failed to create plan", error: err.message });
    }

    if (!plan?.id) {
      return res.status(500).json({ message: "Invalid Razorpay response" });
    }

    pkg.planId = plan.id;
    await oohService.save();

    return res.json({
      message: "Razorpay plan created for OOH service package",
      planId: plan.id,
      serviceId: oohService._id,
      pkgId: pkg._id,
    });

  } catch (err) {
    console.error("❌ Error creating Razorpay plan for OOH service:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


export const createOohServicePackagePlan = async (req, res) => {
  try {
    const { oohserviceId, pkgId } = req.params;

    console.log("serviceId:", req.params.oohserviceId);

    console.log("pkgId:", req.params.pkgId);

    const service = await OOHService.findById(oohserviceId);
    if (!service) {
      return res.status(404).json({ message: "oohserviceId not found" });
    }

    const pkg = OOHService.packages.id(pkgId);
    if (!pkg) {
      return res
        .status(404)
        .json({ message: "Package not found in this service" });
    }

    if (pkg.planId) {
      return res
        .status(400)
        .json({ message: "This package already has a Razorpay planId" });
    }

    const period = "monthly" 
    const interval = 1;
    const amount = pkg.price * 100;
    const name = `${service.title} — ${pkg.title}`;

    const plan = await razorpay.plans.create({
      period,
      interval,
      item: {
        name,
        amount,
        currency: "INR",
        description: `${service.title} / ${pkg.title} — ${period} subscription`,
      },
    });

    console.log("Creating Razorpay plan with:");
    console.log("  billingCycle:", pkg.billingCycle);
    console.log("  price:", pkg.price);

    pkg.planId = plan.id;
    await service.save();

    res.json({
      message: "Razorpay plan created for service package",
      planId: plan.id,
      serviceId: service._id,
      pkgId: pkg._id,
    });
  } catch (err) {
    console.error("Error creating plan for service package:", err);
    res
      .status(500)
      .json({ message: "Failed to create plan", error: err.message });
  }
};




export const subscribeToOohService = async (req, res) => {
  try {
    const { oohserviceId, pkgId } = req.params;
    const userId = req.user._id; 

    if (!mongoose.Types.ObjectId.isValid(oohserviceId)) {
      return res.status(400).json({ message: "Invalid service ID format" });
    }

    const oohService = await OOHService.findById(oohserviceId);
    if (!oohService) {
      return res.status(404).json({ message: "OOH Service not found" });
    }

    const pkg = oohService.packages.id(pkgId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    const planId = pkg.planId;
    if (!planId) {
      return res.status(400).json({ message: "No planId exists for this package." });
    }


    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, 
    });


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.oohSubscriptions.push({
      oohServiceId: oohserviceId,
      subscriptionId: subscription.id,
      packageId: pkg._id,
      status: "created",
      paymentStatus: "pending",
      currentStart: null,
      currentEnd: null,
      paymentId: null,
      paymentSignature: null,
      nextBillingDate: null,
      renewalLogs: [],
    });

    await user.save();

  
    res.status(200).json({
      message: "Subscription created",
      subscriptionId: subscription.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("❌ Subscription creation failed:", err);
    res.status(500).json({
      message: "Failed to create subscription",
      error: err.message || "Unknown error",
    });
  }
};



export const getAllMyOohSubscriptions = async (req,res)=>{
try {
  const userId = req.user.id;



  const user = await User.findById(userId)
      .select("oohSubscriptions") 
      .populate([
        {
          path: "oohSubscriptions.oohServiceId",
          model: "OOHService",
          select: "title thumbnail vendorName slug", 
        },
        {
          path: "oohSubscriptions.packageId",
          model: "Package",
          select: "title price billingCycle features",
        },
      ]);


       if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }


    res.json(user.oohSubscriptions)

    


} catch (error) {
   console.error("Error fetching OOH subscriptions:", error.message);
    res.status(500).send("Server Error");
}


}
















