import { Router } from "express";
// import {
//   initializeSponsorPayment,
//   verifyPayment,
//   processDisbursement,
// } from "../controllers/payment.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../interfaces/user.interfaces";

const router = Router();

// Sponsor initiates payment
router.post(
  "/:bundleId/initialize",
  authenticate,
  authorize(UserRole.BILL_SPONSOR),
  // initializeSponsorPayment
);

// Paystack callback for payment verification
// router.get("/verify", verifyPayment);

// Expense manager processes disbursement
router.post(
  "/:bundleId/disburse",
  authenticate,
  authorize(UserRole.EXPENSE_MANAGER),
  // processDisbursement
);

export default router;
