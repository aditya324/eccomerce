import express from "express";

import { getMySubscriptions } from "../controllers/serviceSubscription.controller.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/mine", protect, getMySubscriptions);

export default router;