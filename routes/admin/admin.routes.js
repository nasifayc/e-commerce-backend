import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import { checkRole } from "../../middleware/checkRole.js";
import { uploadFile } from "../../middleware/uploadFiles.js";
import {
  validateAdmin,
  handleValidationErrors,
} from "../../middleware/expressValidator.js";
import {
  getAllAdmins,
  createAdmin,
  getAdminByID,
  updateAdmin,
  deleteAdmin,
  getPermissions,
} from "../../controller/admin/admin.controller.js";

const router = express.Router();

// Route to get all admins
router.get(
  "/admins",
  verifyToken,
  checkRole("can_view_admin_user"),
  getAllAdmins
);

// Route to create a new admin
router.post(
  "/admins",
  verifyToken,
  checkRole("can_create_admin_user"),
  uploadFile.single("image"),
  validateAdmin,
  handleValidationErrors,
  createAdmin
);

// Route to get an admin by ID
router.get(
  "/admins/:id",
  verifyToken,
  checkRole("can_view_admin_user"),
  getAdminByID
);

// Route to update an admin
router.put(
  "/admins/:id",
  verifyToken,
  checkRole("can_update_admin_user"),
  uploadFile.single("image"),
  validateAdmin,
  handleValidationErrors,
  updateAdmin
);

// Route to delete an admin
router.delete(
  "/admins/:id",
  verifyToken,
  checkRole("can_delete_admin_user"),
  deleteAdmin
);

router.get("/admins/get-permissions", verifyToken, getPermissions);

export default router;
