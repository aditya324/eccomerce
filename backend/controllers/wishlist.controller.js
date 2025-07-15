
import Service from "../models/service.model.js";
import User from "../models/user.model.js";


export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist", "title slug thumbnail price");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};





export const addToWishlist = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const user = await User.findById(req.user._id);
    if (user.wishlist.includes(serviceId)) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(serviceId);
    await user.save();
    res.json({ message: "Added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};



export const removeFromWishlist = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== serviceId);
    await user.save();
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};