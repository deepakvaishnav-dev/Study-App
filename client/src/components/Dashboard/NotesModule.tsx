import React, { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Brain,
  Download,
  BookMarked,
  MoreVertical,
  Upload,
  Sparkles,
  Loader2,
  AlertCircle,
  Clock,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  Check,
  Filter,
  SortDesc,
  Eye,
  Calendar,
  Tag,
} from "lucide-react";
import type { Note } from "../../types";
import {
  generateAINotes,
  getQuotaStatus,
  onQuotaStatusChange,
  resetQuotaStatus,
} from "../../../geminiService";
import { userDataService } from "../../services/userData";
import { noteService } from "../../services/noteService";

interface NotesModuleProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  onRead: (note: Note) => void;
}

const NotesModule: React.FC<NotesModuleProps> = ({
  notes,
  setNotes,
  onRead,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("Science");
  const [filter, setFilter] = useState("");
  const [quotaStatus, setQuotaStatus] = useState(getQuotaStatus());
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title" | "subject">("date");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleResetQuota = () => {
    if (
      confirm(
        "Only reset if you have updated your API key (or if using a different one). Continue?",
      )
    ) {
      resetQuotaStatus();
      setError(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onQuotaStatusChange(() => {
      setQuotaStatus(getQuotaStatus());
    });

    const interval = setInterval(() => {
      setQuotaStatus(getQuotaStatus());
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to generate notes.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const content = await generateAINotes(topic, subject);

      const newNoteData = {
        title: topic,
        content: content || "No content generated.",
        subject,
        chapter: "AI Generated",
        type: "ai" as const,
        tags: ["AI Generated", subject],
        isBookmarked: false,
      };

      const createdNote = await noteService.create(newNoteData);
      setNotes([createdNote, ...notes]);
      userDataService.incrementNotes();
      setTopic("");
      setError(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Error generating notes:", errorMessage);

      if (errorMessage.includes("QUOTA_EXHAUSTED")) {
        setError(
          "Daily quota exceeded. Please wait for reset or upgrade your plan.",
        );
        setQuotaStatus(getQuotaStatus());
      } else if (errorMessage.includes("RATE_LIMITED")) {
        setError(
          "You're making requests too quickly. Please wait a moment and try again.",
        );
      } else if (errorMessage.includes("API_KEY_MISSING")) {
        setError(
          "API key is missing. Please add VITE_API_KEY to your .env file.",
        );
      } else if (
        errorMessage.includes("leaked") ||
        errorMessage.includes("PERMISSION_DENIED")
      ) {
        setError(
          "Your API key has been compromised. Please generate a new key at Google AI Studio and update your .env file.",
        );
      } else if (
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError")
      ) {
        setError(
          "Network connection error. Please check your internet and try again.",
        );
      } else {
        setError(
          "Failed to generate notes. Please check your API key and try again.",
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setError(null);
      setTimeout(() => {
        const newNote: Note = {
          id: Date.now().toString(),
          title: file.name,
          content:
            "Uploaded file preview not available in this demo. Imagine the PDF content here.",
          subject: "General",
          chapter: "Uploaded",
          type: file.type.includes("pdf") ? "pdf" : "image",
          date: new Date().toLocaleDateString(),
          tags: ["Manual Upload"],
          isBookmarked: false,
        };
        setNotes([newNote, ...notes]);
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setActiveDropdown(null);
  };

  const handleSaveEdit = async () => {
    if (editingNote) {
      try {
        const updatedFromServer = await noteService.update(editingNote.id, {
          title: editTitle,
          content: editContent,
        });

        const updatedNotes = notes.map((n) =>
          n.id === editingNote.id ? updatedFromServer : n,
        );
        setNotes(updatedNotes);
        setEditingNote(null);
        setEditTitle("");
        setEditContent("");
      } catch (err) {
        console.error("Failed to save note edit", err);
        setError("Failed to save note edit");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleDelete = async (noteId: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await noteService.delete(noteId);
        const updatedNotes = notes.filter((n) => n.id !== noteId);
        setNotes(updatedNotes);
        setActiveDropdown(null);
      } catch (err) {
        console.error("Failed to delete note", err);
        setError("Failed to delete note");
      }
    }
  };

  const handleToggleBookmark = async (noteId: string) => {
    const noteToUpdate = notes.find((n) => n.id === noteId);
    if (!noteToUpdate) return;

    try {
      const updatedFromServer = await noteService.update(noteId, {
        isBookmarked: !noteToUpdate.isBookmarked,
      });

      const updatedNotes = notes.map((n) =>
        n.id === noteId ? updatedFromServer : n,
      );
      setNotes(updatedNotes);
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
      // Optional: show error message
    }
  };

  const toggleDropdown = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === noteId ? null : noteId);
  };

  const filteredNotes = notes
    .filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(filter.toLowerCase()) ||
        n.subject.toLowerCase().includes(filter.toLowerCase()) ||
        n.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase()));
      const matchesSubject =
        filterSubject === "all" || n.subject === filterSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else {
        return a.subject.localeCompare(b.subject);
      }
    });

  const uniqueSubjects = ["all", ...new Set(notes.map((n) => n.subject))];

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
              Study Materials
            </h2>
            <p className="text-gray-500 text-sm">
              {notes.length} {notes.length === 1 ? "note" : "notes"} in your
              library
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notes, subjects, tags..."
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full md:w-72 transition-all"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <label className="flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all cursor-pointer shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300">
              <Upload className="w-4 h-4" />
              Upload
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,image/*"
              />
            </label>
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-linear-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Filter:</span>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject === "all" ? "All Subjects" : subject}
                </option>
              ))}
            </select>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <SortDesc className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "title" | "subject")
              }
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              <option value="date">Date Added</option>
              <option value="title">Title (A-Z)</option>
              <option value="subject">Subject</option>
            </select>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">View:</span>
            <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-all ${
                  viewMode === "grid"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-all ${
                  viewMode === "list"
                    ? "bg-indigo-100 text-indigo-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
                  <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
                  <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top duration-300">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Quota Status Warning */}
      {quotaStatus.isExhausted && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-amber-900 mb-1">
                Daily Quota Exceeded
              </h4>
              <p className="text-sm text-amber-800 mb-3">
                Your free tier API quota has been exhausted. The quota will
                reset in approximately{" "}
                <strong>{quotaStatus.hoursUntilReset} hours</strong>.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://ai.google.dev/gemini-api/docs/rate-limits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Learn about quotas
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-amber-400">•</span>
                <a
                  href="https://ai.google.dev/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Upgrade plan
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-amber-400">•</span>
                <button
                  onClick={handleResetQuota}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                >
                  Reset (Debug)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Generator Box */}
      <div className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">AI Notes Generator</h3>
          </div>
          <p className="text-white/90 mb-6 max-w-2xl text-lg">
            Enter any topic and watch as our advanced AI researches and
            summarizes key concepts in simple, exam-focused language.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="E.g., Quantum Mechanics, Photosynthesis, World War II..."
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 placeholder-white/60 text-white focus:bg-white/20 focus:border-white/40 outline-none transition-all text-lg"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => {
                if (
                  e.key === "Enter" &&
                  !quotaStatus.isExhausted &&
                  !isGenerating
                ) {
                  handleGenerate();
                }
              }}
            />
            <select
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-white focus:bg-white/20 focus:border-white/40 outline-none cursor-pointer transition-all font-medium"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option className="text-gray-900" value="Science">
                Science
              </option>
              <option className="text-gray-900" value="History">
                History
              </option>
              <option className="text-gray-900" value="Maths">
                Maths
              </option>
              <option className="text-gray-900" value="English">
                English
              </option>
            </select>
            <button
              onClick={handleGenerate}
              disabled={
                isGenerating || !topic.trim() || quotaStatus.isExhausted
              }
              className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : quotaStatus.isExhausted ? (
                <>
                  <Clock className="w-5 h-5" />
                  Quota Exceeded
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {isUploading && (
          <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-indigo-300 flex flex-col items-center justify-center gap-3 animate-pulse">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium text-gray-500">
              Uploading note...
            </p>
          </div>
        )}
        {filteredNotes.length === 0 && !isUploading && (
          <div className="col-span-full text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
              <FileText className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filter || filterSubject !== "all"
                ? "No matching notes found"
                : "No notes yet"}
            </h3>
            <p className="text-gray-500">
              {filter || filterSubject !== "all"
                ? "Try adjusting your filters or search terms"
                : "Generate AI notes or upload your study materials to get started"}
            </p>
          </div>
        )}
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all group overflow-hidden ${
              viewMode === "list" ? "flex" : ""
            }`}
          >
            <div className={`${viewMode === "list" ? "flex-1" : ""} p-5`}>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110
                  ${
                    note.type === "ai"
                      ? "bg-linear-to-br from-purple-100 to-pink-100 text-purple-600"
                      : "bg-linear-to-br from-blue-100 to-indigo-100 text-blue-600"
                  }
                `}
                >
                  {note.type === "ai" ? (
                    <Brain className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleBookmark(note.id)}
                    className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-all"
                  >
                    <BookMarked
                      className={`w-5 h-5 ${
                        note.isBookmarked
                          ? "fill-yellow-500 text-yellow-500"
                          : ""
                      }`}
                    />
                  </button>
                  <div className="relative">
                    <button
                      onClick={(e) => toggleDropdown(note.id, e)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeDropdown === note.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                        <button
                          onClick={() => handleEdit(note)}
                          className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Note
                        </button>
                        <button
                          onClick={() => onRead(note)}
                          className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Full Note
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Note
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 line-clamp-2 mb-2 text-lg group-hover:text-indigo-600 transition-colors">
                {note.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-4">
                <Tag className="w-3.5 h-3.5" />
                <span>{note.subject}</span>
                <span>•</span>
                <Calendar className="w-3.5 h-3.5" />
                <span>{note.date}</span>
              </div>

              {viewMode === "list" && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {note.content.substring(0, 150)}...
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg text-[11px] font-bold uppercase tracking-wide border border-indigo-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div
              className={`border-t border-gray-100 p-4 bg-linear-to-br from-gray-50 to-indigo-50/30 flex items-center gap-2 ${
                viewMode === "list" ? "border-t-0 border-l w-48" : ""
              }`}
            >
              <button
                onClick={() => onRead(note)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 text-sm font-bold py-2.5 px-4 rounded-xl hover:bg-linear-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all shadow-sm hover:shadow-md"
              >
                Read
              </button>
              <button className="p-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all shadow-sm hover:shadow-md">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Edit3 className="w-6 h-6" />
                  Edit Note
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto overscroll-contain">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all"
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Check className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesModule;
