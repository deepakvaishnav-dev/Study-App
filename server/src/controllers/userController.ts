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

    // Aggregate daily study minutes (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyHistoryMap = new Map<string, number>();

    // Initialize last 30 days with 0
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      dailyHistoryMap.set(dateStr, 0);
    }

    sessions.forEach((session) => {
      const date = new Date(session.date || (session as any).createdAt);
      if (date >= thirtyDaysAgo) {
        const dateStr = date.toISOString().split("T")[0];
        if (dailyHistoryMap.has(dateStr)) {
          dailyHistoryMap.set(
            dateStr,
            (dailyHistoryMap.get(dateStr) || 0) + session.duration,
          );
        }
      }
    });

    const dailyHistory = Array.from(dailyHistoryMap.entries())
      .map(([date, studyMinutes]) => ({
        date,
        studyMinutes,
        notesCreated: 0, // Placeholder - requires checking Note model timestamps
        testsTaken: 0, // Placeholder - requires checking TestResult model timestamps
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate Streak (Simplified based on dailyHistory)
    let streakDays = 0;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    let currentStreak = 0;
    const sortedDates = dailyHistory
      .filter((d) => d.studyMinutes > 0)
      .map((d) => d.date)
      .sort((a, b) => b.localeCompare(a)); // Descending

    if (sortedDates.length > 0) {
      const lastStudyDate = sortedDates[0];
      // If last study was today or yesterday, streak is active
      if (lastStudyDate === today || lastStudyDate === yesterday) {
        currentStreak = 1;
        let checkDate = new Date(lastStudyDate);

        for (let i = 1; i < sortedDates.length; i++) {
          checkDate.setDate(checkDate.getDate() - 1); // Previous day
          const expectedDateStr = checkDate.toISOString().split("T")[0];

          if (sortedDates.includes(expectedDateStr)) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
    streakDays = currentStreak;

    const stats = {
      totalNotes,
      totalTests,
      totalStudyMinutes,
      streakDays,
      dailyHistory,
    };

    res.json(stats);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};
