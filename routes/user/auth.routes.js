import { Router } from "express";
import { signIn, signUp } from "../../controller/user/auth.controller.js";
import {
  validateSignIn,
  validateSignUp,
  handleValidationErrors,
} from "../../middleware/expressValidator.js";

const router = Router();

router.post("/sign-in", validateSignIn, handleValidationErrors, signIn);

router.post("/sign-up", validateSignUp, handleValidationErrors, signUp);

export default router;
