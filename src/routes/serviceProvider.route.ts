import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { UserRole } from "../interfaces/user.interfaces";
import * as serviceProviderController from "../controllers/serviceProvider.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.SERVICE_PROVIDER, UserRole.EXPENSE_MANAGER),
  serviceProviderController.createServiceProvider
);

router.get("/", authenticate, serviceProviderController.getServiceProviders);

export default router;
