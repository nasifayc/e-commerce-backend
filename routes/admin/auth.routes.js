import { login } from "../../controller/admin/auth.controller.js";
import { Router } from "express";

const router = Router();

router.post("/sign-in", login);

// router.post("/sign-up", login);

export default router;
