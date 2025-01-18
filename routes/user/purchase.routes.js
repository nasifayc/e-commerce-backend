import { Router } from "express";
import verifyToken from "../../middleware/verifyToken.js";
import {
  purchaseProducts,
  verifyChapaPayment,
} from "../../controller/user/purchase.controller.js";
import {
  validatePurchase,
  handleValidationErrors,
} from "../../middleware/expressValidator.js";

const router = Router();

router.post(
  "/purchase",
  verifyToken,
  validatePurchase,
  handleValidationErrors,
  purchaseProducts
);

router.get("/veryfy-payment/:tx_ref", verifyChapaPayment);

export default router;
