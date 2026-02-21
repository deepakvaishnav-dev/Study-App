export interface StudentProfile {
  name: string;
  grade: string;
  subjects: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  parentEmail?: string;
  grade: string;
  joinedDate: string;
  isAdmin?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  chapter: string;
  type: "text" | "pdf" | "image" | "ai";
  date: string;
  tags: string[];
  isBookmarked: boolean;
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  type: "mcq" | "short" | "long";
  difficulty: "easy" | "medium" | "hard";
}

export interface QuestionPaper {
  id: string;
  subject: string;
  chapter: string;
  difficulty: string;
  questions: Question[];
  createdAt: string;
}

export interface StudySession {
  id: string;
  topic: string;
  subject: string;
  duration: number; // minutes
  date: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

export const ViewMode = {
  Dashboard: "dashboard",
  Notes: "notes",
  Reader: "reader",
  Papers: "papers",
  Planner: "planner",
  Assessment: "assessment",
  TestReports: "test_reports",
  Profile: "profile",
  Pricing: "pricing",
  AdminDashboard: "admin_dashboard",
  AdminUsers: "admin_users",
  AdminUserDetail: "admin_user_detail",
} as const;

export type ViewMode = (typeof ViewMode)[keyof typeof ViewMode];

export interface TestDetails {
  subject: string;
  score: number;
  total: number;
  percentage: number | string;
  weakTopics: string[];
  totalQuestions?: number;
  timeTaken?: string;
  questions?: Array<{
    text: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
  detailedReport?:
    | string
    | Array<{
        text: string;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        explanation?: string;
      }>;
}
