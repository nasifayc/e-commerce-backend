import { login } from "../../controller/admin/auth.controller.js";
import { Router } from "express";

const router = Router();

router.post("/sign-in", login);

router.post("/sign-up", (req, res) => {
  console.log("Sign-up Admin");
});

export default router;
