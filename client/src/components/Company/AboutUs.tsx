import React from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";
import { Users, Target, Zap, Globe, Heart, Award } from "lucide-react";

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col pt-16 sm:pt-20">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl -z-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Our Mission to <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Revolutionize Learning
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              At StudySync, we believe that education should be personalized,
              accessible, and driven by the best technology available. We are
              building the ultimate AI companion for students worldwide.
            </p>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Our Core Values
              </h2>
              <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Student First",
                  desc: "Every feature we build starts with the student's needs in mind.",
                  color: "text-blue-600",
                  bg: "bg-blue-100",
                },
                {
                  icon: Target,
                  title: "Excellence",
                  desc: "We strive for academic excellence and accuracy in all our AI models.",
                  color: "text-purple-600",
                  bg: "bg-purple-100",
                },
                {
                  icon: Zap,
                  title: "Innovation",
                  desc: "Pushing the boundaries of what's possible with EdTech.",
                  color: "text-amber-600",
                  bg: "bg-amber-100",
                },
                {
                  icon: Globe,
                  title: "Accessibility",
                  desc: "Making quality education tools available to everyone, everywhere.",
                  color: "text-emerald-600",
                  bg: "bg-emerald-100",
                },
                {
                  icon: Heart,
                  title: "Empathy",
                  desc: "Understanding the stress and challenges students face daily.",
                  color: "text-rose-600",
                  bg: "bg-rose-100",
                },
                {
                  icon: Award,
                  title: "Quality",
                  desc: "Delivering the highest standard of educational resources.",
                  color: "text-indigo-600",
                  bg: "bg-indigo-100",
                },
              ].map((value, idx) => (
                <div
                  key={idx}
                  className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-14 h-14 ${value.bg} ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl animate-blob" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "1M+", label: "Active Students" },
                { number: "5M+", label: "Notes Generated" },
                { number: "10K+", label: "Schools using it" },
                { number: "99%", label: "Satisfaction Rate" },
              ].map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-slate-400 font-medium tracking-wide uppercase text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default AboutUs;
