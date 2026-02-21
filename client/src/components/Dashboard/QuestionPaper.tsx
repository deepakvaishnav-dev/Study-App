import React, { useState, useEffect } from "react";
import {
  Plus,
  BrainCircuit,
  Download,
  Loader2,
  Clock,
  ExternalLink,
  Sparkles,
  Target,
  Zap,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Award,
} from "lucide-react";
import {
  getQuotaStatus,
  onQuotaStatusChange,
  resetQuotaStatus,
  generateQuestionPaper,
} from "../../../geminiService";
import { userDataService } from "../../services/userData";
import { reportService } from "../../services/reportService";
import type { QuestionPaper } from "../../types";

const QuestionPaperGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [subject, setSubject] = useState("Science");
  const [chapter, setChapter] = useState(
    () =>
      localStorage.getItem(
        userDataService.getStorageKey("studysync_paper_topic"),
      ) || "",
  );
  const [difficulty, setDifficulty] = useState("medium");
  const [currentPaper, setCurrentPaper] = useState<QuestionPaper | null>(() => {
    try {
      const stored = localStorage.getItem(
        userDataService.getStorageKey("studysync_current_paper"),
      );
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Interactive Mode State
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Record<string, boolean>>({}); // For descriptive questions check
  const [showResults, setShowResults] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<
    Record<string, boolean>
  >({}); // For descriptive

  // Persist state
  useEffect(() => {
    if (currentPaper) {
      localStorage.setItem(
        userDataService.getStorageKey("studysync_current_paper"),
        JSON.stringify(currentPaper),
      );
    } else {
      localStorage.removeItem(
        userDataService.getStorageKey("studysync_current_paper"),
      );
    }
  }, [currentPaper]);

  useEffect(() => {
    localStorage.setItem(
      userDataService.getStorageKey("studysync_paper_topic"),
      chapter,
    );
  }, [chapter]);

  const [quotaStatus, setQuotaStatus] = useState(getQuotaStatus());

  useEffect(() => {
    const unsubscribe = onQuotaStatusChange(() => {
      setQuotaStatus(getQuotaStatus());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleResetQuota = () => {
    if (
      confirm(
        "Only reset if you have updated your API key (or if using a different one). Continue?",
      )
    ) {
      resetQuotaStatus();
    }
  };

  const handleGenerate = async () => {
    if (!chapter.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateQuestionPaper(subject, chapter, difficulty);
      const newPaper: QuestionPaper = {
        id: Date.now().toString(),
        subject,
        chapter,
        difficulty,
        questions: result.questions || [],
        createdAt: new Date().toLocaleDateString(),
      };
      setCurrentPaper(newPaper);
      userDataService.incrementTests();
      userDataService.addStudyHours(15); // Assume 15 mins per test
    } catch (error) {
      console.error(error);
      const msg = (error as Error)?.message || String(error);
      if (msg.includes("QUOTA_EXHAUSTED")) {
        alert("Daily Quota Exhausted. Please check the warning above.");
      } else {
        alert("Error generating question paper: " + msg);
      }
    }
  };

  const calculateScore = () => {
    if (!currentPaper) return { score: 0, total: 0, percentage: 0 };

    let correct = 0;
    const questions = currentPaper.questions;

    questions.forEach((q, idx) => {
      const qId = q.id || idx.toString();

      if (q.type === "mcq") {
        if (userAnswers[qId] === q.correctAnswer) {
          correct++;
        }
      } else {
        // For descriptive, check if user marked it as correct
        if (evaluations[qId] === true) {
          correct++;
        }
      }
    });

    const total = questions.length;
    const percentage = Math.round((correct / total) * 100);
    return { score: correct, total, percentage };
  };

  const handleSubmitAssessment = async () => {
    if (!currentPaper) return;

    setShowResults(true);
    const { score, total, percentage } = calculateScore();

    // Identify weak topics (incorrect MCQs or unmarked descriptive)
    const weakTopics =
      currentPaper.questions
        .filter((q, idx) => {
          const qId = q.id || idx.toString();
          if (q.type === "mcq") return userAnswers[qId] !== q.correctAnswer;
          return evaluations[qId] !== true;
        })
        .map((q) => q.text.substring(0, 50) + "...") || [];

    // Prepare detailed questions for report
    const detailedQuestions = currentPaper.questions.map((q, idx) => {
      const qId = q.id || idx.toString();
      const userAnswer =
        q.type === "mcq"
          ? userAnswers[qId]
          : evaluations[qId]
            ? "Correct (Self-evaluated)"
            : "Incorrect (Self-evaluated)";
      const isCorrect =
        q.type === "mcq"
          ? userAnswers[qId] === q.correctAnswer
          : evaluations[qId] === true;

      return {
        text: q.text,
        userAnswer: userAnswer || "Not Answered",
        correctAnswer: q.correctAnswer || "Refer to explanation",
        isCorrect: isCorrect,
        explanation: q.explanation,
      };
    });

    // Calculate approx time taken based on creation ID (timestamp)
    let timeTaken = "N/A";
    if (currentPaper.id && !isNaN(parseInt(currentPaper.id))) {
      const start = parseInt(currentPaper.id);
      const end = Date.now();
      const mins = Math.round((end - start) / 60000);
      timeTaken = `${mins} minutes`;
    }

    // console.log("[QuestionPaper] Detailed Questions:", detailedQuestions);

    const testDetails = {
      subject: currentPaper.subject,
      score,
      total,
      totalQuestions: total,
      percentage: percentage,
      weakTopics,
      timeTaken,
      questions: detailedQuestions,
      detailedReport: JSON.stringify(detailedQuestions),
    };

    try {
      await reportService.saveTestResultToDB(testDetails);
    } catch (error) {
      console.error("Failed to save test result:", error);
    }

    // Send Email
    await reportService.sendTestResult(
      userDataService.getUserProfile()?.name || "Student",
      testDetails,
    );
  };

  const subjects = [
    { value: "Science", icon: "🔬", color: "from-blue-500 to-cyan-500" },
    { value: "Maths", icon: "📐", color: "from-purple-500 to-pink-500" },
    { value: "English", icon: "📚", color: "from-green-500 to-emerald-500" },
    { value: "History", icon: "🏛️", color: "from-amber-500 to-orange-500" },
    { value: "Physics", icon: "⚛️", color: "from-indigo-500 to-blue-500" },
    { value: "Chemistry", icon: "🧪", color: "from-pink-500 to-rose-500" },
  ];

  const difficulties = [
    { value: "easy", label: "Easy", icon: Target, color: "emerald" },
    { value: "medium", label: "Medium", icon: Zap, color: "amber" },
    { value: "hard", label: "Hard", icon: Award, color: "red" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3, h4, .display {
          font-family: 'Space Grotesk', sans-serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .shimmer-bg {
          background: linear-linear(90deg, transparent, rgba(255,255,255,0.8), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        .glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.9);
        }
        
        .linear-border {
          position: relative;
          background: white;
        }
        
        .linear-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-linear(135deg, #667eea 0%, #764ba2 100%);
          -webkit-mask: linear-linear(#fff 0 0) content-box, linear-linear(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .linear-border:hover::before {
          opacity: 1;
        }
        
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .print-break { page-break-after: always; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quota Status Warning */}
        {quotaStatus.isExhausted && (
          <div className="animate-fadeIn">
            <div className="glass rounded-2xl p-6 border-2 border-amber-200 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-amber-900 mb-2">
                    Daily Quota Exceeded
                  </h4>
                  <p className="text-amber-800 mb-4 leading-relaxed">
                    Your free tier API quota has been exhausted. The quota will
                    reset in approximately{" "}
                    <strong className="font-bold">
                      {quotaStatus.hoursUntilReset} hours
                    </strong>
                    .
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://ai.google.dev/gemini-api/docs/rate-limits"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2 rounded-xl font-semibold text-sm transition-all"
                    >
                      Learn about quotas
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={handleResetQuota}
                      className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-900 px-4 py-2 rounded-xl font-semibold text-sm border-2 border-amber-200 transition-all"
                    >
                      Reset Quota
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!currentPaper ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <header className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 mb-4">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-slate-700">
                  AI-Powered Test Generator
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight">
                Question Paper
                <span className="block bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Generator
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Create personalized practice tests tailored to your subject,
                topic, and difficulty level. Powered by advanced AI to help you
                prepare smarter.
              </p>
            </header>

            {/* Main Form */}
            <div className="max-w-5xl mx-auto">
              <div className="glass rounded-3xl p-8 sm:p-12 shadow-2xl">
                {/* Subject Selection */}
                <div className="mb-10">
                  <label className=" text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Select Subject
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {subjects.map((subj) => (
                      <button
                        key={subj.value}
                        onClick={() => setSubject(subj.value)}
                        className={`group relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 ${
                          subject === subj.value
                            ? "border-indigo-500 bg-white shadow-lg scale-105"
                            : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-linear-to-br ${subj.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                        />
                        <div className="relative text-center space-y-2">
                          <div className="text-3xl">{subj.icon}</div>
                          <div className="text-sm font-bold text-slate-900">
                            {subj.value}
                          </div>
                        </div>
                        {subject === subj.value && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-5 h-5 text-indigo-600 fill-indigo-100" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Input */}
                <div className="mb-10">
                  <label className=" text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Topic or Chapter Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., Periodic Table, Quadratic Equations, Photosynthesis..."
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-lg outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
                      value={chapter}
                      onChange={(e) => setChapter(e.target.value)}
                    />
                    {chapter && (
                      <button
                        onClick={() => setChapter("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5 text-slate-400 rotate-45" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div className="mb-10">
                  <label className=" text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {difficulties.map((diff) => {
                      const Icon = diff.icon;
                      return (
                        <button
                          key={diff.value}
                          onClick={() => setDifficulty(diff.value)}
                          className={`group relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 ${
                            difficulty === diff.value
                              ? `border-${diff.color}-500 bg-${diff.color}-50 shadow-lg scale-105`
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                          }`}
                        >
                          <div className="text-center space-y-3">
                            <Icon
                              className={`w-8 h-8 mx-auto ${
                                difficulty === diff.value
                                  ? `text-${diff.color}-600`
                                  : "text-slate-400 group-hover:text-slate-600"
                              }`}
                            />
                            <div
                              className={`text-lg font-bold ${
                                difficulty === diff.value
                                  ? `text-${diff.color}-900`
                                  : "text-slate-700"
                              }`}
                            >
                              {diff.label}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Info & Generate Button */}
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-100">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="shrink-0">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                        <BrainCircuit className="w-10 h-10 text-indigo-600" />
                      </div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        AI-Powered Question Selection
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        Our intelligent system analyzes curriculum standards and
                        learning patterns to generate the most relevant
                        questions for your study goals.
                      </p>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={
                        isGenerating || !chapter || quotaStatus.isExhausted
                      }
                      className="shrink-0 group relative overflow-hidden bg-linear-to-r from-indigo-600 to-purple-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                      <div className="relative flex items-center gap-3">
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Generating...
                          </>
                        ) : quotaStatus.isExhausted ? (
                          <>
                            <Clock className="w-6 h-6" />
                            Quota Exceeded
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-6 h-6" />
                            Generate Paper
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200">
                  {[
                    {
                      icon: Target,
                      label: "Custom Difficulty",
                      desc: "Tailored to your level",
                    },
                    {
                      icon: Sparkles,
                      label: "AI Generated",
                      desc: "Smart question selection",
                    },
                    {
                      icon: Download,
                      label: "Print Ready",
                      desc: "Download as PDF",
                    },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <feature.icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          {feature.label}
                        </div>
                        <div className="text-sm text-slate-600">
                          {feature.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            {/* Action Bar */}
            <div className="no-print flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <button
                onClick={() => setCurrentPaper(null)}
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors px-4 py-2 hover:bg-indigo-50 rounded-xl"
              >
                <Plus className="w-5 h-5 rotate-45" />
                Generate Another
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Question Paper */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
              {/* Header */}
              <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-8 sm:p-12 text-center">
                <div className="max-w-3xl mx-auto space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                    Practice Question Paper
                  </h1>
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-semibold">
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                      <BookOpen className="w-4 h-4" />
                      <span>{currentPaper.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                      <Target className="w-4 h-4" />
                      <span>{currentPaper.chapter}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
                      <Zap className="w-4 h-4" />
                      <span className="capitalize">
                        {currentPaper.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="text-indigo-100 text-sm">
                    Generated on {currentPaper.createdAt}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 sm:p-12 space-y-12">
                {/* Section 1: MCQs */}
                {currentPaper.questions.filter((q) => q.type === "mcq").length >
                  0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-indigo-100">
                      <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        A
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Multiple Choice Questions
                      </h2>
                    </div>

                    <div className="space-y-10">
                      {currentPaper.questions
                        .filter((q) => q.type === "mcq")
                        .map((q, idx) => (
                          <div key={idx} className="space-y-4">
                            <div className="flex gap-4">
                              <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              <p className="text-lg font-semibold text-slate-900 leading-relaxed">
                                {q.text}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
                              {q.options?.map((opt, oIdx) => {
                                const qId = q.id || idx.toString();
                                const optLabel = String.fromCharCode(65 + oIdx);
                                const isSelected =
                                  userAnswers[qId] === optLabel;
                                const isCorrect = q.correctAnswer === optLabel;

                                let borderClass =
                                  "border-slate-200 bg-slate-50";
                                if (showResults) {
                                  if (isCorrect)
                                    borderClass =
                                      "border-green-500 bg-green-50";
                                  else if (isSelected && !isCorrect)
                                    borderClass = "border-red-500 bg-red-50";
                                } else if (isSelected) {
                                  borderClass =
                                    "border-indigo-500 bg-indigo-50";
                                }

                                return (
                                  <button
                                    key={oIdx}
                                    onClick={() =>
                                      !showResults &&
                                      setUserAnswers((prev) => ({
                                        ...prev,
                                        [qId]: optLabel,
                                      }))
                                    }
                                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-colors text-left ${borderClass} ${!showResults && "hover:border-indigo-300"}`}
                                  >
                                    <span
                                      className={`shrink-0 w-6 h-6 border-2 rounded-full flex items-center justify-center text-xs font-bold ${
                                        showResults && isCorrect
                                          ? "bg-green-500 border-green-500 text-white"
                                          : showResults &&
                                              isSelected &&
                                              !isCorrect
                                            ? "bg-red-500 border-red-500 text-white"
                                            : isSelected
                                              ? "bg-indigo-600 border-indigo-600 text-white"
                                              : "bg-white border-slate-300 text-slate-600"
                                      }`}
                                    >
                                      {optLabel}
                                    </span>
                                    <span className="text-slate-700">
                                      {opt}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                )}

                {/* Section 2: Descriptive */}
                {currentPaper.questions.filter((q) => q.type !== "mcq").length >
                  0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-purple-100">
                      <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        B
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Descriptive Questions
                      </h2>
                    </div>

                    <div className="space-y-10">
                      {currentPaper.questions
                        .filter((q) => q.type !== "mcq")
                        .map((q, idx) => (
                          <div key={idx} className="space-y-6">
                            <div className="flex gap-4">
                              <span className="shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              <p className="text-lg font-semibold text-slate-900 leading-relaxed">
                                {q.text}
                              </p>
                            </div>

                            {/* Answer Space - Interactive */}
                            <div className="pl-12 space-y-4 no-print">
                              <textarea
                                className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-purple-500 outline-none h-32 resize-none"
                                placeholder="Type your answer here..."
                                value={
                                  userAnswers[q.id || idx.toString()] || ""
                                }
                                onChange={(e) =>
                                  !showResults &&
                                  setUserAnswers((prev) => ({
                                    ...prev,
                                    [q.id || idx.toString()]: e.target.value,
                                  }))
                                }
                                disabled={showResults}
                              />

                              <div className="flex gap-3">
                                <button
                                  onClick={() =>
                                    setRevealedAnswers((prev) => ({
                                      ...prev,
                                      [q.id || idx.toString()]: true,
                                    }))
                                  }
                                  className="text-sm font-bold text-purple-600 hover:text-purple-700"
                                >
                                  {revealedAnswers[q.id || idx.toString()]
                                    ? "Hide Answer Key"
                                    : "Reveal Answer Key"}
                                </button>
                              </div>

                              {revealedAnswers[q.id || idx.toString()] && (
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 animate-fadeIn">
                                  <p className="font-bold text-purple-900 mb-2">
                                    Model Answer / Key Points:
                                  </p>
                                  <p className="text-purple-800">
                                    {q.explanation ||
                                      q.correctAnswer ||
                                      "No model answer provided."}
                                  </p>

                                  {!showResults && (
                                    <div className="mt-4 flex gap-3">
                                      <p className="text-sm font-bold text-slate-500 py-2">
                                        Did you get it right?
                                      </p>
                                      <button
                                        onClick={() =>
                                          setEvaluations((prev) => ({
                                            ...prev,
                                            [q.id || idx.toString()]: true,
                                          }))
                                        }
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${evaluations[q.id || idx.toString()] === true ? "bg-green-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-green-50"}`}
                                      >
                                        Yes, Correct
                                      </button>
                                      <button
                                        onClick={() =>
                                          setEvaluations((prev) => ({
                                            ...prev,
                                            [q.id || idx.toString()]: false,
                                          }))
                                        }
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${evaluations[q.id || idx.toString()] === false ? "bg-red-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-red-50"}`}
                                      >
                                        No, Needs Work
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            {/* Print Lines Placeholder */}
                            <div className="pl-12 space-y-3 hidden print:block">
                              {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-px bg-slate-200" />
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                )}
              </div>

              <div className="bg-slate-50 p-8 text-center border-t border-slate-200">
                {!showResults && (
                  <div className="mb-8 no-print">
                    <button
                      onClick={handleSubmitAssessment}
                      className="px-12 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                      Submit & Check Score
                    </button>
                    <p className="mt-4 text-slate-500 text-sm">
                      Evaluate your answers, get your score, and receive an
                      email report.
                    </p>
                  </div>
                )}

                {showResults && (
                  <div className="mx-auto max-w-4xl mb-8 bg-linear-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl animate-fade-in-up no-print text-left">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h2 className="text-3xl font-black mb-2">
                          Assessment Complete!
                        </h2>
                        <p className="text-indigo-100 mb-6">
                          Your results have been emailed to your registered
                          addresses.
                        </p>

                        <div className="flex gap-4">
                          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 min-w-25">
                            <div className="text-sm opacity-80 mb-1">Score</div>
                            <div className="text-3xl font-black">
                              {calculateScore().score}/{calculateScore().total}
                            </div>
                          </div>
                          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 min-w-25">
                            <div className="text-sm opacity-80 mb-1">
                              Percentage
                            </div>
                            <div className="text-3xl font-black">
                              {calculateScore().percentage}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-full p-8">
                        <Award className="w-16 h-16 text-yellow-300" />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowResults(false);
                        setUserAnswers({});
                        setEvaluations({});
                        setRevealedAnswers({});
                        setCurrentPaper(null);
                      }}
                      className="mt-8 px-8 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
                    >
                      Generate Another Paper
                    </button>
                  </div>
                )}

                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8">
                  Generated by StudySync AI • For Educational Use Only
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPaperGenerator;
