import express from "express";

import { createCategory, getAllCategory, getCategoryById, getCategoryBySlug } from "../controllers/category.controller.js";
import protect from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router=express.Router()



router.post("/addCategory",protect,isAdmin,createCategory)
router.get("/getAllCategory",getAllCategory)
router.get("/:id",getCategoryById)
router.get("/slug/:slug", getCategoryBySlug);




export default router