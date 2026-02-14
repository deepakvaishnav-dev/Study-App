import express from "express";
import { geminiController } from "../controllers/geminiController";

const router = express.Router();

router.post("/generate", geminiController.generateText);

export default router;
