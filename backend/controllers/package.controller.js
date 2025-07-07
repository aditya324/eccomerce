import mongoose from "mongoose";

import Category from "../models/category.model.js";
import Package from "../models/package.model.js";
import Service from "../models/service.model.js";

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
      planId, // ✅ store Razorpay planId
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

