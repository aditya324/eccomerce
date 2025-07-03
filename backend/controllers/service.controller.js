import Category from "../models/category.model.js";
import Service from "../models/service.model.js";

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
    res.status(500).json({ message: "Failed to create service", error: err.message });
  }
};

export const getService = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findById(id);

    if (!service) {
      res.status(401).json({ message: "the service is not found" });
    }


  

    const descriptionPoints = service.description
      .split(".")
      .map((point) => point.trim())
      .filter(Boolean);

    

    service.description = descriptionPoints;

    res.status(200).json(service);

  } catch (error) {
    res.status(500).json({ message: "error fetching the service" });
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
