import express from "express";

import {
  AddService,
  deleteService,
  getAllService,
  getService,
  searchServices,
} from "../controllers/service.controller.js";
import protect from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();


router.post("/addService", protect, isAdmin, AddService);


router.get("/getAllService", getAllService);

console.log('Loaded service routes with SEARCH first');
router.get("/search", searchServices);
router.delete("/deleteService/:id", protect, isAdmin, deleteService);

router.get("/:id", getService);

export default router;
