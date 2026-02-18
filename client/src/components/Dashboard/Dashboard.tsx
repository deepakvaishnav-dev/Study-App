import React from "react";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Plus,
  Target,
  Zap,
  Calendar,
  Brain,
  ArrowRight,
  Flame,
  Trophy,
  Sparkles,
  Activity,
  BarChart3,
  BookMarked,
  ChevronRight,
  Medal,
  Crown,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { ViewMode } from "../../types";
import { userDataService } from "../../services/userData";
import type { UserStats } from "../../services/userData";

interface DashboardProps {
  setView: (view: ViewMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const [stats, setStats] = React.useState<UserStats>(
    userDataService.defaultStats || {
      totalNotes: 0,
      totalTests: 0,
      totalStudyMinutes: 0,
      streakDays: 0,
      lastStudyDate: null,
      dailyHistory: [],
    },
  );
  // Initialize with default week days so chart axes show immediately
  const getDefaultWeekData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((name) => ({ name, hours: 0 }));
  };
  const [chartData, setChartData] = React.useState<any[]>(getDefaultWeekData());
  const [selectedPeriod, setSelectedPeriod] = React.useState<"week" | "month">(
    "week",
  );

  const fetchData = React.useCallback(async () => {
    const newStats = await userDataService.getStats();
    setStats(newStats);
    const newChartData = await userDataService.getChartData(
      selectedPeriod === "week" ? 7 : 30,
    );
    setChartData(newChartData);
  }, [selectedPeriod]);

  React.useEffect(() => {
    fetchData();

    const handleStatsUpdate = () => {
      fetchData();
    };

    window.addEventListener("user-stats-updated", handleStatsUpdate);
    return () =>
      window.removeEventListener("user-stats-updated", handleStatsUpdate);
  }, [fetchData]);

  const handlePeriodChange = (period: "week" | "month") => {
    setSelectedPeriod(period);
  };

  // Weekly goal progress
  const weeklyGoal = 20;
  // Use current stats for weekly progress as a simplification,
  // or we could filter stats.dailyHistory if populated.
  const weeklyProgress = Math.min(
    (stats.totalStudyMinutes / 60 / weeklyGoal) * 100,
    100,
  );

  // Productivity score
  const productivityScore = Math.min(
    ((stats.totalNotes * 5 + stats.totalTests * 10 + stats.streakDays * 3) /
      200) *
      100,
    100,
  );

  const statCards = [
    {
      label: "Study Hours",
      value: `${(stats.totalStudyMinutes / 60).toFixed(1)}h`,
      icon: Clock,
      color: "#6366f1",
      lightColor: "#eef2ff",
    },
    {
      label: "Notes Created",
      value: stats.totalNotes.toString(),
      icon: BookOpen,
      color: "#8b5cf6",
      lightColor: "#f3e8ff",
    },
    {
      label: "Tests Taken",
      value: stats.totalTests.toString(),
      icon: Target,
      color: "#10b981",
      lightColor: "#d1fae5",
    },
    {
      label: "Day Streak",
      value: stats.streakDays.toString(),
      icon: Flame,
      color: "#f59e0b",
      lightColor: "#fef3c7",
    },
  ];

  const achievements = [
    {
      icon: Flame,
      label: "Week Warrior",
      description: "7-day streak",
      unlocked: stats.streakDays >= 7,
      color: "#f59e0b",
      progress: Math.min((stats.streakDays / 7) * 100, 100),
    },
    {
      icon: Trophy,
      label: "Fast Learner",
      description: "10 tests",
      unlocked: stats.totalTests >= 10,
      color: "#eab308",
      progress: Math.min((stats.totalTests / 10) * 100, 100),
    },
    {
      icon: Brain,
      label: "Note Master",
      description: "20 notes",
      unlocked: stats.totalNotes >= 20,
      color: "#8b5cf6",
      progress: Math.min((stats.totalNotes / 20) * 100, 100),
    },
    {
      icon: Zap,
      label: "Time Master",
      description: "20 hours",
      unlocked: stats.totalStudyMinutes >= 1200,
      color: "#3b82f6",
      progress: Math.min((stats.totalStudyMinutes / 1200) * 100, 100),
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: "Start Session",
      action: () => setView(ViewMode.Planner),
      color: "#6366f1",
    },
    {
      icon: BookMarked,
      label: "My Notes",
      action: () => setView(ViewMode.Notes),
      color: "#8b5cf6",
    },
    {
      icon: Target,
      label: "Take Test",
      action: () => setView(ViewMode.Assessment),
      color: "#10b981",
    },
    {
      icon: Calendar,
      label: "Schedule",
      action: () => setView(ViewMode.Planner),
      color: "#3b82f6",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                <div className="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <span className="text-white text-xs sm:text-sm font-bold">
                    Level {Math.floor(productivityScore / 20) + 1}
                  </span>
                </div>
                <div className="px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-300" />
                  <span className="text-white text-xs sm:text-sm font-bold">
                    {stats.streakDays} Day Streak
                  </span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
                Welcome back, Student! 👋
              </h1>
              <p className="text-white/90 text-lg font-medium">
                You're doing amazing! Keep up the great work.
              </p>
            </div>

            <button
              onClick={() => setView(ViewMode.Planner)}
              className="group bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Start New Session
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
            >
              {/* Animated Background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl"
                style={{ backgroundColor: stat.color }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: stat.lightColor }}
                  >
                    <stat.icon
                      className="w-6 h-6"
                      style={{ color: stat.color }}
                    />
                  </div>
                </div>

                <h3 className="text-4xl font-black text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-500 font-semibold text-sm">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Study Progress */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    Study Progress
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Your weekly performance
                  </p>
                </div>
              </div>

              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => handlePeriodChange("week")}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                    selectedPeriod === "week"
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => handlePeriodChange("month")}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                    selectedPeriod === "month"
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Month
                </button>
              </div>
            </div>

            <div className="relative h-56 sm:h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    interval={0}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    domain={[0, (dataMax: number) => Math.max(dataMax, 1)]}
                    tickFormatter={(v) => `${v}h`}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number | undefined) => [
                      `${value ?? 0}h`,
                      "Study Hours",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorStudy)"
                    dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: "#6366f1" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
              {/* No data overlay */}
              {chartData.every((d) => d.hours === 0) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 text-center shadow-sm border border-gray-100">
                    <Activity className="w-8 h-8 text-indigo-300 mx-auto mb-2" />
                    <p className="text-gray-500 font-semibold text-sm">
                      No study sessions yet
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Start a session to see your progress!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Goal */}
          <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-lg text-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">Weekly Goal</h3>
              <Target className="w-6 h-6" />
            </div>

