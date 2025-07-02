import express from "express";

import { createCategory, getAllCategory, getCategoryByid } from "../controllers/category.controller.js";
import protect from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router=express.Router()



router.post("/addCategory",protect,isAdmin,createCategory)
router.get("/getAllCategory",getAllCategory)
router.get("/:id",getCategoryByid)



export default router