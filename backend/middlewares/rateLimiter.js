// middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts. Try again after 15 minutes." },
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: "Too many registrations. Try again in an hour." },
});

export const checkoutLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
  message: { message: "Too many payment attempts. Try again later." },
});
