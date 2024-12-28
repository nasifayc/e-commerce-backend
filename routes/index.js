import express from "express";
import { getSampleData } from "../controller/getSampleData.controller.js";

const router = express.Router();

router.get("/sample", getSampleData);

export default router;
