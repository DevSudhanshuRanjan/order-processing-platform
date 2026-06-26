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

export default router;
