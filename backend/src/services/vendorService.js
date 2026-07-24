import mongoose from "mongoose";

import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getDashboard = async (
  vendorId
) => {
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    revenueData,
  ] = await Promise.all([
    Product.countDocuments({
      vendorId,
      status: "active",
    }),

    Order.countDocuments({
      vendorId,
    }),

    Order.countDocuments({
      vendorId,
      status: "Pending",
    }),

    Order.countDocuments({
      vendorId,
      status: "Delivered",
    }),

    Order.aggregate([
      {
        $match: {
          vendorId:
            new mongoose.Types.ObjectId(
              vendorId
            ),
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$total",
          },
        },
      },
    ]),
  ]);

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    revenue:
      revenueData[0]?.revenue || 0,
  };
};

export const getAnalytics = async (
  vendorId
) => {
  const [
    revenueData,
    orders,
    pending,
    soldData,
  ] = await Promise.all([
    Order.aggregate([
      {
        $match: {
          vendorId:
            new mongoose.Types.ObjectId(
              vendorId
            ),
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$total",
          },
        },
      },
    ]),

    Order.countDocuments({
      vendorId,
    }),

    Order.countDocuments({
      vendorId,
      status: "Pending",
    }),

    Order.aggregate([
      {
        $match: {
          vendorId:
            new mongoose.Types.ObjectId(
              vendorId
            ),
          status: "Delivered",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: null,
          sold: {
            $sum:
              "$items.quantity",
          },
        },
      },
    ]),
  ]);

  return {
    revenue:
      revenueData[0]?.revenue || 0,

    orders,

    sold:
      soldData[0]?.sold || 0,

    pending,
  };
};

export const getAllVendorsWithTopProduct = async () => {
  const vendors = await User.find({
    role: "vendor",
    status: "active",
  }).select("_id name email");

  const vendorsWithProduct = await Promise.all(
    vendors.map(async (vendor) => {
      const topProduct = await Product.findOne({
        vendorId: vendor._id,
        status: "active",
      })
        .sort({ averageRating: -1, numberOfRatings: -1 })
        .select("name price image averageRating numberOfRatings")
        .lean();

      const totalProducts = await Product.countDocuments({
        vendorId: vendor._id,
        status: "active",
      });

      return {
        _id: vendor._id,
        name: vendor.name,
        totalProducts,
        topProduct: topProduct
          ? {
              _id: topProduct._id,
              name: topProduct.name,
              price: topProduct.price,
              image: topProduct.image,
              averageRating: topProduct.averageRating,
              numberOfRatings: topProduct.numberOfRatings,
            }
          : null,
      };
    })
  );

  return vendorsWithProduct.filter((v) => v.topProduct);
};