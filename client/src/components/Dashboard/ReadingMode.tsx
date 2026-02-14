import React, { useState } from "react";
import {
  ArrowLeft,
  Moon,
  Sun,
  Type,
  Plus,
  Minus,
  Bookmark,
} from "lucide-react";
import type { Note } from "../../types";

interface ReadingModeProps {
  note: Note;
  onBack: () => void;
}

const ReadingMode: React.FC<ReadingModeProps> = ({ note, onBack }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  return (
    <div
      className={`fixed inset-0 z-100 transition-colors duration-300 overflow-y-auto ${darkMode ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"}`}
    >
      {/* Reader Header */}
      <header
        className={`sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between no-print ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`p-2 rounded-xl transition-colors ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">{note.title}</h1>
            <p className="text-xs opacity-60 font-medium">
              {note.subject} • Chapter 1
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100/10 rounded-xl p-1 no-print">
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200 text-gray-900"}`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <div
              className={`px-2 flex items-center gap-1 ${darkMode ? "" : "text-gray-900"}`}
            >
              <Type className="w-4 h-4" />
              <span className="text-xs font-bold">{fontSize}px</span>
            </div>
            <button
              onClick={() => setFontSize(Math.min(32, fontSize + 2))}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200 text-gray-900"}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-xl transition-colors ${darkMode ? "bg-gray-800 text-yellow-400" : "bg-gray-100 text-gray-600"}`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            className={`p-3 rounded-xl transition-colors hidden sm:block ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button
            onClick={() => window.print()}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all hidden sm:block"
          >
            Print
          </button>
        </div>
      </header>

      {/* Reader Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="prose prose-slate max-w-none"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: 1.6,
            color: "inherit",
          }}
        >
          {/* Simple Markdown Parser/Display */}
          {note.content.split("\n").map((line, i) => {
            if (line.startsWith("# "))
              return (
                <h1
                  key={i}
                  className="text-4xl font-black mb-8 mt-4 tracking-tight"
                >
                  {line.replace("# ", "")}
                </h1>
              );
            if (line.startsWith("## "))
              return (
                <h2
                  key={i}
                  className="text-2xl font-extrabold mb-6 mt-10 tracking-tight border-b-2 border-indigo-500/20 pb-2"
                >
                  {line.replace("## ", "")}
                </h2>
              );
            if (line.startsWith("### "))
              return (
                <h3 key={i} className="text-xl font-bold mb-4 mt-8">
                  {line.replace("### ", "")}
                </h3>
              );
            if (line.startsWith("- ") || line.startsWith("* "))
              return (
                <li key={i} className="ml-4 mb-2">
                  {line.substring(2)}
                </li>
              );
            if (line.trim() === "") return <br key={i} />;
            return (
              <p key={i} className="mb-4 opacity-90">
                {line}
              </p>
            );
          })}
        </div>

        <div className="mt-20 pt-10 border-t border-gray-500/10 text-center text-sm opacity-50 font-medium no-print">
          End of Notes • Generated by StudySync AI
        </div>
      </main>

      {/* Floating Reader Controls (Mobile Only) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 sm:hidden no-print">
        <button className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center">
          <Bookmark className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ReadingMode;