            <div className="relative h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="100%"
                  barSize={14}
                  data={[{ value: weeklyProgress }]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: "rgba(255,255,255,0.2)" }}
                    dataKey="value"
                    cornerRadius={10}
                    fill="white"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-black">
                  {Math.round(weeklyProgress)}%
                </div>
                <div className="text-sm opacity-90 mt-1">of {weeklyGoal}h</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-t border-white/20">
                <span className="text-white/90 font-medium">Completed</span>
                <span className="font-bold">
                  {(stats.totalStudyMinutes / 60).toFixed(1)}h
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/90 font-medium">Remaining</span>
                <span className="font-bold">
                  {Math.max(
                    0,
                    weeklyGoal - stats.totalStudyMinutes / 60,
                  ).toFixed(1)}
                  h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Breakdown & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subject Breakdown */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  Subject Breakdown
                </h3>
                <p className="text-gray-500 text-sm">Time spent per subject</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-48 text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-semibold">No subject data yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Start study sessions to track time per subject
              </p>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">
                  Achievements
                </h3>
                <p className="text-gray-500 text-sm">
                  {achievements.filter((a) => a.unlocked).length}/
                  {achievements.length} unlocked
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, i) => (
                <div
                  key={i}
                  className={`relative p-5 rounded-2xl border-2 transition-all ${
                    achievement.unlocked
                      ? "border-gray-200 bg-linear-to-br from-gray-50 to-white shadow-md"
                      : "border-gray-100 bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`p-3 rounded-xl mb-3 inline-block ${
                        achievement.unlocked ? "shadow-lg" : ""
                      }`}
                      style={{
                        backgroundColor: achievement.unlocked
                          ? achievement.color + "20"
                          : "#f1f5f9",
                      }}
                    >
                      <achievement.icon
                        className="w-6 h-6"
                        style={{
                          color: achievement.unlocked
                            ? achievement.color
                            : "#94a3b8",
                        }}
                      />
                    </div>
                    <h4 className="font-black text-gray-900 text-sm mb-1">
                      {achievement.label}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {achievement.description}
                    </p>

                    {!achievement.unlocked && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${achievement.progress}%`,
                              backgroundColor: achievement.color,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {Math.round(achievement.progress)}%
                        </p>
                      </div>
                    )}

                    {achievement.unlocked && (
                      <CheckCircle2
                        className="absolute top-0 right-0 w-5 h-5"
                        style={{ color: achievement.color }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Tasks */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    Upcoming Tasks
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Your study planner tasks
                  </p>
                </div>
              </div>
              <button
                onClick={() => setView(ViewMode.Planner)}
                className="text-indigo-600 font-bold text-sm hover:text-indigo-700 flex items-center gap-1"
              >
                View Planner <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-semibold">
                No tasks scheduled yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Go to the Planner to add study sessions
              </p>
              <button
                onClick={() => setView(ViewMode.Planner)}
                className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Open Planner
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  Quick Actions
                </h3>
                <p className="text-gray-500 text-sm">Jump right in</p>
              </div>
            </div>

            <div className="space-y-3">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  className="w-full group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all text-left"
                  style={{
                    background: `linear-gradient(135deg, ${action.color}10, ${action.color}05)`,
                  }}
                >
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: action.color + "20" }}
                  >
                    <action.icon
                      className="w-5 h-5"
                      style={{ color: action.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 group-hover:translate-x-1 transition-transform">
                      {action.label}
                    </h4>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Productivity Score Banner */}
        <div className="relative overflow-hidden bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-8 h-8 text-yellow-300" />
                <h3 className="text-3xl font-black text-white">
                  Productivity Champion
                </h3>
              </div>
              <p className="text-white/90 text-lg mb-6">
                You're in the top 10% of learners this week!
              </p>

              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {Math.round(productivityScore)}
                  </div>
                  <div className="text-white/80 text-sm">Score</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    2-4 PM
                  </div>
                  <div className="text-white/80 text-sm">Peak Time</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    +15%
                  </div>
                  <div className="text-white/80 text-sm">Growth</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-end">
              <Medal className="w-16 h-16 sm:w-24 sm:h-24 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
