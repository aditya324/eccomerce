import express from "express";

import {createOOHService, createOohServicePackagePlan, createOOHServicePackagePlan, getAllMyOohSubscriptions, getAllOOHServices, getOOHServiceById, getOOHServiceBySlug, getPackagesBySubType, subscribeToOohService } from "../controllers/oohService.controller.js";
import protect from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";


const router = express.Router();

router.post("/add",protect,isAdmin,createOOHService);
router.get("/", getAllOOHServices);

router.get("/getOOHById/:id", getOOHServiceById);
router.get("/slug/:slug", getOOHServiceBySlug);
router.get("/:id/packages", getPackagesBySubType);
router.post("/:serviceId/packages/:pkgId/create-plan", createOOHServicePackagePlan);
router.post(
  "/:oohserviceId/packages/:pkgId/subscribe",
  protect,
  subscribeToOohService
);


router.get("/myoohpackage",protect,getAllMyOohSubscriptions)

export default router;
