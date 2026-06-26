import { validationResult } from "express-validator";

import * as orderService from "../services/orderService.js";

export const placeOrder =
  async (req, res, next) => {
    try {
      const errors =
        validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message:
            errors.array()[0].msg,
        });
      }

      const order =
        await orderService.placeOrder(
          req.user.id,
          req.body.address,
          req.body.location,
          req.body.items
        );

      return res.status(200).json({
        success: true,
        orderId: order._id,
      });
    } catch (error) {
      next(error);
    }
  };

export const getUserOrders =
  async (req, res, next) => {
    try {
      const orders =
        await orderService.getUserOrders(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      next(error);
    }
  };

export const getVendorOrders =
  async (req, res, next) => {
    try {
      const orders =
        await orderService.getVendorOrders(
          req.user.id
        );

      return res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      next(error);
    }
  };

export const getAdminOrders =
  async (req, res, next) => {
    try {
      const orders =
        await orderService.getAdminOrders();

      return res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      next(error);
    }
  };

export const updateOrderStatus =
  async (req, res, next) => {
    try {
      const errors =
        validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message:
            errors.array()[0].msg,
        });
      }

      await orderService.updateStatus(
        req.params.id,
        req.user.id,
        req.body.status
      );

      return res.status(200).json({
        success: true,
        message:
          "Order Status Updated",
      });
    } catch (error) {
      next(error);
    }
  };