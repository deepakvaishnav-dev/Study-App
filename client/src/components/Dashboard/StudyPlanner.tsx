import React, { useState, useMemo } from "react";
import {
  Plus,
  Check,
  X,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Calendar as CalendarIcon,
  Timer,
  AlertCircle,
  Award,
  Zap,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import type { StudySession } from "../../types";
import { sessionService } from "../../services/sessionService";

interface StudyPlannerProps {
  sessions: StudySession[];
  setSessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({
  sessions,
  setSessions,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newSubject, setNewSubject] = useState("Mathematics");
  const [newDuration, setNewDuration] = useState(45);
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">(
    "medium",
  );
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  const stats = useMemo(() => {
    const completed = sessions.filter((s) => s.completed).length;
    const pending = sessions.length - completed;
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

    return {
      completed,
      pending,
      total: sessions.length,
      totalMinutes,
      chartData: [
        { name: "Completed", value: completed, color: "#10b981" },
        { name: "In Progress", value: pending, color: "#f59e0b" },
      ],
    };
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    if (filter === "all") return sessions;
    if (filter === "completed") return sessions.filter((s) => s.completed);
    return sessions.filter((s) => !s.completed);
  }, [sessions, filter]);

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Literature",
    "Computer Science",
    "Economics",
  ];

  const addTask = async () => {
    if (!newTopic.trim()) return;

    try {
      const newSessionData = {
        topic: newTopic,
        subject: newSubject,
        duration: newDuration,
        date: new Date().toISOString().split("T")[0],
        completed: false,
        priority: newPriority,
      };

      const createdSession = await sessionService.create(newSessionData);
      setSessions([createdSession, ...sessions]);
      setNewTopic("");
      setNewDuration(45);
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to add session", error);
    }
  };

  const toggleComplete = async (id: string) => {
    const sessionToUpdate = sessions.find((s) => s.id === id);
    if (!sessionToUpdate) return;

    try {
      const updatedSession = await sessionService.update(id, {
        completed: !sessionToUpdate.completed,
      });
      setSessions(sessions.map((s) => (s.id === id ? updatedSession : s)));
    } catch (error) {
      console.error("Failed to update session", error);
    }
  };

  const removeTask = async (id: string) => {
    try {
      await sessionService.delete(id);
      setSessions(sessions.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete session", error);
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "medium":
        return "bg-amber-500/10 text-amber-600 border-amber-200";
      default:
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
    }
  };

  const subjectColors: Record<string, string> = {
    Mathematics: "#3b82f6",
    Physics: "#8b5cf6",
    Chemistry: "#ec4899",
    Biology: "#10b981",
    History: "#f59e0b",
    Literature: "#ef4444",
    "Computer Science": "#06b6d4",
    Economics: "#6366f1",
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'DM Sans', sans-serif;
        }
        
        h1, h2, h3, h4, .serif {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.2s; opacity: 0; }
        .stagger-3 { animation-delay: 0.3s; opacity: 0; }
        .stagger-4 { animation-delay: 0.4s; opacity: 0; }
        
        .shimmer {
          background: linear-linear(90deg, transparent, rgba(255,255,255,0.5), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        .task-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .task-card:hover {
          transform: translateX(4px);
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }
        
        .progress-ring {
          transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <header className="animate-slideUp">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 tracking-tight">
                Study Planner
              </h1>
              <p className="text-lg text-slate-600 max-w-xl">
                Design your perfect study session. Track progress, master
                subjects, and build momentum toward your academic goals.
              </p>
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="group relative overflow-hidden bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-2">
                {isAdding ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {isAdding ? "Cancel" : "New Session"}
              </div>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-1 animate-slideUp">
            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Total Sessions
                </span>
                <CalendarIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-4xl font-bold text-slate-900">
                {stats.total}
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Completed
                </span>
                <Award className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-4xl font-bold text-emerald-600">
                {stats.completed}
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  In Progress
                </span>
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-4xl font-bold text-amber-600">
                {stats.pending}
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Study Time
                </span>
                <Timer className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-4xl font-bold text-slate-900">
                {Math.floor(stats.totalMinutes / 60)}
                <span className="text-2xl text-slate-500">h</span>
                {stats.totalMinutes % 60}
                <span className="text-2xl text-slate-500">m</span>
              </div>
            </div>
          </div>
        </header>

        {/* Add New Session Form */}
        {isAdding && (
          <div className="animate-scaleIn stagger-2">
            <div className="glass p-8 rounded-3xl border-2 border-slate-200 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Create New Study Session
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    What would you like to study?
                  </label>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g., Linear Algebra Chapter 3"
                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-6 py-4 text-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject
                  </label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-6 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                    >
                      {subjects.map((subject) => (
                        <option key={subject}>{subject}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Duration
                  </label>
                  <div className="flex gap-2">
                    {[30, 45, 60, 90].map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setNewDuration(duration)}
                        className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                          newDuration === duration
                            ? "bg-blue-600 text-white shadow-lg scale-105"
                            : "bg-white border-2 border-slate-200 text-slate-600 hover:border-blue-300"
                        }`}
                      >
                        {duration}m
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["low", "medium", "high"] as const).map((priority) => (
                      <button
                        key={priority}
                        onClick={() => setNewPriority(priority)}
                        className={`py-4 rounded-xl font-semibold capitalize transition-all ${
                          newPriority === priority
                            ? priority === "high"
                              ? "bg-red-600 text-white shadow-lg scale-105"
                              : priority === "medium"
                                ? "bg-amber-500 text-white shadow-lg scale-105"
                                : "bg-emerald-600 text-white shadow-lg scale-105"
                            : "bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {priority === "high" && (
                          <AlertCircle className="inline w-4 h-4 mr-1" />
                        )}
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={addTask}
                  disabled={!newTopic.trim()}
                  className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  Add to Schedule
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-8 bg-white border-2 border-slate-200 text-slate-600 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Progress & Insights */}
          <div className="space-y-6 stagger-3 animate-slideUp">
            {/* Progress Chart */}
            <div className="glass p-6 rounded-3xl">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Progress
              </h3>

              {stats.total > 0 ? (
                <>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {stats.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-slate-600">
                          Completed
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {stats.completed}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-sm font-medium text-slate-600">
                          In Progress
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {stats.pending}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-slate-400 text-center">No sessions yet</p>
                </div>
              )}
            </div>

            {/* Motivation Card */}
            <div className="relative overflow-hidden bg-linear-to-br from-blue-600 to-purple-600 p-6 rounded-3xl text-white shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

              <div className="relative">
                <Sparkles className="w-8 h-8 mb-4" />
                <h4 className="text-lg font-bold mb-2">Keep Going!</h4>
                <p className="text-sm text-blue-100 leading-relaxed">
                  You've completed {stats.completed} sessions. Every step
                  forward is progress toward mastery.
                </p>
              </div>
            </div>
          </div>

          {/* Main Task List */}
          <div className="lg:col-span-3 stagger-4 animate-slideUp">
            {/* Filter Bar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-slate-900">
                Your Sessions
              </h2>

              <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                {(["all", "pending", "completed"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg font-semibold capitalize text-sm transition-all ${
                      filter === f
                        ? "bg-slate-900 text-white shadow-md"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {filteredSessions.length === 0 ? (
                <div className="glass p-16 rounded-3xl text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    No sessions yet
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Create your first study session to start tracking your
                    progress
                  </p>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg"
                  >
                    Create Session
                  </button>
                </div>
              ) : (
                filteredSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className="task-card group glass p-6 rounded-2xl border-l-4 hover:shadow-xl"
                    style={{
                      borderLeftColor:
                        subjectColors[session.subject] || "#64748b",
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleComplete(session.id)}
                        className={`mt-1 shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          session.completed
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-slate-300 hover:border-blue-500 hover:bg-blue-50"
                        }`}
                      >
                        {session.completed && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3
                            className={`text-lg font-bold text-slate-900 ${
                              session.completed ? "line-through opacity-60" : ""
                            }`}
                          >
                            {session.topic}
                          </h3>

                          <button
                            onClick={() => removeTask(session.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: `${subjectColors[session.subject]}15`,
                              color: subjectColors[session.subject],
                            }}
                          >
                            {session.subject}
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityStyles(session.priority)}`}
                          >
                            {session.priority}
                          </span>

                          <span className="flex items-center gap-1 text-sm text-slate-500">
                            <Timer className="w-4 h-4" />
                            {session.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
