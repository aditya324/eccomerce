import express from "express";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/",protect, getWishlist);
router.post("/add/:serviceId",protect, addToWishlist);
router.delete("/remove/:serviceId",protect, removeFromWishlist);

export default router;
