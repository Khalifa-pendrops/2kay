import { Router } from "express";
import {
  createBundle,
  getBundleWithLink,
  shareBundle,
} from "../controllers/billBundle.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { verifyBundleLink } from "../middlewares/verifyBundleLink";
import { body } from "express-validator";

const router = Router();

router.post(
  "/create",
  authenticate,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("bills")
      .isArray({ min: 1 })
      .withMessage("You must have least one bill"),
    body("bills.*").isMongoId().withMessage("Invalid bill ID"),
    body("description").optional().isString(),
  ],
  createBundle
);

router.get(
  "/:uniqueLink",
  verifyBundleLink,
  (req, res) => {
    res.json({
      success: true,
      bundle: req.bundle,
    });
  },
  getBundleWithLink
);

router.post(
  "/:id/share",
  authenticate,
  [body("sponsorEmail").isEmail().normalizeEmail()],
  verifyBundleLink,    // watch here for error ⚠️
  shareBundle
);

export default router;
