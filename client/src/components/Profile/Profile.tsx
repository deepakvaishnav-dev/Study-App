import React, { useState } from "react";
import {
  LogOut,
  Mail,
  GraduationCap,
  Calendar,
  Trophy,
  BookOpen,
  Clock,
  Award,
  Target,
  TrendingUp,
  Star,
  Zap,
  Flame,
  Medal,
  Crown,
  ChevronRight,
  Sparkles,
  Brain,
  Coffee,
} from "lucide-react";
import { userDataService, defaultStats } from "../../services/userData";
import type { UserStats } from "../../services/userData";
import type { UserProfile } from "../../types";

interface ProfileProps {
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [profile] = useState<UserProfile | null>(
    userDataService.getUserProfile(),
  );
  const [stats, setStats] = useState<UserStats>(defaultStats);

  React.useEffect(() => {
    const fetchStats = async () => {
      const data = await userDataService.getStats();
      setStats(data);
    };
    fetchStats();
  }, []);
  const [activeTab, setActiveTab] = useState<"overview" | "achievements">(
    "overview",
  );

  if (!profile) return null;

  // Calculate derived stats
  const studyHours = Math.round(stats.totalStudyMinutes / 60);
  const avgTestScore =
    stats.totalTests > 0
      ? Math.round((stats.totalTests * 85) / stats.totalTests)
      : 0; // Mock calculation
  const studyStreak = Math.min(stats.totalNotes, 15); // Mock streak
  const level = Math.floor(stats.totalNotes / 5) + 1;
  const progressToNextLevel = (stats.totalNotes % 5) * 20;

