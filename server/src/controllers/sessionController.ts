import { Request, Response } from "express";
import StudySession from "../models/StudySession";
import { AuthRequest } from "../middleware/auth";

export const getSessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await StudySession.find({ userId: req.user.user.id }).sort(
      { date: -1 },
    );
    res.json(sessions);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

export const createSession = async (req: AuthRequest, res: Response) => {
  const { topic, subject, duration, date, completed, priority } = req.body;

  try {
    const newSession = new StudySession({
      userId: req.user.user.id,
      topic,
      subject,
      duration,
      date,
      completed,
      priority,
    });

    const session = await newSession.save();
    res.json(session);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    let session = await StudySession.findById(req.params.id);

    if (!session) {
      res.status(404).json({ msg: "Session not found" });
      return;
    }

    // Make sure user owns session
    if (session.userId.toString() !== req.user.user.id) {
      res.status(401).json({ msg: "Not authorized" });
      return;
    }

    session = await StudySession.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );

    res.json(session);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await StudySession.findById(req.params.id);

    if (!session) {
      res.status(404).json({ msg: "Session not found" });
      return;
    }

    // Make sure user owns session
    if (session.userId.toString() !== req.user.user.id) {
      res.status(401).json({ msg: "Not authorized" });
      return;
    }

    await StudySession.findByIdAndDelete(req.params.id);

    res.json({ msg: "Session removed" });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};
