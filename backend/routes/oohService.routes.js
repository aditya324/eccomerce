import express from "express";

import { AddOOHService, GetAllOOHServices, GetOOHServiceBySlug } from "../controllers/oohservice.controller";




const router = express.Router();

router.post("/add", AddOOHService);
router.get("/", GetAllOOHServices);
router.get("/:slug", GetOOHServiceBySlug);

export default router;
