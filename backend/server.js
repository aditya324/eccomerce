import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import morgan from "morgan";

import fs from "fs";

import path from "path";

import cookieParser from "cookie-parser";

import cartRoutes from "./routes/cart.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import packageRoutes from "./routes/package.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectDB from "./utils/db.js";
dotenv.config();
import subscriptionRoutes from "./routes/subscriptions.route.js"
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"], // your frontend port
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Logging setup
if (process.env.NODE_ENV === "production") {
  // Create logs directory if not exists
  const logDirectory = path.join("logs");
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }

  const accessLogStream = fs.createWriteStream(
    path.join(logDirectory, "access.log"),
    { flags: "a" }
  );

  // Use Apache-style logs for production
  app.use(morgan("combined", { stream: accessLogStream }));
} else {
  // Use dev-style logs in development
  app.use(morgan("dev"));

  // Optional: Use custom format too
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );
}

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

app.get("/api/test-cookies", (req, res) => {
  console.log("Cookies:", req.cookies);
  res.json({ cookies: req.cookies });
});

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/subscription",subscriptionRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
