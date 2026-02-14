import express from "express";
import { getAllUsers, getUserDetails } from "../controllers/adminController";
import { auth } from "../middleware/auth";
import { admin } from "../middleware/adminMiddleware";

const router = express.Router();

router.get("/users", auth, admin, getAllUsers);
router.get("/users/:id", auth, admin, getUserDetails);

export default router;
