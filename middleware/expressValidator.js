import { body, validationResult } from "express-validator";

export const validateSignIn = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const validateSignUp = [
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  // .matches(/[A-Z]/)
  // .withMessage("Password must contain at least one uppercase letter")
  // .matches(/[a-z]/)
  // .withMessage("Password must contain at least one lowercase letter")
  // .matches(/\d/)
  // .withMessage("Password must contain at least one digit")
  // .matches(/[@$!%*?&]/)
  // .withMessage("Password must contain at least one special character"),

  // body("confirmPassword").custom((value, { req }) => {
  //   if (value !== req.body.password) {
  //     throw new Error("Passwords do not match");
  //   }
  //   return true;
  // }),
  body("username").notEmpty().withMessage("Username is required"),
];

// Validation rules for creating a product
export const validateProduct = [
  body("name").notEmpty().withMessage("Product name is required").trim(),
  body("description").optional().trim(),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),
  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be an integer greater than or equal to 0"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId"),
  body("brand").optional().trim(),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),
  body("tags.*").optional().isString().withMessage("Each tag must be a string"),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean"),
  body("isNew").optional().isBoolean().withMessage("isNew must be a boolean"),
  body("isTrending")
    .optional()
    .isBoolean()
    .withMessage("isTrending must be a boolean"),
  body("averageRating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Average rating must be a number between 1 and 5"),
  body("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be a percentage between 0 and 100"),
  body("sku").optional().trim(),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
