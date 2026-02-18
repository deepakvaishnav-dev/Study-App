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

  getChartData: async (days = 7) => {
    try {
      const stats = await userDataService.getStats();
      const history = stats.dailyHistory || [];

      // Create a map for quick lookup
      const historyMap = new Map<string, number>();
      history.forEach((day) => {
        // Ensure date string is YYYY-MM-DD
        const dateStr = new Date(day.date).toISOString().split("T")[0];
        historyMap.set(dateStr, day.studyMinutes);
      });

      const chartData = [];

      if (days === 7) {
        // Current Calendar Week (Mon - Sun)
        const curr = new Date(); // get current date

        // Note: if today is Sunday (0), this logic needs adjustment.
        // If Sunday (0), we want the *previous* Monday, which is -6 days away.
        // Standard JS: 0=Sun, 1=Mon...6=Sat.
        // improved logic:
        const day = curr.getDay();
        const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday

        const monday = new Date(curr.setDate(diff));

        for (let i = 0; i < 7; i++) {
          const d = new Date(monday);
          d.setDate(monday.getDate() + i);
          const dateStr = d.toISOString().split("T")[0];

          chartData.push({
            name: d.toLocaleDateString("en-US", { weekday: "short" }),
            hours: Number(((historyMap.get(dateStr) || 0) / 60).toFixed(1)),
            fullDate: dateStr, // helpful for debugging or tooltips
          });
        }
      } else {
        // Last 30 Days
        for (let i = 29; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];

          chartData.push({
            name: d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            hours: Number(((historyMap.get(dateStr) || 0) / 60).toFixed(1)),
          });
        }
      }

      return chartData;
    } catch (error) {
      console.error("Error fetching chart data:", error);
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
