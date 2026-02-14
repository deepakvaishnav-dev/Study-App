import api from "./api";
import type { UserProfile } from "../types";

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  notesCreated: number;
  testsTaken: number;
  studyMinutes: number;
}

export interface UserStats {
  totalNotes: number;
  totalTests: number;
  totalStudyMinutes: number;
  streakDays: number;
  lastStudyDate: string | null;
  dailyHistory: DailyActivity[];
}

export const defaultStats: UserStats = {
  totalNotes: 0,
  totalTests: 0,
  totalStudyMinutes: 0,
  streakDays: 0,
  lastStudyDate: null,
  dailyHistory: [],
};

// Helper to get current profile from storage
const getCurrentProfile = (): UserProfile | null => {
  try {
    const stored = localStorage.getItem("studysync_user_profile");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const userDataService = {
  // Stats - Now Async
  getStats: async (): Promise<UserStats> => {
    try {
      const response = await api.get("/user/stats");
      return response.data;
    } catch (err) {
      console.error("Failed to fetch stats", err);
      return defaultStats;
    }
  },

  incrementNotes: async () => {
    window.dispatchEvent(new Event("user-stats-updated"));
  },

  incrementTests: async () => {
    window.dispatchEvent(new Event("user-stats-updated"));
  },

  addStudyHours: async (_minutes: number) => {
    window.dispatchEvent(new Event("user-stats-updated"));
  },

  getChartData: async (_days = 7) => {
    try {
      await userDataService.getStats();

      return [];
    } catch {
      return [];
    }
  },

  getPeriodStats: async (_days: number): Promise<UserStats> => {
    try {
      const stats = await userDataService.getStats();
      return stats; // simplified
    } catch {
      return defaultStats;
    }
  },

  getStorageKey: (baseKey: string) => {
    const profile = getCurrentProfile();
    if (!profile || !profile.email) return baseKey;
    return `${baseKey}_${profile.email}`;
  },

  // Auth Methods - Keep Sync for basic state, but Login should probably be async
  getUserProfile: getCurrentProfile,
  defaultStats,

  login: (profile: UserProfile, token?: string) => {
    localStorage.setItem("studysync_user_profile", JSON.stringify(profile));
    if (token) {
      localStorage.setItem("token", token);
    }
    window.dispatchEvent(new Event("user-stats-updated"));
    window.dispatchEvent(new Event("user-auth-changed"));
  },

  logout: () => {
    localStorage.removeItem("studysync_user_profile");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("user-auth-changed"));
  },
};
