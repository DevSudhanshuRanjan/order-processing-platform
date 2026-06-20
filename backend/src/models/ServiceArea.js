import mongoose from "mongoose";

const serviceAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    polygon: {
      type: [[Number]],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

serviceAreaSchema.index({ name: 1 });
serviceAreaSchema.index({ createdAt: -1 });

const ServiceArea = mongoose.model(
  "ServiceArea",
  serviceAreaSchema,
);

export default ServiceArea;