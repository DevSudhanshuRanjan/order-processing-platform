import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  getDashboard,
  getAnalytics,
} from "../controllers/vendorController.js";

const router = express.Router();

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