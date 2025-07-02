import express from "express";

import {
  AddService,
  getAllService,
  getService,
} from "../controllers/service.controller.js";
import protect from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/addService", protect, isAdmin, AddService);
router.get("/getAllService", getAllService);
router.get("/:id", getService);

export default router;
