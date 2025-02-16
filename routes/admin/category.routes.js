import { Router } from "express";
import verifyToken from "../../middleware/verifyToken.js";
import { checkRole } from "../../middleware/checkRole.js";
import { uploadFile } from "../../middleware/uploadFiles.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} from "../../controller/admin/category.controller.js";
import {
  validateCategory,
  handleValidationErrors,
} from "../../middleware/expressValidator.js";

const router = Router();

// Routes
router.get(
  "/all",
  verifyToken,
  checkRole("can_view_categories"),
  getAllCategories
);

router.get(
  "/categories/:id",
  verifyToken,
  checkRole("can_view_categories"),
  getCategoryById
);

router.post(
  "/create",
  verifyToken,
  checkRole("can_create_category"),
  validateCategory,
  handleValidationErrors,
  uploadFile.single("image"),

  createCategory
);

router.put(
  "/update/:id",
  verifyToken,
  checkRole("can_update_category"),
  validateCategory,
  handleValidationErrors,
  uploadFile.single("image"),

  updateCategory
);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRole("can_delete_category"),
  deleteCategory
);

export default router;
