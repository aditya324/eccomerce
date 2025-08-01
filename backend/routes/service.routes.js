import express from "express";

import {
  AddService,
  createServicePackagePlan,
  deleteService,
  getAllService,
  getExceptService,
  getService,
  searchServices,
  updateService,
} from "../controllers/service.controller.js";
import { createServiceSubscription } from "../controllers/serviceSubscription.controller.js";
import protect from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.post("/addService", protect, isAdmin, AddService);

router.get("/getAllService", getAllService);

console.log("Loaded service routes with SEARCH first");
router.get("/search", searchServices);
router.get("/getAllExcept/:id", getExceptService);
router.post(
  "/:serviceId/packages/:pkgId/create-plan",
  protect,
  isAdmin,
  createServicePackagePlan
);
router.delete("/delete/:id",protect,isAdmin, deleteService)


router.post("/updateService/:id", protect, isAdmin, updateService);
router.get("/getServiceById/:id", getService);

router.post(
  "/:serviceId/packages/:pkgId/subscribe",
  protect,
  createServiceSubscription
);




export default router;
