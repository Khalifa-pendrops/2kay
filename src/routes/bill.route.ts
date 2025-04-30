import { Router } from "express";
import {
  create,
  getMyBills,
  updateStatus,
} from "../controllers/bill.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../interfaces/user.interfaces";

const router = Router();

router.use(authenticate);

// Only bill owners and service providers can create bills
router.post(
  "/",
  authorize(UserRole.BILL_OWNER, UserRole.SERVICE_PROVIDER),
  create
);

// Service providers can see bills created for them
router.get("/my-bills", authorize(UserRole.SERVICE_PROVIDER), getMyBills);

// Update bill status (typically by service providers)
router.patch(
  "/:billId/status",
  authorize(UserRole.SERVICE_PROVIDER),
  updateStatus
);

export default router;
