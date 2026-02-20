import type { Note } from "../types";

const STORAGE_KEY = "studysync_notes";

const getStoredNotes = (): Note[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveStoredNotes = (notes: Note[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const noteService = {
  getAll: async (): Promise<Note[]> => {
    // Simulate async operation for consistent API
    return Promise.resolve(getStoredNotes());
  },

  create: async (note: Partial<Note>): Promise<Note> => {
    const notes = getStoredNotes();
    const newNote = note as Note;
    newNote.id = Date.now().toString();
    newNote.date = new Date().toLocaleDateString();
    notes.unshift(newNote); // Add to beginning
    saveStoredNotes(notes);
    return Promise.resolve(newNote);
  },

  update: async (id: string, updates: Partial<Note>): Promise<Note> => {
    const notes = getStoredNotes();
    const index = notes.findIndex((n) => n.id === id);
    if (index === -1) throw new Error("Note not found");

    notes[index] = { ...notes[index], ...updates };
    saveStoredNotes(notes);
    return Promise.resolve(notes[index]);
  },

  delete: async (id: string): Promise<void> => {
    const notes = getStoredNotes();
    const filteredNotes = notes.filter((n) => n.id !== id);
    saveStoredNotes(filteredNotes);
    return Promise.resolve();
  },
};
