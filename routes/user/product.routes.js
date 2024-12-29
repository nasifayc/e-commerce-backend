import { Router } from "express";

const router = Router();

router.get("/all", (req, res) => {
  console.log("get all products");
});

router.post("/search-product", (req, res) => {
  console.log("Search-Product");
});

export default router;
