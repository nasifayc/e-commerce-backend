import { Router } from "express";

const router = Router();

router.post("/sign-in", (req, res) => {
  console.log("Sign-in user");
  res.json({ message: "User signed in successfully" });
});

router.post("/sign-up", (req, res) => {
  console.log("Sign-up user");
  res.json({ message: "User signed up successfully" });
});

export default router;
