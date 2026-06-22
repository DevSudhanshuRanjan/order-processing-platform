import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

import AppError from "../utils/AppError.js";

import {
  validateDeliveryLocation,
} from "./serviceAreaService.js";

const VALID_TRANSITIONS = {
  Pending: [
    "Preparing",
    "Cancelled",
  ],

  Preparing: [
    "Out For Delivery",
  ],

  "Out For Delivery": [
    "Delivered",
  ],

  Delivered: [],

  Cancelled: [],
};

export const placeOrder =
  async (
    userId,
    address,
    location
  ) => {
    await validateDeliveryLocation(
      location.latitude,
      location.longitude
    );

    const cart =
      await Cart.findOne({
        userId,
      }).populate({
        path: "items.productId",
      });

    if (
      !cart ||
      cart.items.length === 0
    ) {
      throw new AppError(
        "Cart Is Empty",
        400
      );
    }

    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {
      let subtotal = 0;

      const items = [];

      const vendorId =
        cart.items[0].productId.vendorId;

      for (const item of cart.items) {
        const product =
          await Product.findById(
            item.productId._id
          ).session(session);

        if (!product) {
          throw new AppError(
            "Product Not Found",
            404
          );
        }

        if (
          product.stock <
          item.quantity
        ) {
          throw new AppError(
            "Insufficient Stock",
            400
          );
        }

        subtotal +=
          product.price *
          item.quantity;

        items.push({
          productId:
            product._id,
          name:
            product.name,
          price:
            product.price,
          quantity:
            item.quantity,
        });
      }

      const deliveryFee = 40;
      const tax =
        subtotal * 0.05;

      const total =
        subtotal +
        deliveryFee +
        tax;

      const order =
        await Order.create(
          [
            {
              userId,
              vendorId,
              items,
              address,
              location,
              total,
              status:
                "Pending",
            },
          ],
          { session }
        );

      for (const item of cart.items) {
        await Product.findByIdAndUpdate(
          item.productId._id,
          {
            $inc: {
              stock:
                -item.quantity,
            },
          },
          {
            session,
          }
        );
      }

      cart.items = [];

      await cart.save({
        session,
      });

      await session.commitTransaction();

      return order[0];
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }
  };

export const getUserOrders =
  async (userId) => {
    return Order.find({
      userId,
    }).sort({
      createdAt: -1,
    });
  };

export const getVendorOrders =
  async (vendorId) => {
    return Order.find({
      vendorId,
    })
      .populate(
        "userId",
        "name email"
      )
      .sort({
        createdAt: -1,
      });
  };

export const getAdminOrders =
  async () => {
    return Order.find()
      .populate(
        "userId",
        "name email"
      )
      .populate(
        "vendorId",
        "name email"
      )
      .sort({
        createdAt: -1,
      });
  };

export const updateStatus =
  async (
    orderId,
    vendorId,
    status
  ) => {
    const order =
      await Order.findOne({
        _id: orderId,
        vendorId,
      });

    if (!order) {
      throw new AppError(
        "Order Not Found",
        404
      );
    }

    if (
      !VALID_TRANSITIONS[
        order.status
      ].includes(status)
    ) {
      throw new AppError(
        "Invalid Order Status",
        400
      );
    }

    order.status = status;

    await order.save();

    return order;
  };