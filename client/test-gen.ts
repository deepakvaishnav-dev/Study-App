import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_API_KEY;

if (!apiKey) {
    console.error("No API key found in .env");
    process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: apiKey,
  apiVersion: "v1beta",
});

async function testGen() {
    try {
        console.log("Testing generation with gemini-2.0-flash-lite-001...");
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: "Say hello",
        });
        console.log("Response:", response.text);
        console.log("SUCCESS!");
    } catch (error) {
        console.error("FAILED:", error);
    }
}

testGen();
