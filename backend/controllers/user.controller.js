// controllers/userController.js
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import dotenv from "dotenv";

import User from "../models/user.model.js";
import { client } from "../utils/googleClient.js";
dotenv.config();


import generateToken from "../utils/genrerateToken.js"


export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });


    const token = generateToken(user._id);


    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

 
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   
    const token = generateToken(user._id);

 
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

 
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
      message: "User logged in successfully",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};




export const googleAuth = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: "Google ID token is required" });
  }

  try {
    // 1. Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar } = payload;

    // 2. Find or create the user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, avatar });
    }

    // 3. Generate your JWT
    const token = generateToken(user._id);

    // 4. (Optional) set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // 5. Return user + token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token,
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ message: "Google token verification failed" });
  }
};



// backend/controllers/auth.controller.js
export const checkAuth = (req, res) => {
  try {
    const token = req.cookies.jwt;
    console.log("token check", token);

    if (!token) {
      return res.status(401).json({ isLoggedIn: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded payload", decoded);

    return res.status(200).json({ isLoggedIn: true });
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ isLoggedIn: false });
  }
};
