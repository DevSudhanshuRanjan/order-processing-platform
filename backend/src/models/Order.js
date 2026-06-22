import mongoose from "mongoose";

const orderItemSchema =
  new mongoose.Schema(
    {
      productId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },
    },
    { _id: false }
  );

const orderSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      vendorId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      items: [orderItemSchema],

      address: {
        fullName: {
          type: String,
          required: true,
        },

        phone: {
          type: String,
          required: true,
        },

        house: {
          type: String,
          required: true,
        },

        street: {
          type: String,
          required: true,
        },

        city: {
          type: String,
          required: true,
        },

        state: {
          type: String,
          required: true,
        },

        pincode: {
          type: String,
          required: true,
        },
      },

      location: {
        latitude: {
          type: Number,
          required: true,
        },

        longitude: {
          type: Number,
          required: true,
        },
      },

      total: {
        type: Number,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Preparing",
          "Out For Delivery",
          "Delivered",
          "Cancelled",
        ],
        default: "Pending",
      },
    },
    {
      timestamps: true,
    }
  );

orderSchema.index({
  userId: 1,
});

orderSchema.index({
  vendorId: 1,
  status: 1,
  createdAt: -1,
});

export default mongoose.model(
  "Order",
  orderSchema
);