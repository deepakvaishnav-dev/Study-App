import React, { useState } from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";
import {
  Search,
  ChevronDown,
  MessageCircle,
  FileQuestion,
  GraduationCap,
} from "lucide-react";

const faqs = [
  {
    q: "How do I print a generated Question Paper?",
    a: "Once a paper is generated, click the 'Download PDF' button in the top right corner of the Question Paper view. This will format the page for printing/saving.",
  },
  {
    q: "Why am I hitting a quota limit?",
    a: "Free accounts are limited to using the AI engine a certain number of times per day. Upgrading to Pro gives you vastly higher limits.",
  },
  {
    q: "Can I use StudySync offline?",
    a: "Currently, StudySync requires an active internet connection to generate notes and tests via our AI engine. However, tests and notes saved locally to your device can be accessed offline.",
  },
  {
    q: "How accurate are the AI notes?",
    a: "Our AI is tuned specifically for educational content. However, we always recommend verifying critical facts against your textbook, as AI can occasionally hallucinate.",
  },
];

const HelpCenter: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16 sm:pt-20">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-indigo-600 text-white py-20 px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black mb-6">
            How can we help?
          </h1>

          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search for articles, guides, or features..."
              className="w-full bg-white text-slate-900 rounded-full pl-16 pr-6 py-5 outline-none shadow-xl focus:ring-4 focus:ring-indigo-400/30 transition-shadow text-lg"
            />
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-10">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "Getting Started",
                desc: "Setting up your profile and taking your first test.",
              },
              {
                icon: FileQuestion,
                title: "Using Features",
                desc: "Deep dives into Question Papers, Notes, and Planning.",
              },
              {
                icon: MessageCircle,
                title: "Account & Billing",
                desc: "Managing passwords, emails, and Pro subscriptions.",
              },
            ].map((cat, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {cat.title}
                </h3>
                <p className="text-slate-600">{cat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-300 transition-colors shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-slate-900 text-lg pr-8">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === idx ? "rotate-180 text-indigo-600" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 mt-2">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default HelpCenter;
