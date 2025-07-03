import express from "express";

import { addToCart, getCart } from "../controllers/cart.controller.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);

export default router;