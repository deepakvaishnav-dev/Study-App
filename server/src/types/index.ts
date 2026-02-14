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
