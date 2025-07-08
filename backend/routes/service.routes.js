import express from "express";

import {
  AddService,
  
  getAllService,
  getService,
  searchServices,
  updateService,
} from "../controllers/service.controller.js";
import protect from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();


router.post("/addService", protect, isAdmin, AddService);


router.get("/getAllService", getAllService);

console.log('Loaded service routes with SEARCH first');
router.get("/search", searchServices);

router.post("/updateService/:id",protect,isAdmin, updateService);
router.get("/getServiceById/:id", getService);

export default router;
