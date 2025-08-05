import express from "express";

import { createCategory, deleteCategory, getAllCategory, getCategoryById, getCategoryBySlug, updateCategory } from "../controllers/category.controller.js";
import protect from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router=express.Router()



router.post("/addCategory",protect,isAdmin,createCategory)
router.get("/getAllCategory",getAllCategory)
router.get("/slug/:slug", getCategoryBySlug);  
router.get("/:id", getCategoryById);

router.delete('/delete/:id', deleteCategory)

router.put('/update/:id', updateCategory)


export default router