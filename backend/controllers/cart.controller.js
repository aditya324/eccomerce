// controllers/cart.controller.js
import Cart from "../models/cart.model.js";
import Package from "../models/package.model.js";
import Service from "../models/service.model.js";

export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { itemId, itemType, months, price } = req.body;

  if (!itemId || !itemType || !months || !price) {
    return res.status(400).json({ message: "Missing fields." });
  }

  try {
    let cart = await Cart.findOne({ userId });

    const subtotal = price * months;

    const newItem = {
      itemId,
      itemType,
      months,
      price,
      subtotal,
    };

    if (!cart) {
      cart = new Cart({
        userId,
        items: [newItem],
        subtotal,
        total: subtotal,
      });
    } else {
      cart.items.push(newItem);
      cart.subtotal = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
      cart.total = cart.subtotal - (cart.discount || 0);
    }

    const saved = await cart.save();
    res.status(200).json(saved);
  } catch (err) {
    console.error("Cart add error:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.itemId",
      model: function (doc) {
        return doc.itemType;
      },
    });

    if (!cart) return res.status(404).json({ message: "Cart is empty" });

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching cart" });
  }
};
