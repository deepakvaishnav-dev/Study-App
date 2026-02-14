import { Request, Response } from "express";
import TestResult from "../models/TestResult";
import { AuthRequest } from "../middleware/auth";

export const saveTestResult = async (req: AuthRequest, res: Response) => {
  const {
    subject,
    score,
    totalQuestions,
    percentage,
    weakTopics,
    detailedReport,
  } = req.body;

  try {
    const newResult = new TestResult({
      userId: req.user.user.id,
      subject,
      score,
      totalQuestions,
      percentage,
      weakTopics,
      detailedReport,
    });

    const result = await newResult.save();
    res.json(result);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

export const getTestResults = async (req: AuthRequest, res: Response) => {
  try {
    const results = await TestResult.find({ userId: req.user.user.id }).sort({
      date: -1,
    });
    res.json(results);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};
