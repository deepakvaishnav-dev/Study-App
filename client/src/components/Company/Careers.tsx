import React from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";
import {
  Briefcase,
  MapPin,
  Coffee,
  Laptop,
  HeartPulse,
  GraduationCap,
} from "lucide-react";

const Careers: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col pt-16 sm:pt-20">
      <Navbar />

      <main className="flex-grow">
        <section className="bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full filter blur-[100px]" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Join the Team Building the Future of Education
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              We're always looking for passionate engineers, designers, and
              educators to help us make personalized learning accessible to
              everyone.
            </p>
            <a
              href="#open-roles"
              className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/25 transition-all hover:-translate-y-1"
            >
              View Open Roles
            </a>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 rounded-3xl my-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Perks & Benefits
            </h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Laptop,
                title: "Remote First",
                desc: "Work from anywhere in the world. We supply the gear.",
              },
              {
                icon: HeartPulse,
                title: "Health Coverage",
                desc: "Comprehensive top-tier health, dental, and vision.",
              },
              {
                icon: GraduationCap,
                title: "Learning Budget",
                desc: "$2k/year to spend on courses, books, and conferences.",
              },
              {
                icon: Coffee,
                title: "Unlimited Time Off",
                desc: "Take the time you need to recharge and come back fresh.",
              },
            ].map((perk, i) => (
              <div
                key={i}
                className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
              >
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <perk.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {perk.title}
                </h3>
                <p className="text-slate-600 text-sm">{perk.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="open-roles"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-10">
            Open Positions
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Senior AI Engineer",
                dep: "Engineering",
                loc: "Remote (Global)",
                type: "Full-time",
              },
              {
                title: "Product Designer UI/UX",
                dep: "Design",
                loc: "San Francisco / Remote",
                type: "Full-time",
              },
              {
                title: "Curriculum Expert",
                dep: "Education",
                loc: "Remote (India)",
                type: "Contract",
              },
              {
                title: "Frontend Developer (React)",
                dep: "Engineering",
                loc: "Remote (US)",
                type: "Full-time",
              },
            ].map((job, idx) => (
              <div
                key={idx}
                className="group p-6 bg-white border-2 border-slate-100 hover:border-indigo-500 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-lg"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> {job.dep}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {job.loc}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 rounded-full">
                      {job.type}
                    </span>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-6 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default Careers;
