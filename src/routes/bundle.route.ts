import { Router } from "express";
import {
  create,
  getByLink,
  contribute,
  process,
  getMyBundles,
} from "../controllers/bundle.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../interfaces/user.interfaces";

const router = Router();

router.use(authenticate);

// Bill owners can create bundles
router.post("/", authorize(UserRole.BILL_OWNER), create);

// Anyone can view a bundle by its unique link (no auth required for this route)
router.get("/:uniqueLink", getByLink);

// Sponsors can contribute to bundles
router.post(
  "/:bundleId/contribute",
  authorize(UserRole.BILL_SPONSOR),
  contribute
);

// Expense managers can process fully funded bundles
router.post("/:bundleId/process", authorize(UserRole.EXPENSE_MANAGER), process);

// Users can view their bundles (as owner or sponsor)
router.get("/", getMyBundles);

export default router;