  // Mock achievements data
  const achievements = [
    {
      id: 1,
      name: "First Steps",
      desc: "Created your first note",
      icon: Sparkles,
      unlocked: true,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Study Streak",
      desc: "7 consecutive days of studying",
      icon: Flame,
      unlocked: studyStreak >= 7,
      color: "from-orange-500 to-red-500",
    },
    {
      id: 3,
      name: "Note Master",
      desc: "Created 10 notes",
      icon: BookOpen,
      unlocked: stats.totalNotes >= 10,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 4,
      name: "Quiz Champion",
      desc: "Completed 5 tests",
      icon: Trophy,
      unlocked: stats.totalTests >= 5,
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: 5,
      name: "Time Scholar",
      desc: "10+ hours of study time",
      icon: Clock,
      unlocked: studyHours >= 10,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 6,
      name: "Brain Athlete",
      desc: "50+ study sessions",
      icon: Brain,
      unlocked: stats.totalNotes >= 50,
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header with tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 mb-2">
                Your Learning Hub
              </h1>
              <p className="text-slate-600 text-lg font-medium">
                Track progress, earn achievements, level up 🚀
              </p>
            </div>
            <button
              onClick={onLogout}
              className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Sign Out
            </button>
          </div>

          {/* Tab Navigation */}
          <div className=" gap-3 bg-white/70 backdrop-blur-xl p-2 rounded-2xl border border-white/80 shadow-lg inline-flex">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === "overview"
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === "achievements"
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Award className="w-5 h-5" />
              Achievements
              <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-black">
                {unlockedCount}
              </span>
            </button>
          </div>
        </div>

        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1 space-y-6">
              {/* Main Profile Card */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                {/* linear header */}
                <div className="h-32 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 relative">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                    <div className="w-32 h-32 bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl p-1 shadow-2xl rotate-6 hover:rotate-0 transition-transform">
                      <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center">
                        <span className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-blue-600 to-indigo-600">
                          {profile.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-20 pb-8 px-6 text-center">
                  <h2 className="text-3xl font-black text-slate-900 mb-1">
                    {profile.name}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 rounded-full mb-6">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-bold text-indigo-700">
                      {profile.grade}
                    </span>
                  </div>

                  {/* Level & XP Bar */}
                  <div className="mb-6 bg-linear-to-br from-slate-50 to-blue-50 rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-bold text-slate-700">
                          Level {level}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-500">
                        {progressToNextLevel}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 relative overflow-hidden"
                        style={{ width: `${progressToNextLevel}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                      {5 - (stats.totalNotes % 5)} notes to Level {level + 1}
                    </p>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-3 mb-6 text-left">
                    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 rounded-xl p-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium truncate">
                        {profile.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 bg-slate-50 rounded-xl p-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">
                        Joined {profile.joinedDate}
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                      <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-black text-slate-900">
                        {studyStreak}
                      </p>
                      <p className="text-xs font-bold text-orange-600">
                        Day Streak
                      </p>
                    </div>
                    <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                      <Star className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-black text-slate-900">
                        {avgTestScore}%
                      </p>
                      <p className="text-xs font-bold text-purple-600">
                        Avg Score
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivation Card */}
              <div className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNkb3RzKSIvPjwvc3ZnPg==')] opacity-50"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <Zap className="w-10 h-10 text-yellow-300" />
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                      Daily Tip
                    </div>
                  </div>
                  <h3 className="text-xl font-black mb-2">
                    Keep the Momentum!
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    You're on fire, {profile.name.split(" ")[0]}! 🔥 Remember,
                    consistency beats intensity. Even 20 minutes today keeps
                    your streak alive.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-4xl font-black text-slate-900 mb-1">
                    {stats.totalNotes}
                  </p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Total Notes
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-green-600 font-bold">
                      +12% this week
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <Target className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-4xl font-black text-slate-900 mb-1">
                    {stats.totalTests}
                  </p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Tests Taken
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 font-bold">
                      Keep practicing!
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <Coffee className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-4xl font-black text-slate-900 mb-1">
                    {studyHours}h
                  </p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Study Time
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 font-bold">
                      {stats.totalStudyMinutes} minutes total
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Achievements Preview */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">
                      Recent Achievements
                    </h3>
                    <p className="text-slate-500 text-sm font-medium">
                      {unlockedCount} of {achievements.length} unlocked
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("achievements")}
                    className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 group"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {achievements.slice(0, 3).map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={`rounded-2xl p-5 border-2 transition-all ${
                          achievement.unlocked
                            ? "bg-linear-to-br " +
                              achievement.color +
                              " border-white shadow-lg"
                            : "bg-slate-50 border-slate-200 opacity-50"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                            achievement.unlocked
                              ? "bg-white/30"
                              : "bg-slate-200"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${achievement.unlocked ? "text-white" : "text-slate-400"}`}
                          />
                        </div>
                        <h4
                          className={`font-black mb-1 ${achievement.unlocked ? "text-white" : "text-slate-600"}`}
                        >
                          {achievement.name}
                        </h4>
                        <p
                          className={`text-xs font-medium ${achievement.unlocked ? "text-white/80" : "text-slate-400"}`}
                        >
                          {achievement.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Study Insights */}
              <div className="bg-linear-to-br from-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-black mb-2">
                        Your Study Insights
                      </h3>
                      <p className="text-slate-300 text-sm">
                        Data-driven tips for better learning
                      </p>
                    </div>
                    <Brain className="w-12 h-12 text-blue-400" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="font-bold">Peak Hours</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        You study best between 3-6 PM
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="font-bold">Favorite Subject</span>
                      </div>
                      <p className="text-sm text-slate-300">
                        Science notes most created
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Achievements Tab
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">
                    Achievement Gallery
                  </h2>
                  <p className="text-slate-600 font-medium">
                    Unlock badges as you progress on your learning journey
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-orange-500">
                    {unlockedCount}/{achievements.length}
                  </div>
                  <p className="text-sm font-bold text-slate-500">Unlocked</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`rounded-3xl p-6 border-2 transition-all hover:scale-105 ${
                        achievement.unlocked
                          ? "bg-linear-to-br " +
                            achievement.color +
                            " border-white shadow-2xl cursor-pointer"
                          : "bg-slate-50 border-slate-200 opacity-60"
                      }`}
                    >
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 mx-auto ${
                          achievement.unlocked
                            ? "bg-white/30 shadow-xl"
                            : "bg-slate-200"
                        }`}
                      >
                        <Icon
                          className={`w-10 h-10 ${achievement.unlocked ? "text-white" : "text-slate-400"}`}
                        />
                      </div>
                      <h3
                        className={`text-xl font-black text-center mb-2 ${
                          achievement.unlocked ? "text-white" : "text-slate-600"
                        }`}
                      >
                        {achievement.name}
                      </h3>
                      <p
                        className={`text-sm text-center font-medium ${
                          achievement.unlocked
                            ? "text-white/90"
                            : "text-slate-400"
                        }`}
                      >
                        {achievement.desc}
                      </p>
                      {achievement.unlocked && (
                        <div className="mt-4 pt-4 border-t border-white/30">
                          <p className="text-xs text-center text-white/80 font-bold">
                            ✓ UNLOCKED
                          </p>
                        </div>
                      )}
                      {!achievement.unlocked && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-xs text-center text-slate-400 font-bold">
                            🔒 LOCKED
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Achievements */}
            <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
              <div className="flex items-center gap-3 mb-6">
                <Medal className="w-8 h-8 text-amber-600" />
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Coming Soon
                  </h3>
                  <p className="text-sm text-slate-600 font-medium">
                    More achievements are on the way!
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
                  <p className="font-bold text-slate-700">🏆 Perfect Week</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Study every day for a week
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
                  <p className="font-bold text-slate-700">📚 Bookworm</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Create 100 notes
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, 30px) rotate(-5deg); }
          66% { transform: translate(20px, -20px) rotate(5deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -40px) scale(1.1); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 20s infinite ease-in-out;
        }
        
        .animate-float-delayed {
          animation: float-delayed 25s infinite ease-in-out;
        }
        
        .animate-float-slow {
          animation: float-slow 30s infinite ease-in-out;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Profile;
