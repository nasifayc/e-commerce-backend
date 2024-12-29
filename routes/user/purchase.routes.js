import { Router } from "express";

const router = Router();

router.post("/get-purchase-history", (req, res) => {
  console.log("get perchase history");
});

router.post("/veryfy-payment", (req, res) => {
  console.log("verify payment");
});

export default router;
