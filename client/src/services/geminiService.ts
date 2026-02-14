import api from "./api";

export const geminiService = {
  generateText: async (prompt: string): Promise<string> => {
    const response = await api.post("/gemini/generate", { prompt });
    return response.data.text;
  },
};
