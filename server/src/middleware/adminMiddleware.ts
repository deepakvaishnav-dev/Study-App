import { Request, Response, NextFunction } from "express";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

export const admin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // req.user is populated by auth middleware
    // Payload structure is { user: { id: ... } } based on authController
    const userId = req.user?.user?.id || req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Not authorized, no token" });
      return;
    }

    const user = await User.findById(userId);

    if (user && user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Not authorized as an admin" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
