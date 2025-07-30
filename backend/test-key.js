import dotenv from "dotenv";
dotenv.config()
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log("--- .env Test ---");
if (keySecret) {
  console.log("Secret loaded successfully.");
  console.log(`Value starts with: '${keySecret.substring(0, 4)}', ends with: '${keySecret.slice(-4)}'`);
} else {
  console.log("!!! FAILED to load RAZORPAY_KEY_SECRET from .env file !!!");
}
console.log("-----------------");