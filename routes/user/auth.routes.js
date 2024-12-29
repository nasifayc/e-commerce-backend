import { Router } from "express";

const router = Router();

router.post("/sign-in", (req, res) => {
  console.log("Sign-in");
});

router.post("/sign-up", (req, res) => {
  console.log("Sign-up");
});

export default router;
