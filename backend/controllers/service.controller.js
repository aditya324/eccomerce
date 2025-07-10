import Category from "../models/category.model.js";
import Service from "../models/service.model.js";
import { razorpay } from "../utils/razorpay.js";

export const AddService = async (req, res) => {
  const {
    title,
    slug,
    categoryId,
    vendorName,
    price,
    thumbnail,
    videoUrl,
    includes,
    description,
    packages,
    faqs,
    rating,
    isFeatured,
  } = req.body;

  if (!title || !slug || !categoryId) {
    return res.status(400).json({
      message: "Title, slug and categoryId are required.",
    });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const existingService = await Service.findOne({ slug });
    if (existingService) {
      return res.status(400).json({ message: "Slug already in use." });
    }

    const service = new Service({
      title,
      slug,
      categoryId,
      vendorName,
      price,
      thumbnail,
      videoUrl,
      includes,
      description,
      packages, // includes array of packages with their own planIds
      faqs,
      rating: rating ?? 0,
      isFeatured: isFeatured ?? false,
    });

    const created = await service.save();
    res.status(201).json(created);
  } catch (err) {
    console.error("Create service error:", err);
    res
      .status(500)
      .json({ message: "Failed to create service", error: err.message });
  }
};

export const getService = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findById(id).lean();

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    let descriptionPoints = [];

    if (typeof service.description === "string") {
      // Convert string to array
      descriptionPoints = service.description
        .split(".")
        .map((point) => point.trim())
        .filter(Boolean);
    } else if (Array.isArray(service.description)) {
      // Already an array
      descriptionPoints = service.description;
    }

    service.description = descriptionPoints;

    console.log("✅ Final Parsed Description Array:", service.description);

    return res.status(200).json(service);
  } catch (error) {
    console.error("❌ Error fetching service by ID:", error);
    return res.status(500).json({ message: "Error fetching the service" });
  }
};

export const getAllService = async (req, res) => {
  try {
    const service = await Service.find();

    if (service.length === 0) {
      res.status(401).json({ message: "no Services Found" });
    }

    res
      .status(200)
      .json({ message: "Service Fetched Successfully", service: service });
  } catch (error) {
    res.status(500).json({ message: "Service fetched Successfully" });
  }
};
export const searchServices = async (req, res) => {
  const { q } = req.query;

  console.log("query", q);

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const services = await Service.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: -1 })
      .select("title slug thumbnail price score")
      .lean();

    res.json({ service: services });
  } catch (err) {
    console.error("Search error:", err);
    res
      .status(500)
      .json({ message: "Failed to search services", error: err.message });
  }
};

export const updateService = async (req, res) => {
  const { id } = req.params;

  const {
    title,
    slug,
    categoryId,
    vendorName,
    price,
    thumbnail,
    videoUrl,
    includes,
    description,
    packages,
    faqs,
    rating,
    isFeatured,
  } = req.body;

  console.log(req.body);

  try {
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    if (slug && slug !== service.slug) {
      const slugExists = await Service.findOne({ slug });
      if (slugExists) {
        return res.status(400).json({ message: "Slug already in use." });
      }
    }

    // Update fields if provided
    if (title) service.title = title;
    if (slug) service.slug = slug;
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }
      service.categoryId = categoryId;
    }
    if (vendorName) service.vendorName = vendorName;
    if (price !== undefined) service.price = price;
    if (thumbnail) service.thumbnail = thumbnail;
    if (videoUrl) service.videoUrl = videoUrl;
    if (includes) service.includes = includes;
    if (description) service.description = description;
    if (packages) service.packages = packages;
    if (faqs) service.faqs = faqs;
    if (rating !== undefined) service.rating = rating;
    if (isFeatured !== undefined) service.isFeatured = isFeatured;

    const updated = await service.save();

    res
      .status(200)
      .json({ message: "Service updated successfully", service: updated });
  } catch (error) {
    console.error("Update service error:", error);
    res
      .status(500)
      .json({ message: "Failed to update service", error: error.message });
  }
};

export const getExceptService = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.find({ _id: { $ne: id } });

    res.status(200).json({ service });
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error });
  }
};

export const createServicePackagePlan = async (req, res) => {
  try {
    const { serviceId, pkgId } = req.params;

    console.log("serviceId:", req.params.serviceId);

    console.log("pkgId:", req.params.pkgId);

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const pkg = service.packages.id(pkgId);
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

    const period = "monthly" // "monthly", "yearly", etc.
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
