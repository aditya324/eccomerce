import express from "express";

import { checkAuth, getUserById, googleAuth, loginUser, registerUser } from "../controllers/user.controller.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser)
router.post("/google",googleAuth); 
router.get("/check", checkAuth);    
router.get('/:id', protect, getUserById);

export default router;  
