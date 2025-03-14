import { body, validationResult, check } from "express-validator";

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

export const validateAdmin = [
  body("first_name").notEmpty().withMessage("First Name is required"),
  body("last_name").notEmpty().withMessage("Last Name is required"),
  body("email").isEmail().withMessage("Valid Email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Validation rules for creating a product
export const validateTag = async (req, res, next) => {
  if (req.body.tags && typeof req.body.tags === "string") {
    try {
      req.body.tags = JSON.parse(req.body.tags);
    } catch (error) {
      return res.status(400).json({ message: "Invalid tags format" });
    }
  }
  next();
};
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

export const validateCategory = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .bail()
    .isString()
    .withMessage("Category name must be a string")
    .trim()
    .escape(),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .escape(),

  body("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Parent category must be a valid MongoDB ObjectId"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean")
    .toBoolean(),
];

export const validateReview = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),
  body("comment").optional().isString().withMessage("Comment must be a string"),
];

export const validatePurchase = [
  check("products")
    .isArray({ min: 1 })
    .withMessage("At least one product is required."),
  check("products.*.product").notEmpty().withMessage("Product ID is required."),
  check("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1."),
  check("paymentMethod")
    .isIn(["Chapa", "Santim_Pay"])
    .withMessage("Invalid payment method."),
  check("shippingAddress.fullName")
    .notEmpty()
    .withMessage("Shipping full name is required."),
  check("shippingAddress.addressLine1")
    .notEmpty()
    .withMessage("Shipping address line 1 is required."),
  check("shippingAddress.city").notEmpty().withMessage("City is required."),
  check("shippingAddress.state").notEmpty().withMessage("State is required."),
  check("shippingAddress.postalCode")
    .notEmpty()
    .withMessage("Postal code is required."),
  check("shippingAddress.country")
    .notEmpty()
    .withMessage("Country is required."),
  check("shippingAddress.phone")
    .isMobilePhone()
    .withMessage("Valid phone number is required."),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  console.log("validation error: ");
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
