import { Router } from "express";
import verifyToken from "../../middleware/verifyToken.js";
import { checkRole } from "../../middleware/checkRole.js";
import { uploadProducts } from "../../middleware/uploadProductFiles.js";
import {
  validateProduct,
  handleValidationErrors,
} from "../../middleware/expressValidator.js";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
} from "../../controller/admin/product.controller.js";

const router = Router();

router.get("/all", verifyToken, checkRole("can_view_products"), getAllProducts);

router.post(
  "/create",
  verifyToken,
  checkRole("can_create_products"),
  validateProduct,
  handleValidationErrors,
  uploadProducts.array("images", 5),
  createProduct
);

router.put(
  "/update/:id",
  verifyToken,
  checkRole("can_update_products"),

  validateProduct,
  handleValidationErrors,
  uploadProducts.array("images", 5),
  updateProduct
);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRole("can_delete_products"),
  deleteProduct
);

router.get("/category/:categoryId", getProductsByCategory);

router.get("/search", searchProducts);
export default router;
