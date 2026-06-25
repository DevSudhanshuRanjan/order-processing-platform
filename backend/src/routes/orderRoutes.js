import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  placeOrder,
  getUserOrders,
  getVendorOrders,
  getAdminOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  placeOrderValidator,
  updateOrderStatusValidator,
} from "../validators/orderValidator.js";

const router = express.Router();

/*
CUSTOMER
*/

router.post(
  "/orders",
  authMiddleware,
  roleMiddleware("customer"),
  placeOrderValidator,
  placeOrder
);

router.get(
  "/orders",
  authMiddleware,
  roleMiddleware("customer"),
  getUserOrders
);

/*
VENDOR
*/

router.get(
  "/vendor/orders",
  authMiddleware,
  roleMiddleware("vendor"),
  getVendorOrders
);

router.patch(
  "/vendor/orders/:id/status",
  authMiddleware,
  roleMiddleware("vendor"),
  updateOrderStatusValidator,
  updateOrderStatus
);

/*
ADMIN
*/

router.get(
  "/admin/orders",
  authMiddleware,
  roleMiddleware("admin"),
  getAdminOrders
);

export default router;