import { Request, Response } from "express";
import Note from "../models/Note";
import StudySession from "../models/StudySession";
import TestResult from "../models/TestResult";
import { AuthRequest } from "../middleware/auth";

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.user.id;

    const totalNotes = await Note.countDocuments({ userId });
    const totalTests = await TestResult.countDocuments({ userId });

    const sessions = await StudySession.find({ userId });
    const totalStudyMinutes = sessions.reduce(
      (acc, curr) => acc + curr.duration,
      0,
    );

    // Calculate Streak (Simplified)
    // In a real app, this would be more complex math on dates
    const streakDays = 1; // Placeholder

    // Daily History (Simplified - fetching last 7 days activity)
    // This is getting complex to aggregate on the fly.
    // For now, let's return totals.

    // Construct a basic daily history from actual data if needed, or just return totals
    const stats = {
      totalNotes,
      totalTests,
      totalStudyMinutes,
      streakDays,
      dailyHistory: [], // TODO: Implement daily aggregation if UI strictly needs it
    };

    res.json(stats);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};
