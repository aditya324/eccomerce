import express from "express";

import { addToCart } from "../controllers/cart.controller.js";
import protect from "../middlewares/protect.js";

const router = express.Router();

router.post("/add", protect, addToCart);

export default router;