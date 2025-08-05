import express from "express";

import { checkAuth, forgotPassword, getUserById, googleAuth, loginUser, logoutUser, registerUser, resetPassword } from "../controllers/user.controller.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser)
router.post("/google",googleAuth); 
router.get("/check", checkAuth);    
router.post("/logout", logoutUser);
router.post("/forgot-password",  forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get('/user/:id', protect, getUserById);





export default router;
