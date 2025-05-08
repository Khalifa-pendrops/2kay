import { Router } from "express";
import authRoute from "./auth.route";
import billRoute from "./bill.route";
import paymentRoute from "./payment.route";
import webhookRoute from "./webhook.route";
import miscRoute from "./misc.route";
import serviceProviderRoute from "./serviceProvider.route";
import merchantRoute from "./merchantRoutes";
import billBundleRoutes from "./billBundle.route";

const router = Router();

router.use("/auths", authRoute);
router.use("/service-provider", serviceProviderRoute);
router.use("/bills", billRoute);
router.use("/bill-bundle", billBundleRoutes); //newest
router.use("/payment", paymentRoute);
router.use("/webhook", webhookRoute);
router.use("/misc", miscRoute);
router.use("/partner", merchantRoute);


export default router;
