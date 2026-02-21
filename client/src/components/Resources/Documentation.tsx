import React from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";
import { Book, Code, Terminal, Zap, FileText, Server } from "lucide-react";

const Documentation: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16 sm:pt-20">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full mb-6 text-indigo-700 font-bold text-sm">
            <Book className="w-4 h-4" />
            StudySync Developer Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
            Documentation
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to integrate StudySync's powerful AI learning
            engine into your own platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Zap,
              title: "Quickstart",
              desc: "Get up and running with our API within minutes.",
              color: "text-amber-500",
              bg: "bg-amber-50",
            },
            {
              icon: Code,
              title: "API Reference",
              desc: "Complete documentation for all endpoints.",
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              icon: Terminal,
              title: "SDKs & Tools",
              desc: "Libraries for JS, Python, Go, and more.",
              color: "text-purple-500",
              bg: "bg-purple-50",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div
                className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <card.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-slate-600">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full filter blur-[80px]" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Core Concepts</h2>
              <p className="text-slate-400 mb-8 max-w-lg">
                Understand the mental model behind StudySync. Learn about Notes,
                Study Sessions, Test Reports, and Question Paper generation
                workflows.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: FileText, label: "Note Generation Engine" },
                  { icon: Book, label: "Question Paper Synthesis" },
                  { icon: Server, label: "Webhooks & Events" },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <item.icon className="w-5 h-5 text-indigo-400" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 w-full relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex gap-2 mb-4 border-b border-slate-700 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <pre className="text-sm font-mono text-indigo-300 overflow-x-auto">
                  {`curl -X POST https://api.studysync.app/v1/generate
  -H "Authorization: Bearer YOUR_API_KEY"
  -H "Content-Type: application/json"
  -d '{
    "subject": "Physics",
    "topic": "Quantum Mechanics",
    "difficulty": "advanced"
  }'`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default Documentation;
