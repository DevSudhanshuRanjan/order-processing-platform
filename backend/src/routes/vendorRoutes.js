import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  getDashboard,
  getAnalytics,
  getVendorsWithTopProduct,
} from "../controllers/vendorController.js";

const router = express.Router();

// Public - get all vendors with their top-rated product
router.get(
  "/vendors",
  getVendorsWithTopProduct
);

router.get(
  "/vendor/dashboard",
  authMiddleware,
  roleMiddleware("vendor"),
  getDashboard
);

router.get(
  "/vendor/analytics",
  authMiddleware,
  roleMiddleware("vendor"),
  getAnalytics
);

export default router;
