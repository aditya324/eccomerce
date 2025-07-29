// controllers/userController.js
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import dotenv from "dotenv";

import { randomBytes, createHmac } from "crypto";

import nodemailer from "nodemailer";

import Service from "../models/service.model.js";
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
export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    console.log("token check", token);

    if (!token) {
      return res.status(401).json({ isLoggedIn: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
 
    const user = await User.findById(decoded?.id).select('-password'); // Exclude password from response

    
    if (!user) {
        return res.status(404).json({ isLoggedIn: false, error: "User not found" });
    }

    return res.status(200).json({ isLoggedIn: true, user: user });

  } catch (err) {
    // This block is likely being triggered by an expired token or mismatched secret
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ isLoggedIn: false, error: err.message });
  }
};


export const logoutUser = (req, res) => {

  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
};



export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account with that email" });


    const token = randomBytes(20).toString("hex");          
    user.resetPasswordToken   = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

   
    const transporter = nodemailer.createTransport({
      host:   process.env.GODADDY_SMTP_HOST,
      port:   Number(process.env.GODADDY_SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.GODADDY_SMTP_USER,
        pass: process.env.GODADDY_SMTP_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      await transporter.sendMail({
      from:    process.env.SMTP_FROM,
      to:      user.email,
      subject: "🔒 Reset Your Password",
      text:    `Reset link: ${resetUrl}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;padding:20px;">
          <h1 style="color:#444;">Password Reset Requested</h1>
          <p>Hi ${user.name || ""},</p>
          <p>You recently requested to reset your password. Click the button below to choose a new one:</p>
          <p style="text-align:center;margin:30px 0;">
            <a
              href="${resetUrl}"
              style="
                background-color:#D68910;
                color:#fff;
                padding:12px 24px;
                text-decoration:none;
                border-radius:4px;
                font-size:16px;
              "
            >Reset Password</a>
          </p>
          
          <hr style="border:none;border-top:1px solid #eee;margin:30px 0;" />
          <p style="font-size:12px;color:#888;">
            If you did not request this, you can safely ignore this email. This link expires in 1 hour.
          </p>
        </div>
      `,
    });

    res.json({ message: `Reset email sent to ${user.email}` });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const resetPassword = async (req, res) => {
  const { token }         = req.params;
  const { password }      = req.body;
  try {

    const user = await User.findOne({
      resetPasswordToken:   token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }


    user.password             = await bcrypt.hash(password, 10);
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
}




