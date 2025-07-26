import express from "express";

import { AddOOHService, filterOOHServices, GetAllOOHServices, GetOOHServiceBySlug } from "../controllers/oohService.controller.js";
import protect from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";


const router = express.Router();

router.post("/add",protect,isAdmin,AddOOHService);
router.get("/", GetAllOOHServices);
router.get("/filter", filterOOHServices);
router.get("/:slug", GetOOHServiceBySlug);

export default router;
