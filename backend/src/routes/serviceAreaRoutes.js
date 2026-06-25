import express from "express";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

import {
  getServiceAreas,
  createServiceArea,
  updateServiceArea,
  removeServiceArea,
} from "../controllers/serviceAreaController.js";

import { serviceAreaValidation } from "../validators/serviceAreaValidator.js";

const router = express.Router();

router.get("/", getServiceAreas);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  serviceAreaValidation,
  createServiceArea,
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  serviceAreaValidation,
  updateServiceArea,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  removeServiceArea,
);

// for testing purposes only
import { validateDeliveryLocation } from "../services/serviceAreaService.js";

router.post("/test-validation", async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    const result = await validateDeliveryLocation(latitude, longitude);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
