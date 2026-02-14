import api from "./api";
import type { StudySession } from "../types";

export const sessionService = {
  getAll: async (): Promise<StudySession[]> => {
    const response = await api.get("/sessions");
    return response.data;
  },

  create: async (session: Partial<StudySession>): Promise<StudySession> => {
    const response = await api.post("/sessions", session);
    return response.data;
  },

  update: async (
    id: string,
    updates: Partial<StudySession>,
  ): Promise<StudySession> => {
    const response = await api.put(`/sessions/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sessions/${id}`);
  },
};
