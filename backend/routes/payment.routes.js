import express from "express";

import { verifySubscriptionPayment } from "../controllers/payment.controller.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/verify", protect, verifySubscriptionPayment)
export default router;