import { Router } from "express";
import authRoute from "./auth.routes.js";
import productRoute from "./product.routes.js";
import purchaseRoute from "./purchase.routes.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/products", productRoute);
router.use("/purchase", purchaseRoute);

export default router;
