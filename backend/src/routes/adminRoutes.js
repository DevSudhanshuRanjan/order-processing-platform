import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  dashboard,
  getUsers,
  blockUser,
  unblockUser,
  getVendors,
  blockVendor,
  unblockVendor,
  getOrders,
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/admin/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  dashboard
);

router.get(
  "/admin/users",
  authMiddleware,
  roleMiddleware("admin"),
  getUsers
);

router.patch(
  "/admin/users/:id/block",
  authMiddleware,
  roleMiddleware("admin"),
  blockUser
);

router.patch(
  "/admin/users/:id/unblock",
  authMiddleware,
  roleMiddleware("admin"),
  unblockUser
);

router.get(
  "/admin/vendors",
  authMiddleware,
  roleMiddleware("admin"),
  getVendors
);

router.patch(
  "/admin/vendors/:id/block",
  authMiddleware,
  roleMiddleware("admin"),
  blockVendor
);

router.patch(
  "/admin/vendors/:id/unblock",
  authMiddleware,
  roleMiddleware("admin"),
  unblockVendor
);

router.get(
  "/admin/orders",
  authMiddleware,
  roleMiddleware("admin"),
  getOrders
);

export default router;