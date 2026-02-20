import express from "express";
import {
  getSessions,
  createSession,
  updateSession,
  deleteSession,
} from "../controllers/sessionController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/", auth, getSessions);
router.post("/", auth, createSession);
router.put("/:id", auth, updateSession);
router.delete("/:id", auth, deleteSession);

export default router;
