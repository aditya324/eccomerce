import express from "express";

import { verifyOohSubscriptionPayment, verifyPackagePayment, verifySubscriptionPayment } from "../controllers/payment.controller.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/verify", protect, verifySubscriptionPayment)
router.post("/package/verify", protect, verifyPackagePayment);


router.post("/verify/verify-ooh",verifyOohSubscriptionPayment)
export default router;