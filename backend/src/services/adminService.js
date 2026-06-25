import mongoose from "mongoose";

import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

import AppError from "../utils/AppError.js";

export const getDashboard = async () => {
  const [
    users,
    vendors,
    orders,
    pending,
    delivered,
    revenueData,
  ] = await Promise.all([
    User.countDocuments({
      role: "customer",
    }),

    User.countDocuments({
      role: "vendor",
    }),

    Order.countDocuments(),

    Order.countDocuments({
      status: "Pending",
    }),

    Order.countDocuments({
      status: "Delivered",
    }),

    Order.aggregate([
      {
        $match: {
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
    users,
    vendors,
    orders,
    pending,
    delivered,
    revenue:
      revenueData[0]?.revenue || 0,
  };
};

export const getUsers = async ({
  page,
  limit,
  search,
  role,
  status,
}) => {
  const query = {};

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (role) {
    query.role = role;
  }

  if (status) {
    query.status = status;
  }

  const skip =
    (page - 1) * limit;

  const [users, total] =
    await Promise.all([
      User.find(query)
        .select(
          "_id name email role status"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      User.countDocuments(query),
    ]);

  return {
    users,
    pagination: {
      page,
      totalPages: Math.ceil(
        total / limit
      ),
      total,
    },
  };
};

export const blockUser = async (
  userId
) => {
  const user =
    await User.findById(userId);

  if (!user) {
    throw new AppError(
      "User Not Found",
      404
    );
  }

  user.status = "blocked";

  await user.save();
};

export const unblockUser = async (
  userId
) => {
  const user =
    await User.findById(userId);

  if (!user) {
    throw new AppError(
      "User Not Found",
      404
    );
  }

  user.status = "active";

  await user.save();
};

export const getVendors = async (
  search
) => {
  const query = {
    role: "vendor",
  };

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const vendors =
    await User.find(query)
      .select(
        "_id name email status"
      )
      .sort({
        createdAt: -1,
      });

  const result =
    await Promise.all(
      vendors.map(
        async (vendor) => {
          const [
            products,
            orders,
          ] = await Promise.all([
            Product.countDocuments({
              vendorId:
                vendor._id,
              status: "active",
            }),

            Order.countDocuments({
              vendorId:
                vendor._id,
            }),
          ]);

          return {
            _id: vendor._id,
            name: vendor.name,
            email: vendor.email,
            status:
              vendor.status,
            products,
            orders,
          };
        }
      )
    );

  return result;
};

export const blockVendor =
  async (vendorId) => {
    const vendor =
      await User.findOne({
        _id: vendorId,
        role: "vendor",
      });

    if (!vendor) {
      throw new AppError(
        "Vendor Not Found",
        404
      );
    }

    vendor.status = "blocked";

    await vendor.save();
  };

export const unblockVendor =
  async (vendorId) => {
    const vendor =
      await User.findOne({
        _id: vendorId,
        role: "vendor",
      });

    if (!vendor) {
      throw new AppError(
        "Vendor Not Found",
        404
      );
    }

    vendor.status = "active";

    await vendor.save();
  };

export const getOrders = async ({
  page,
  limit,
  search,
  status,
}) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (
    search &&
    mongoose.Types.ObjectId.isValid(
      search
    )
  ) {
    query._id = search;
  } else if (search) {
    query.status = {
      $regex: search,
      $options: "i",
    };
  }

  const skip =
    (page - 1) * limit;

  const [orders, total] =
    await Promise.all([
      Order.find(query)
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
        })
        .skip(skip)
        .limit(limit),

      Order.countDocuments(query),
    ]);

  return {
    orders,
    pagination: {
      page,
      totalPages: Math.ceil(
        total / limit
      ),
      total,
    },
  };
};