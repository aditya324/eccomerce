import express from "express";

import { handleRazorpayWebhook } from "../controllers/webhook.controller.js";

const router = express.Router();



// router.get("/razorpay/webhook", (req, res) => {
//   console.log("✅ GET request to webhook URL received!");
//   res.status(200).send("Webhook route file is loaded correctly!");
// });

router.post("/", handleRazorpayWebhook);


export default router;
