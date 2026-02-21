import React from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";
import { Users, MessagesSquare, Twitch, Calendar } from "lucide-react";

const Community: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col pt-16 sm:pt-20">
      <Navbar />

      <main className="flex-grow">
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-50 text-indigo-600 rounded-full mb-8">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Join the Global{" "}
            <span className="text-indigo-600">Study Community</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            Connect with thousands of students like you. Share notes, discuss
            study strategies, and prepare for exams together.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-indigo-600 text-white p-8 rounded-3xl text-left shadow-xl shadow-indigo-600/20 hover:-translate-y-2 transition-transform">
              <MessagesSquare className="w-10 h-10 mb-6 text-indigo-200" />
              <h3 className="text-2xl font-bold mb-3">Discord Server</h3>
              <p className="text-indigo-100 mb-8">
                The heart of our community. Subject-specific channels, study
                group voice chats, and direct help from our team.
              </p>
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold w-full hover:bg-indigo-50 transition-colors">
                Join Discord
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl text-left hover:-translate-y-2 transition-transform">
              <Twitch className="w-10 h-10 mb-6 text-purple-600" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Live Study Blocks
              </h3>
              <p className="text-slate-600 mb-8">
                Join our weekly Pomodoro sessions streamed live on Twitch. Mute
                up, focus in, and conquer your to-do list alongside others.
              </p>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-purple-700 transition-colors">
                Follow on Twitch
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl text-left hover:-translate-y-2 transition-transform">
              <Calendar className="w-10 h-10 mb-6 text-rose-500" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Local Events
              </h3>
              <p className="text-slate-600 mb-8">
                Meetups, hackathons, and exam-prep workshops happening near you.
                Find a local StudySync ambassador.
              </p>
              <button className="bg-rose-500 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-rose-600 transition-colors">
                View Calendar
              </button>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 text-white py-24 text-center px-4">
          <h2 className="text-3xl font-bold mb-6">
            Become a Campus Ambassador
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10">
            Passionate about ed-tech? Bring StudySync to your school or
            university, host events, and earn exclusive perks and resume
            experience.
          </p>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-white/20 transition-all">
            Apply Now
          </button>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};

export default Community;
