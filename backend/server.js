import express from "express";

import next from "next";

import dotenv from "dotenv";

import cors from "cors";

import morgan from "morgan";

import cookieParser from "cookie-parser";

import fs from "fs";

import path from "path";

import cartRoutes from "./routes/cart.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import oohServiceRoutes from "./routes/oohService.routes.js";
import packageRoutes from "./routes/package.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import s3Routes from "./routes/s3Routes.js";
import serviceRoutes from "./routes/service.routes.js";
import subscriptionRoutes from "./routes/subscriptions.route.js";
import userRoutes from "./routes/user.routes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import connectDB from "./utils/db.js";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: "../frontend" });
const handle = nextApp.getRequestHandler();

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://eccomerce-frontend2.onrender.com",
  "https://eccomerce-ten-jet.vercel.app",
  "https://eccomerce-vuc3.onrender.com",
];

nextApp.prepare().then(() => {
  // Connect MongoDB
  connectDB();

  // Special webhook route BEFORE express.json()
  app.use("/razorpay/webhook", express.raw({ type: "application/json" }), webhookRoutes);

  // Middleware
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan("dev"));

  // ========== TRY/CATCH Wrapped Routes ==========

  try {
    app.use("/api/users", userRoutes);
    console.log("✅ /api/users route loaded");
  } catch (err) {
    console.error("❌ /api/users failed:", err.message);
  }

  try {
    app.use("/api/categories", categoryRoutes);
    console.log("✅ /api/categories route loaded");
  } catch (err) {
    console.error("❌ /api/categories failed:", err.message);
  }

  try {
    app.use("/api/service", serviceRoutes);
    console.log("✅ /api/service route loaded");
  } catch (err) {
    console.error("❌ /api/service failed:", err.message);
  }

  try {
    app.use("/api/cart", cartRoutes);
    console.log("✅ /api/cart route loaded");
  } catch (err) {
    console.error("❌ /api/cart failed:", err.message);
  }

  try {
    app.use("/api/package", packageRoutes);
    console.log("✅ /api/package route loaded");
  } catch (err) {
    console.error("❌ /api/package failed:", err.message);
  }

  try {
    app.use("/api/payments", paymentRoutes);
    console.log("✅ /api/payments route loaded");
  } catch (err) {
    console.error("❌ /api/payments failed:", err.message);
  }

  try {
    app.use("/api/subscription", subscriptionRoutes);
    console.log("✅ /api/subscription route loaded");
  } catch (err) {
    console.error("❌ /api/subscription failed:", err.message);
  }

  try {
    app.use("/api/wishlist", wishlistRoutes);
    console.log("✅ /api/wishlist route loaded");
  } catch (err) {
    console.error("❌ /api/wishlist failed:", err.message);
  }

  try {
    app.use("/api/s3", s3Routes);
    console.log("✅ /api/s3 route loaded");
  } catch (err) {
    console.error("❌ /api/s3 failed:", err.message);
  }

  try {
    app.use("/api/oohservices", oohServiceRoutes);
    console.log("✅ /api/oohservices route loaded");
  } catch (err) {
    console.error("❌ /api/oohservices failed:", err.message);
  }

  // Health check route
  app.get("/api", (req, res) => {
    res.send("✅ Backend API is running");
  });

  // Catch-all for Next.js frontend routes
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
