import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  Loader2,
  Calendar,
  CheckCircle2,
  Printer,
  Clock,
  Target,
  Sparkles,
  Award,
  ArrowRight,
  BookMarked,
  Zap,
  TrendingUp,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  X,
} from "lucide-react";
import { generateQuestionPaper } from "../../../geminiService";
import { userDataService } from "../../services/userData";
import { reportService } from "../../services/reportService";
import type { QuestionPaper, UserProfile } from "../../types";

const SelfAssessment: React.FC = () => {
  const [profile] = useState<UserProfile | null>(
    userDataService.getUserProfile(),
  );
  const [subject, setSubject] = useState(
    () =>
      localStorage.getItem(userDataService.getStorageKey("sa_subject")) ||
      "Science",
  );
  const [topic, setTopic] = useState(
    () => localStorage.getItem(userDataService.getStorageKey("sa_topic")) || "",
  );
  const [difficulty, setDifficulty] = useState(
    () =>
      localStorage.getItem(userDataService.getStorageKey("sa_difficulty")) ||
      "medium",
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const [assessment, setAssessment] = useState<QuestionPaper | null>(() => {
    try {
      const stored = localStorage.getItem(
        userDataService.getStorageKey("sa_assessment"),
      );
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>(
    () => {
      try {
        const stored = localStorage.getItem(
          userDataService.getStorageKey("sa_showAnswers"),
        );
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    },
  );

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >(() => {
    try {
      const stored = localStorage.getItem(
        userDataService.getStorageKey("sa_selectedAnswers"),
      );
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [showAllAnswers, setShowAllAnswers] = useState(() => {
    return (
      localStorage.getItem(
        userDataService.getStorageKey("sa_showAllAnswers"),
      ) === "true"
    );
  });

  const [isTimerRunning, setIsTimerRunning] = useState(() => {
    return (
      localStorage.getItem(
        userDataService.getStorageKey("sa_isTimerRunning"),
      ) === "true"
    );
  });

  const [timeElapsed, setTimeElapsed] = useState(() => {
    return parseInt(
      localStorage.getItem(userDataService.getStorageKey("sa_timeElapsed")) ||
        "0",
      10,
    );
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(userDataService.getStorageKey("sa_subject"), subject);
  }, [subject]);
  useEffect(() => {
    localStorage.setItem(userDataService.getStorageKey("sa_topic"), topic);
  }, [topic]);
  useEffect(() => {
    localStorage.setItem(
      userDataService.getStorageKey("sa_difficulty"),
      difficulty,
    );
  }, [difficulty]);

  useEffect(() => {
    if (assessment)
      localStorage.setItem(
        userDataService.getStorageKey("sa_assessment"),
        JSON.stringify(assessment),
      );
    else
      localStorage.removeItem(userDataService.getStorageKey("sa_assessment"));
  }, [assessment]);

  useEffect(() => {
    localStorage.setItem(
      userDataService.getStorageKey("sa_showAnswers"),
      JSON.stringify(showAnswers),
    );
  }, [showAnswers]);
  useEffect(() => {
    localStorage.setItem(
      userDataService.getStorageKey("sa_selectedAnswers"),
      JSON.stringify(selectedAnswers),
    );
  }, [selectedAnswers]);
  useEffect(() => {
    localStorage.setItem(
      userDataService.getStorageKey("sa_showAllAnswers"),
      String(showAllAnswers),
    );
  }, [showAllAnswers]);
  useEffect(() => {
    localStorage.setItem(
      userDataService.getStorageKey("sa_isTimerRunning"),
      String(isTimerRunning),
    );
  }, [isTimerRunning]);
  useEffect(() => {
    localStorage.setItem(
      userDataService.getStorageKey("sa_timeElapsed"),
      String(timeElapsed),
    );
  }, [timeElapsed]);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleCreateAssessment = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateQuestionPaper(subject, topic, difficulty);
      const newAssessment: QuestionPaper = {
        id: Date.now().toString(),
        subject,
        chapter: topic,
        difficulty,
        questions: result.questions || [],
        createdAt: new Date().toLocaleDateString(),
      };
      setAssessment(newAssessment);
      setTimeElapsed(0);
      setIsTimerRunning(true);
      setShowAnswers({});
      setSelectedAnswers({});
      setShowAllAnswers(false);
      userDataService.incrementTests();
    } catch (error) {
      console.error("Failed to generate assessment", error);
      alert("Could not generate assessment. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAnswer = (questionId: string) => {
    setShowAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const selectAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const calculateScore = () => {
    if (!assessment) return { score: 0, total: 0, percentage: 0 };
    let correct = 0;
    assessment.questions.forEach((q, idx) => {
      const qId = q.id || idx.toString();
      if (selectedAnswers[qId] === q.correctAnswer) {
        correct++;
      }
    });
    const total = assessment.questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    const weakTopics =
      assessment.questions
        .filter((q, idx) => {
          const qId = q.id || idx.toString();
          return selectedAnswers[qId] !== q.correctAnswer;
        })
        .map((q) => q.text.substring(0, 50) + "...") || [];

    return { score: correct, total, percentage, weakTopics };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "from-emerald-500 to-teal-500";
      case "medium":
        return "from-amber-500 to-orange-500";
      case "hard":
        return "from-rose-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const subjects = [
    { name: "Science", icon: "🔬", color: "from-blue-500 to-cyan-500" },
    { name: "Maths", icon: "📐", color: "from-purple-500 to-pink-500" },
    { name: "English", icon: "📖", color: "from-green-500 to-emerald-500" },
    { name: "History", icon: "🏛️", color: "from-amber-500 to-orange-500" },
    { name: "Geography", icon: "🌍", color: "from-teal-500 to-cyan-500" },
    { name: "Physics", icon: "⚛️", color: "from-indigo-500 to-purple-500" },
    { name: "Chemistry", icon: "⚗️", color: "from-pink-500 to-rose-500" },
    { name: "Biology", icon: "🧬", color: "from-lime-500 to-green-500" },
  ];

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">
          Please log in to access Self Assessment.
        </p>
      </div>
    );
  }

  const results = calculateScore();

  const handleFinishAssessment = async () => {
    if (!assessment) return;

    // Only send report if all questions are answered
    const isComplete =
      Object.keys(selectedAnswers).length === assessment.questions.length;

    if (isComplete) {
      const detailedQuestions = assessment.questions.map((q, idx) => {
        const qId = q.id || idx.toString();
        const userAnswer = selectedAnswers[qId];
        const isCorrect = userAnswer === q.correctAnswer;

        return {
          text: q.text,
          userAnswer: userAnswer || "Not Answered",
          correctAnswer: q.correctAnswer,
          isCorrect: isCorrect,
          explanation: q.explanation,
        };
      });

      await reportService.sendTestResult(profile.name, {
        subject: assessment.subject,
        score: results.score,
        total: results.total,
        percentage: String(results.percentage),
        weakTopics: results.weakTopics || [],
        timeTaken: formatTime(timeElapsed),
        questions: detailedQuestions,
      });
    }

    setAssessment(null);
    setIsTimerRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden rounded-lg">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse-slower"></div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {!assessment ? (
          <div className="space-y-12 animate-fadeIn">
            {/* Hero Header */}
            <div className="text-center space-y-6 mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-6 animate-float">
                <BrainCircuit className="w-10 h-10 text-indigo-600" />
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight">
                Assessment - Laboratory
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
                Welcome,{" "}
                <span className="font-bold text-slate-900">
                  {profile.name.split(" ")[0]}
                </span>
                . Design your perfect assessment and measure your mastery.
              </p>
            </div>

            {/* Main Creation Panel */}
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Left: Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
                  <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    Create Your Test
                  </h2>

                  <div className="space-y-6">
                    {/* Subject Selection - Card Grid */}
                    <div>
                      <label className="text-sm font-bold text-slate-500 mb-4 block uppercase tracking-wider">
                        Select Subject
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {subjects.map((subj) => (
                          <button
                            key={subj.name}
                            onClick={() => setSubject(subj.name)}
                            className={`p-4 rounded-2xl border-2 transition-all group ${
                              subject === subj.name
                                ? `bg-gradient-to-br ${subj.color} border-transparent text-white shadow-xl scale-105`
                                : "bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50"
                            }`}
                          >
                            <div className="text-3xl mb-2">{subj.icon}</div>
                            <p
                              className={`text-xs font-bold ${
                                subject === subj.name
                                  ? "text-white"
                                  : "text-slate-500"
                              }`}
                            >
                              {subj.name}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Topic Input */}
                    <div>
                      <label className="text-sm font-bold text-slate-500 mb-3 block uppercase tracking-wider">
                        Topic or Chapter
                      </label>
                      <div className="relative">
                        <BookMarked className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          placeholder="e.g., Photosynthesis, Quadratic Equations..."
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 placeholder-slate-400 font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Difficulty Selector */}
                    <div>
                      <label className="text-sm font-bold text-slate-500 mb-3 block uppercase tracking-wider">
                        Difficulty Level
                      </label>
                      <div className="grid grid-cols-3 gap-3 bg-white/5 p-2 rounded-2xl">
                        {[
                          {
                            level: "easy",
                            label: "Easy",
                            icon: "😊",
                            color: "emerald",
                          },
                          {
                            level: "medium",
                            label: "Medium",
                            icon: "🤔",
                            color: "amber",
                          },
                          {
                            level: "hard",
                            label: "Hard",
                            icon: "🔥",
                            color: "rose",
                          },
                        ].map(({ level, label, icon, color }) => (
                          <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            className={`py-4 rounded-xl text-sm font-bold transition-all ${
                              difficulty === level
                                ? `bg-${color}-500 text-white shadow-lg scale-105`
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                          >
                            <div className="text-2xl mb-1">{icon}</div>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <button
                      onClick={handleCreateAssessment}
                      disabled={isGenerating || !topic.trim()}
                      className="w-full py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-black text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                          <span className="relative z-10">
                            Crafting Your Assessment...
                          </span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-6 h-6 relative z-10" />
                          <span className="relative z-10">
                            Generate Assessment
                          </span>
                          <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Info Panel */}
              <div className="space-y-6">
                {/* Student Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {profile.name}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {profile.grade}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profile.joinedDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <Award className="w-4 h-4" />
                      <span>Assessment Level: Intermediate</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-100 shadow-xl">
                  <h3 className="text-lg font-black text-emerald-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    What You'll Get
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "AI-generated questions tailored to your topic",
                      "Instant answer verification & explanations",
                      "Timed practice with performance tracking",
                      "Print-ready assessment papers",
                    ].map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-emerald-800"
                      >
                        <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-lg">
                    <Target className="w-6 h-6 text-blue-500 mb-2" />
                    <p className="text-2xl font-black text-slate-900">87%</p>
                    <p className="text-xs text-slate-400 font-bold">
                      Avg Score
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-lg">
                    <TrendingUp className="w-6 h-6 text-emerald-500 mb-2" />
                    <p className="text-2xl font-black text-slate-900">24</p>
                    <p className="text-xs text-slate-400 font-bold">
                      Tests Done
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            {/* Assessment View */}
            <div className="max-w-5xl mx-auto">
              {/* Sticky Header Bar */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 border border-slate-200 shadow-xl mb-8 sticky top-4 z-20">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleFinishAssessment}
                      className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-700"
                    >
                      <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 flex items-center gap-3">
                        {assessment.subject} • {assessment.chapter}
                        <span
                          className={`px-2 py-0.5 rounded-lg text-xs font-bold bg-gradient-to-r ${getDifficultyColor(assessment.difficulty)} text-white shadow-lg`}
                        >
                          {assessment.difficulty.toUpperCase()}
                        </span>
                      </h2>
                      <p className="text-sm text-slate-500 font-medium">
                        {assessment.questions.length} Questions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Timer */}
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-900 font-mono font-bold">
                        {formatTime(timeElapsed)}
                      </span>
                    </div>

                    {/* Score */}
                    {Object.keys(selectedAnswers).length > 0 && (
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 rounded-xl font-bold text-white">
                        {results.score}/{results.total} ({results.percentage}%)
                      </div>
                    )}

                    {/* Actions */}
                    <button
                      onClick={() => setShowAllAnswers(!showAllAnswers)}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                    >
                      {showAllAnswers ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      {showAllAnswers ? "Hide" : "Show"} All
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-700"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Assessment Paper */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none">
                {/* Print Header */}
                <div className="hidden print:block p-8 border-b-4 border-slate-900">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-4xl font-black mb-2">
                        SELF ASSESSMENT
                      </h1>
                      <p className="text-xl font-bold text-gray-700">
                        {assessment.subject} - {assessment.chapter}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">{profile.name}</p>
                      <p className="text-gray-600">{profile.grade}</p>
                      <p className="text-gray-500 mt-1">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="font-bold">Total Questions:</span>{" "}
                      {assessment.questions.length}
                    </div>
                    <div>
                      <span className="font-bold">Difficulty:</span>{" "}
                      {assessment.difficulty}
                    </div>
                    <div>
                      <span className="font-bold">Time:</span> _____ minutes
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="p-8 md:p-12 space-y-8">
                  {assessment.questions.map((q, idx) => {
                    const qId = q.id || idx.toString();
                    const isAnswered = selectedAnswers[qId] !== undefined;
                    const isCorrect = selectedAnswers[qId] === q.correctAnswer;
                    const showAnswer = showAllAnswers || showAnswers[qId];

                    return (
                      <div
                        key={idx}
                        className="border-b-2 border-slate-100 last:border-0 pb-8 last:pb-0 print:break-inside-avoid"
                      >
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black ${
                                isAnswered
                                  ? isCorrect
                                    ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                                    : "bg-gradient-to-br from-red-500 to-rose-500 text-white"
                                  : "bg-slate-100 text-slate-400"
                              } print:bg-white print:border-2 print:border-slate-900 print:text-slate-900`}
                            >
                              {idx + 1}
                            </div>
                          </div>

                          <div className="flex-1 space-y-4">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                              {q.text}
                            </h3>

                            {q.type === "mcq" && q.options && (
                              <div className="grid grid-cols-1 gap-3 print:gap-4">
                                {q.options.map((opt, oIdx) => {
                                  const optLabel = String.fromCharCode(
                                    65 + oIdx,
                                  );
                                  const isSelected =
                                    selectedAnswers[qId] === optLabel;
                                  const isCorrectOption =
                                    q.correctAnswer === optLabel;

                                  return (
                                    <button
                                      key={oIdx}
                                      onClick={() =>
                                        selectAnswer(qId, optLabel)
                                      }
                                      disabled={showAnswer}
                                      className={`p-4 rounded-2xl border-2 transition-all text-left group print:border-slate-300 print:bg-white ${
                                        showAnswer
                                          ? isCorrectOption
                                            ? "border-green-400 bg-green-50"
                                            : isSelected
                                              ? "border-red-400 bg-red-50"
                                              : "border-slate-200 bg-slate-50 opacity-50"
                                          : isSelected
                                            ? "border-blue-500 bg-blue-50 shadow-lg"
                                            : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-black flex-shrink-0 ${
                                            showAnswer
                                              ? isCorrectOption
                                                ? "border-green-500 bg-green-500 text-white"
                                                : isSelected
                                                  ? "border-red-500 bg-red-500 text-white"
                                                  : "border-slate-300 text-slate-400"
                                              : isSelected
                                                ? "border-blue-500 bg-blue-500 text-white"
                                                : "border-slate-300 text-slate-500 group-hover:border-blue-400"
                                          } print:border-slate-900 print:bg-white print:text-slate-900`}
                                        >
                                          {showAnswer && isCorrectOption ? (
                                            <Check className="w-4 h-4" />
                                          ) : showAnswer && isSelected ? (
                                            <X className="w-4 h-4" />
                                          ) : (
                                            optLabel
                                          )}
                                        </div>
                                        <span className="text-slate-700 font-medium flex-1">
                                          {opt}
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Answer Section */}
                            <div className="print:hidden">
                              {!showAnswer ? (
                                <button
                                  onClick={() => toggleAnswer(qId)}
                                  className="text-blue-600 font-bold text-sm flex items-center gap-2 hover:text-blue-700 transition-colors mt-2 group"
                                >
                                  <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                  Reveal Answer
                                </button>
                              ) : (
                                <div className="mt-4 space-y-3">
                                  <div
                                    className={`p-4 rounded-2xl border-2 ${
                                      isCorrect
                                        ? "bg-green-50 border-green-200"
                                        : "bg-amber-50 border-amber-200"
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                          isCorrect
                                            ? "bg-green-500"
                                            : "bg-amber-500"
                                        }`}
                                      >
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <p
                                          className={`font-black mb-1 ${
                                            isCorrect
                                              ? "text-green-900"
                                              : "text-amber-900"
                                          }`}
                                        >
                                          Correct Answer: {q.correctAnswer}
                                        </p>
                                        {q.explanation && (
                                          <p
                                            className={`text-sm leading-relaxed ${
                                              isCorrect
                                                ? "text-green-800"
                                                : "text-amber-800"
                                            }`}
                                          >
                                            {q.explanation}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => toggleAnswer(qId)}
                                    className="text-slate-500 font-bold text-sm flex items-center gap-2 hover:text-slate-700 transition-colors"
                                  >
                                    <EyeOff className="w-4 h-4" />
                                    Hide Answer
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 p-6 flex flex-wrap gap-4 justify-between items-center print:hidden border-t-2 border-slate-200">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setSelectedAnswers({});
                        setShowAnswers({});
                        setShowAllAnswers(false);
                        setTimeElapsed(0);
                        setIsTimerRunning(true);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:border-slate-400 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset Test
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:border-slate-400 transition-colors"
                    >
                      <Printer className="w-5 h-5" />
                      Print
                    </button>
                  </div>

                  <button
                    onClick={handleFinishAssessment}
                    className="px-8 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Create New Assessment
                  </button>
                </div>
              </div>

              {/* Results Summary Card */}
              {Object.keys(selectedAnswers).length >=
                assessment.questions.length && (
                <div className="mt-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl print:hidden animate-slideUp">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-3xl font-black mb-2">
                        Assessment Complete! 🎉
                      </h3>
                      <p className="text-blue-100">Here's how you performed</p>
                    </div>
                    <Award className="w-12 h-12 text-yellow-300" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                      <p className="text-sm text-blue-100 mb-1">Score</p>
                      <p className="text-3xl font-black">
                        {results.percentage}%
                      </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                      <p className="text-sm text-blue-100 mb-1">Correct</p>
                      <p className="text-3xl font-black">
                        {results.score}/{results.total}
                      </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                      <p className="text-sm text-blue-100 mb-1">Time Taken</p>
                      <p className="text-3xl font-black">
                        {formatTime(timeElapsed)}
                      </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                      <p className="text-sm text-blue-100 mb-1">Performance</p>
                      <p className="text-3xl font-black">
                        {results.percentage >= 80
                          ? "A+"
                          : results.percentage >= 70
                            ? "A"
                            : results.percentage >= 60
                              ? "B"
                              : results.percentage >= 50
                                ? "C"
                                : "D"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse-slower 6s ease-in-out infinite;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @media print {
          body {
            background: white !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
};

export default SelfAssessment;
