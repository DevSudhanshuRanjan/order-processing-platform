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

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.get(
  "/admin/dashboard",
  dashboard
);

router.get(
  "/admin/users",
  getUsers
);

router.patch(
  "/admin/users/:id/block",
  blockUser
);

router.patch(
  "/admin/users/:id/unblock",
  unblockUser
);

router.get(
  "/admin/vendors",
  getVendors
);

router.patch(
  "/admin/vendors/:id/block",
  blockVendor
);

router.patch(
  "/admin/vendors/:id/unblock",
  unblockVendor
);

router.get(
  "/admin/orders",
  getOrders
);

export default router;