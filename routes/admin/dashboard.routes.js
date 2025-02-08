import { Router } from "express";
import { getDashboardData } from "../../controller/admin/dashboared.controller.js";
import verifyToken from "../../middleware/verifyToken.js";
import { checkRole } from "../../middleware/checkRole.js";

const router = Router();

router.get(
  "/all",
  verifyToken,
  checkRole("can_view_dashboard"),
  getDashboardData
);

export default router;
