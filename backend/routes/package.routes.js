import express from "express";

import {  createPackage, getAllPackages, getPackageById } from "../controllers/package.controller.js";
import protect from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";


const router = express.Router();

router.post("/add", protect, isAdmin, createPackage); 
router.get("/getAllPackages",getAllPackages)
router.get("/:id", getPackageById);


export default router;
