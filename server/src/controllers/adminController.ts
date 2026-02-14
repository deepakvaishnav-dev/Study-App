import { Request, Response } from "express";
import User from "../models/User";
import TestResult from "../models/TestResult";
import StudySession from "../models/StudySession";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ joinedDate: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const testResults = await TestResult.find({ userId: req.params.id }).sort({
      date: -1,
    });
    const studySessions = await StudySession.find({
      userId: req.params.id,
    }).sort({ date: -1 });

    // Calculate aggregated stats
    const totalStudyTime = studySessions.reduce(
      (acc, curr) => acc + curr.duration,
      0,
    );
    const averageScore =
      testResults.length > 0
        ? testResults.reduce((acc, curr) => acc + curr.score, 0) /
          testResults.length
        : 0;

    res.json({
      user,
      testResults,
      studySessions,
      stats: {
        totalStudyTime,
        averageScore,
        totalTests: testResults.length,
        totalSessions: studySessions.length,
      },
      reports: {
        // Placeholder for weekly/monthly logic if needed explicitly
        weekly: [],
        monthly: [],
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
