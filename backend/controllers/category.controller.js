import Category from "../models/category.model.js";

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

export const getCategoryByid = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      res.status(401).json({ message: "category not found" });
    }


    res.status(200).json(category)

    
  } catch (error) {
    res.status(500).json({ message: "error fetching category" });
  }
};
