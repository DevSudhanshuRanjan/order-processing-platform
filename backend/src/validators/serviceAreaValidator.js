import { body } from "express-validator";

export const serviceAreaValidation = [
  body("name")
    .trim()
    .isLength({
      min: 3,
      max: 50,
    })
    .withMessage(
      "Name Must Be Between 3 And 50 Characters",
    ),

  body("polygon")
    .isArray({
      min: 3,
    })
    .withMessage(
      "Polygon Must Contain At Least 3 Coordinates",
    ),
];