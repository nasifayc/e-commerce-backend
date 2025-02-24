import { Router } from "express";
import verifyToken from "../../middleware/verifyToken.js";
import { checkRole } from "../../middleware/checkRole.js";
import {
  getRoles,
  getRoleByID,
  createRole,
  updateRole,
  deleteRole,
  fetchPermissions,
} from "../../controller/admin/role.controller.js";

const router = Router();

// Get Roles
router.get("/all", verifyToken, checkRole("can_view_roles"), getRoles);

// Get role by Id
router.get("/roles/:id", verifyToken, checkRole("can_view_roles"), getRoleByID);

// Create Role
router.post("/create", verifyToken, checkRole("can_create_role"), createRole);

// Update role
router.put(
  "/update/:id",
  verifyToken,
  checkRole("can_update_role"),
  updateRole
);

// Delete role
router.delete(
  "/delete/:id",
  verifyToken,
  checkRole("can_delete_role"),
  deleteRole
);

// Fetch Permissions
router.get(
  "/permissions",
  verifyToken,
  checkRole("can_view_Permissions"),
  fetchPermissions
);

export default router;
