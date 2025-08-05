import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import morgan from "morgan";

import fs from "fs";

import path from "path";

import cookieParser from "cookie-parser";

import webhookRoutes from "./routes/webhookRoutes.js";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.routes.js"
import categoryRoutes from  "./routes/category.routes.js"
import serviceRoutes from "./routes/service.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import packageRoutes from "./routes/package.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import wishlistRoutes from "./routes/wishlist.routes.js"
import s3Routes from "./routes/s3Routes.js"
import oohServiceRoutes from "./routes/oohService.routes.js"
import subscriptionRoutes from "./routes/subscriptions.route.js"



dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;


// ===================================================================================
// STEP 1: RUN THE FILE EXACTLY LIKE THIS.
// The server should start successfully. If it crashes even with everything
// disabled, the problem is likely a corrupted node_modules folder.
// In that case, delete node_modules and package-lock.json and run `npm install`.
// ===================================================================================


// ===================================================================================
// STEP 2: UNCOMMENT THE BLOCKS BELOW ONE BY ONE.
// After uncommenting a block, save the file and see if the server still starts.
// ===================================================================================



console.log("Connecting to DB...");
connectDB();




console.log("Initializing core middleware...");
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://eccomerce-frontend2.onrender.com",
  "https://eccomerce-ten-jet.vercel.app",
  "https://eccomerce-vuc3.onrender.com"
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
app.use(morgan("dev"));




// --- Block C: Webhook Route (do this one first when adding routes) ---
// Note: This route is special and needs to be before express.json()
app.use("/razorpay/webhook", express.raw({ type: "application/json" }), webhookRoutes);


// ===================================================================================
// STEP 4: ADD YOUR ROUTES BACK ONE BY ONE. THIS WILL FIND THE CRASH.
// For each route, you must uncomment BOTH the `import` at the top of the file
// AND the `app.use()` line below.
// ===================================================================================

// --- Example: Testing userRoutes ---
// 1. Uncomment `import userRoutes from "./routes/user.routes.js";` at the top.
// 2. Uncomment the line below.
// 3. Save. Does it crash? If yes, the error is in `user.routes.js`.
// 4. If it doesn't crash, `user.routes.js` is safe. Comment these two lines out again and try the next file (e.g., categoryRoutes).

// console.log("Initializing API routes...");

console.log("useroute")
app.use("/api/users", userRoutes);
console.log("catroute")
app.use("/api/categories", categoryRoutes);
console.log("serroute")
app.use("/api/service", serviceRoutes);
console.log("carroute")
app.use("/api/cart", cartRoutes);
console.log("packroute")
app.use("/api/package", packageRoutes);
console.log("payroute")
app.use("/api/payments", paymentRoutes);
console.log("subroute")
app.use("/api/subscription",subscriptionRoutes)
console.log("wisroute")
app.use("/api/wishlist",wishlistRoutes)
console.log("s3route")
app.use('/api/s3', s3Routes);
console.log("oohroute")
app.use("/api/oohservices", oohServiceRoutes);


console.log("out of the order")


// A simple route to prove the server is running
app.get("/", (req, res) => {
  res.send("✅ Server is running. Ready to start debugging.");
});

 app.all("*", (req, res) => {
    return handle(req, res);
  });


// The final step: Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});