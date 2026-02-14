import { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import { AuthRequest } from "../middleware/auth";

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.user.user.id }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

export const createNote = async (req: AuthRequest, res: Response) => {
  const { title, content, subject, chapter, type, tags, isBookmarked } =
    req.body;

  try {
    const newNote = new Note({
      userId: req.user.user.id,
      title,
      content,
      subject,
      chapter,
      type,
      tags,
      isBookmarked,
    });

    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    // Check user
    if (note.userId.toString() !== req.user.user.id) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    await note.deleteOne();

    res.json({ message: "Note removed" });
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send("Server Error");
  }
};
