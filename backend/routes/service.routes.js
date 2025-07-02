


import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { isAdmin } from "../middlewares/isAdmin.js"
import { AddService } from "../controllers/service.controller.js"



const router= express.Router()


router.post("/addService",protect,isAdmin, AddService)







export default router