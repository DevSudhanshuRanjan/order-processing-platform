import {
  point,
  polygon,
  booleanPointInPolygon,
} from "@turf/turf";

import ServiceArea from "../models/ServiceArea.js";
import AppError from "../utils/AppError.js";

const isValidCoordinate = (coordinate) => {
  if (
    !Array.isArray(coordinate) ||
    coordinate.length !== 2
  ) {
    return false;
  }

  const [lng, lat] = coordinate;

  return (
    typeof lng === "number" &&
    typeof lat === "number" &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
};

const validatePolygon = (polygonData) => {
  if (
    !Array.isArray(polygonData) ||
    polygonData.length < 3
  ) {
    return false;
  }

  return polygonData.every(isValidCoordinate);
};

export const getAllAreas = async () => {
  return ServiceArea.find().sort({
    createdAt: -1,
  });
};

export const createArea = async (
  name,
  polygonData,
) => {
  if (!validatePolygon(polygonData)) {
    throw new AppError("Invalid Polygon", 400);
  }

  const area = await ServiceArea.create({
    name,
    polygon: polygonData,
  });

  return area;
};

export const updateArea = async (
  areaId,
  name,
  polygonData,
) => {
  if (!validatePolygon(polygonData)) {
    throw new AppError("Invalid Polygon", 400);
  }

  const area = await ServiceArea.findById(areaId);

  if (!area) {
    throw new AppError(
      "Service Area Not Found",
      404,
    );
  }

  area.name = name;
  area.polygon = polygonData;

  await area.save();

  return area;
};

export const deleteArea = async (areaId) => {
  const area = await ServiceArea.findById(areaId);

  if (!area) {
    throw new AppError(
      "Service Area Not Found",
      404,
    );
  }

  await area.deleteOne();
};

export const validateDeliveryLocation = async (
  latitude,
  longitude,
) => {
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    throw new AppError(
      "Invalid Coordinates",
      400,
    );
  }

  const areas = await ServiceArea.find();

  if (areas.length === 0) {
    throw new AppError(
      "Delivery Not Available In Your Area",
      400,
    );
  }

  const customerPoint = point([
    longitude,
    latitude,
  ]);

  for (const area of areas) {
    const coordinates = [...area.polygon];

    const first = coordinates[0];
    const last =
      coordinates[coordinates.length - 1];

    const isClosed =
      first[0] === last[0] &&
      first[1] === last[1];

    if (!isClosed) {
      coordinates.push(first);
    }

    const turfPolygon = polygon([
      coordinates,
    ]);

    const inside = booleanPointInPolygon(
      customerPoint,
      turfPolygon,
    );

    if (inside) {
      return {
        available: true,
        area,
      };
    }
  }

  throw new AppError(
    "Delivery Not Available In Your Area",
    400,
  );
};