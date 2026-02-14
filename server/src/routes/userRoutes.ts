import express from "express";
import { getUserStats } from "../controllers/userController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/stats", auth, getUserStats);

export default router;
