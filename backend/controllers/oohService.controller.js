import OOHService from "../models/oohService.model.js";
import { razorpay } from "../utils/razorpay.js";

// Create a new OOH service
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

// Delete OOH service by ID
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

    console.log("OOH serviceId:", serviceId);
    console.log("OOH pkgId:", pkgId);

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

    const plan = await razorpay.plans.create({
      period,
      interval,
      item: {
        name,
        amount,
        currency: "INR",
        description: `${oohService.title} / ${pkg.title} — ${period} subscription`,
      },
    });

    pkg.planId = plan.id;
    await oohService.save();

    res.json({
      message: "Razorpay plan created for OOH service package",
      planId: plan.id,
      serviceId: oohService._id,
      pkgId: pkg._id,
    });
  } catch (err) {
    console.error("Error creating Razorpay plan for OOH service:", err);
    res.status(500).json({ message: "Failed to create Razorpay plan", error: err.message });
  }
};