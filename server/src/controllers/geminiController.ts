import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const geminiController = {
  generateText: async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("❌ GEMINI_API_KEY not found in environment variables");
        return res.status(500).json({ error: "Gemini API key not configured" });
      }

      console.log("✅ Gemini API Key found, length:", apiKey.length);

      const { model: modelName, contents, config } = req.body;

      if (!contents) {
        console.error("❌ No contents provided in request");
        return res.status(400).json({ error: "Contents are required" });
      }

      console.log(
        "📝 Generating content with model:",
        modelName || "gemini-1.5-flash",
      );

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

      console.log("✅ Successfully generated text, length:", text.length);
      res.status(200).json({ text });
    } catch (error: any) {
      console.error("❌ Error generating text with Gemini:");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      if (error.response) {
        console.error("API Response:", error.response);
      }
      res.status(500).json({
        error: "Failed to generate text",
        details: error.message,
      });
    }
  },
};
