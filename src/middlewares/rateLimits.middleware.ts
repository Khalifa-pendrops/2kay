import rateLimit from "express-rate-limit";

export const otpRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 OTP requests per hour
  message: "Too many OTP requests. Please try again later.",
});
