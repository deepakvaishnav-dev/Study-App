import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const geminiController = {
  generateText: async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      const { model: modelName, contents, config } = req.body;

      if (!contents) {
        return res.status(400).json({ error: "Contents are required" });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName || "gemini-1.5-flash",
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: contents }] }],
        generationConfig: config,
      });

      const response = await result.response;
      const text = response.text();

      res.status(200).json({ text });
    } catch (error) {
      console.error("Error generating text with Gemini:", error);
      res.status(500).json({ error: "Failed to generate text" });
    }
  },
};
