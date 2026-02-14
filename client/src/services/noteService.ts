import api from "./api";
import type { Note } from "../types";

export const noteService = {
  getAll: async (): Promise<Note[]> => {
    const response = await api.get("/notes");
    return response.data;
  },

  create: async (note: Partial<Note>): Promise<Note> => {
    const response = await api.post("/notes", note);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};
