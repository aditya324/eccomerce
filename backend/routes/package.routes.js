import express from "express";

import {
  createPackage,
  getAllPackages,
  getPacakgeByCategory,
  getPackageById,
  createStandalonePackagePlan,
  subscribeToPackage,
  getMyPurchasedPackages,
} from "../controllers/package.controller.js";
import protect from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// POST routes can stay as they are
router.post("/add", protect, isAdmin, createPackage);
router.post("/create-plan/:packageId", createStandalonePackagePlan);
router.post("/:packageId/subscribe", protect, subscribeToPackage);


// --- Reorder your GET routes ---

// Specific routes first
router.get("/getAllPackages", getAllPackages);
router.get("/my-package", protect, getMyPurchasedPackages); // MOVED UP

// Dynamic routes with specific prefixes
router.get("/slug/:slug", getPacakgeByCategory);

// The most general dynamic route is last
router.get("/:id", getPackageById); // MOVED DOWN


export default router;