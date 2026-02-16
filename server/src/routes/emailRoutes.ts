import express from "express";
import { emailController } from "../controllers/emailController";

const router = express.Router();

router.post("/send", emailController.sendEmail);
router.get("/verify", emailController.verifyConnection);

export default router;
