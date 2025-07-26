import OOHService from "../models/oohService.model.js";

export const AddOOHService = async (req, res) => {
  const {
    title,
    slug,
  
    category,
    description,
    thumbnail,
    videoUrl,
    city,
    subcategories,
    faqs,
    isFeatured,
  } = req.body;

  if (!title || !slug) {
    return res.status(400).json({
      message: "Title and slug are required.",
    });
  }

  try {
    const existingService = await OOHService.findOne({ slug });
    if (existingService) {
      return res.status(400).json({ message: "Slug already in use." });
    }

    const service = new OOHService({
      title,
      slug,
      category,
      city,
      description,
      thumbnail,
      videoUrl,
      city,
      subcategories, 
      faqs,
      isFeatured: isFeatured ?? false,
    });

    const created = await service.save();
    res.status(201).json(created);
  } catch (err) {
    console.error("Create OOH service error:", err);
    res
      .status(500)
      .json({ message: "Failed to create OOH service", error: err.message });
  }
};
export const GetAllOOHServices = async (req, res) => {
  try {
    const services = await OOHService.find();
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch OOH services", error: err.message });
  }
};


export const GetOOHServiceBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const service = await OOHService.findOne({ slug });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch service", error: err.message });
  }
};




export const filterOOHServices = async (req, res) => {
  try {
    const { city, subcategory } = req.query;

    const query = {};

    if (city) {
      query.city = city;
    }

    if (subcategory) {
      query["subcategories.name"] = subcategory;
    }

    const services = await OOHService.find(query);

    res.status(200).json(services);
  } catch (error) {
    console.error("Filter OOH services error:", error);
    res.status(500).json({ message: "Failed to filter services", error: error.message });
  }
};




