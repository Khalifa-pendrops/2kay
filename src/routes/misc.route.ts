import { Router } from "express";
import { otpRateLimiter } from "../middlewares/rateLimits.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { requestOTP, verifyOTP } from "../controllers/otp.controller";
// import {
//   sendSponsorLink,
//   resendSponsorLink,
//   validateSponsorLink,
// } from "../controllers/sponsorship.controller";
import {
  getNotifications,
  markAsRead,
} from "../controllers/notification.controller";

const router = Router();

// OTP Routes 
router.post("/otp/request", otpRateLimiter, requestOTP);
router.post("/otp/verify", verifyOTP);

// Sponsorship Routes
// router.post("/send", authenticate, sendSponsorLink);
// router.post("/resend", authenticate, resendSponsorLink);
// router.get("/validate/:token", validateSponsorLink);

// Notification Routes
router.get("/notifications", authenticate, getNotifications);
router.patch("/notifications/:id/read", authenticate, markAsRead);

export default router;
