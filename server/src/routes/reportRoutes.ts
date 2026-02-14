import express from "express";
import {
  saveTestResult,
  getTestResults,
} from "../controllers/reportController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/", auth, saveTestResult);
router.get("/", auth, getTestResults);

export default router;
