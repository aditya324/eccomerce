import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import morgan from "morgan";

import fs from "fs";

import path from "path";

import cookieParser from "cookie-parser";

import cartRoutes from "./routes/cart.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import oohServiceRoutes from "./routes/oohService.routes.js";
import packageRoutes from "./routes/package.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import s3Routes from "./routes/s3Routes.js";
import serviceRoutes from "./routes/service.routes.js";
import userRoutes from "./routes/user.routes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import connectDB from "./utils/db.js";
dotenv.config();
import subscriptionRoutes from "./routes/subscriptions.route.js"
const app = express();
const PORT = process.env.PORT || 4000;


connectDB();



app.use("/razorpay/webhook", express.raw({ type: "application/json" }), webhookRoutes);


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://eccomerce-frontend2.onrender.com",
  "https://eccomerce-ten-jet.vercel.app",
  "https://eccomerce-vuc3.onrender.com/"

];

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
app.use(cookieParser());
app.use(express.json());


if (process.env.NODE_ENV === "production") {

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
app.get("/api/", (req, res) => {
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
app.use("/api/wishlist",wishlistRoutes)
app.use('/api/s3', s3Routes); 
app.use("/api/oohservices", oohServiceRoutes);


app.use((req, res, next) => {
  console.log("❌ No route matched:", req.method, req.originalUrl);
  res.status(404).send("Not Found");
});



if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  // Make the 'out' folder accessible as a static folder
  app.use(express.static(path.join(__dirname, "/frontend/out")));

  // Any request that is not an API route will be sent the index.html file
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "out", "index.html"))
  );
} else {
  // In development, just have a simple root route
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
