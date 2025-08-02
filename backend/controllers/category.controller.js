import Category from "../models/category.model.js";
import Service from "../models/service.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, slug, icon } = req.body;
    const exists = await Category.findOne({ slug });
    if (exists) return res.status(400).json({ message: "Slug already in use" });

    const category = new Category({ name, slug, icon });
    const created = await category.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories available" });
    }

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the category
    const category = await Category.findById(id).select("name slug icon");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 2. (Optional) fetch services in this category
    const services = await Service.find({ categoryId: id })
      .select("title slug thumbnail price  isFeatured rating price")
      .sort({ title: 1 });

    // 3. Return combined result
    return res.status(200).json({ category, services });
  } catch (err) {
    console.error("Fetch category by ID error:", err);
    return res
      .status(500)
      .json({ message: "Error fetching category by ID", error: err.message });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("slug", slug);

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const services = await Service.find({ categoryId: category._id })
      .select("title slug thumbnail price isFeatured rating")  // ← added price
      .sort({ title: 1 });

      console.log("service", services)

    return res.json({ services:services });
  } catch (err) {
    console.error("Fetch category error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch category info", error: err.message });
  }
};



export const deleteCategory = async (req,res)=>{
  try {

    const {id}= req.params

    if(!id){
      res.json("id is required ")
    }



    const category= await Category.findByIdAndDelete(id)


    res.status(200).json("category deleted successfully" , category)

    
  } catch (error) {
    console.log("error deleting",error)
  }
}



export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

