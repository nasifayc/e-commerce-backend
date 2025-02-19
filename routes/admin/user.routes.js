import { Router } from "express";
import verifyToken from "../../middleware/verifyToken.js";
import { checkRole } from "../../middleware/checkRole.js";
import { getAllUsers } from "../../controller/admin/user.controller.js";

const router = Router();

// Get all users
router.get("/all", verifyToken, checkRole("can_view_user"), getAllUsers);

export default router;
