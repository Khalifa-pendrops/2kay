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


router.post("/", authorize(UserRole.BILL_OWNER, UserRole.MERCHANT), create); //here ⚠️⚠️⚠️

router.get("/my-bills", authorize(UserRole.MERCHANT), getMyBills); //here ⚠️⚠️⚠️


router.patch("/:billId/status", authorize(UserRole.MERCHANT), updateStatus); //here ⚠️⚠️⚠️

export default router;
