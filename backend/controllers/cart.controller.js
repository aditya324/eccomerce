// controllers/cart.controller.js
import Cart from "../models/cart.model.js";
import Package from "../models/package.model.js";
import Service from "../models/service.model.js";

export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { itemId, itemType, months } = req.body;

  if (!itemId || !itemType || !months) {
    return res.status(400).json({ message: "itemId, itemType, and months are required" });
  }

  try {
    const Model = itemType === "Service" ? Service : Package;
    const item = await Model.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: `${itemType} not found` });
    }

    const price = item.price;
    const subtotalItem = price * months;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{
          itemId,
          itemType,
          months,
          price,
          subtotal: subtotalItem
        }],
        subtotal: subtotalItem,
        total: subtotalItem
      });
    } else {
      const index = cart.items.findIndex(
        (i) => i.itemId.toString() === itemId && i.itemType === itemType
      );

      if (index > -1) {
        cart.items[index].months = months;
        cart.items[index].subtotal = subtotalItem;
      } else {
        cart.items.push({ itemId, itemType, months, price, subtotal: subtotalItem });
      }

      cart.subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
      cart.total = cart.subtotal - (cart.discount || 0);
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to add to cart" });
  }
};
