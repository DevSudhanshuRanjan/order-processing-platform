import { validationResult } from "express-validator";

import {
  getAllAreas,
  createArea,
  updateArea,
  deleteArea,
} from "../services/serviceAreaService.js";

export const getServiceAreas = async (
  req,
  res,
  next,
) => {
  try {
    const areas = await getAllAreas();

    return res.status(200).json({
      success: true,
      areas,
    });
  } catch (error) {
    next(error);
  }
};

export const createServiceArea = async (
  req,
  res,
  next,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { name, polygon } = req.body;

    const area = await createArea(
      name,
      polygon,
    );

    return res.status(201).json({
      success: true,
      area,
    });
  } catch (error) {
    next(error);
  }
};

export const updateServiceArea = async (
  req,
  res,
  next,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { name, polygon } = req.body;

    const area = await updateArea(
      req.params.id,
      name,
      polygon,
    );

    return res.status(200).json({
      success: true,
      area,
    });
  } catch (error) {
    next(error);
  }
};

export const removeServiceArea = async (
  req,
  res,
  next,
) => {
  try {
    await deleteArea(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Service Area Deleted",
    });
  } catch (error) {
    next(error);
  }
};