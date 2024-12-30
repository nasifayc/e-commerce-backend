import { Router } from "express";

const router = Router();

router.post("/sign-in", (req, res) => {
  console.log("Sign-in Admin");
});

router.post("/sign-up", (req, res) => {
  console.log("Sign-up Admin");
});

export default router;
