import { Router } from "express";
import authRoute from "./auth.routes.js";
import productRoute from "./product.routes.js";
import categoryRoute from "./category.routes.js";
import adminRoute from "./admin.routes.js";
import roleRoute from "./role.routes.js";
import dashboardRoute from "./dashboard.routes.js";

const router = Router();
router.use("/", adminRoute);
router.use("/auth", authRoute);
router.use("/products", productRoute);
router.use("/categories", categoryRoute);
router.use("/roles", roleRoute);
router.use("/dashboard", dashboardRoute);

export default router;
