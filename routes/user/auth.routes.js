import { Router } from "express";
import {
  signIn,
  signUp,
  validateOtp,
} from "../../controller/user/auth.controller.js";
import {
  validateSignIn,
  validateSignUp,
  handleValidationErrors,
} from "../../middleware/expressValidator.js";

import verifyToken from "../../middleware/verifyToken.js";

const router = Router();

router.post("/sign-in", validateSignIn, handleValidationErrors, signIn);

router.post("/sign-up", validateSignUp, handleValidationErrors, signUp);

router.post("/validate-otp", validateOtp);

router.post("/verify-token", verifyToken, (req, res) => {
  res.json({ message: "Token is valid." });
});

export default router;
