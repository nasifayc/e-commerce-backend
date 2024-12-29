import { Router } from "express";
import authRoute from "./auth.routes";
import productRoute from "./product.routes";
import purchaseRoute from "./purchase.routes";

const router = Router();

router.use("/auth", authRoute);
router.use("/products", productRoute);
router.use("/purchase", purchaseRoute);
