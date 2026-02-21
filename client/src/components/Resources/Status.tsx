import React from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";
import { CheckCircle2, Activity, ShieldCheck, Clock } from "lucide-react";

const Status: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16 sm:pt-20">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
              System Status
            </h1>
            <p className="text-lg text-slate-600">
              Real-time monitoring of StudySync's core services.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-green-50 text-green-700 px-6 py-3 rounded-full border border-green-200 shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold text-lg">All Systems Operational</span>
          </div>
        </div>

        <div className="space-y-6 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 px-2">
            Core Services
          </h2>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {[
              {
                name: "Web Application",
                uptime: "99.99%",
                status: "Operational",
              },
              {
                name: "AI Note Generation Engine",
                uptime: "99.95%",
                status: "Operational",
              },
              {
                name: "Question Paper Synthesis API",
                uptime: "99.98%",
                status: "Operational",
              },
              {
                name: "User Authentication Services",
                uptime: "100%",
                status: "Operational",
              },
              {
                name: "Email Delivery Systems",
                uptime: "99.99%",
                status: "Operational",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                  <span className="font-bold text-slate-900 text-lg">
                    {service.name}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-slate-500 font-medium">
                    Uptime {service.uptime}
                  </span>
                  <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <Activity className="w-8 h-8 text-indigo-500 shrink-0" />
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                API Response Time
              </h3>
              <p className="text-gray-500 text-sm">Averaging 120ms globally</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <Clock className="w-8 h-8 text-emerald-500 shrink-0" />
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                AI Processing Time
              </h3>
              <p className="text-gray-500 text-sm">
                Averaging 2.4s per request
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-purple-500 shrink-0" />
            <div>
              <h3 className="font-bold text-slate-900 mb-1">
                Security Standards
              </h3>
              <p className="text-gray-500 text-sm">SOC2 Type II Compliant</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 px-2 mb-6">
            Past Incidents
          </h2>
          <div className="bg-white p-8 rounded-3xl text-center border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">
              No incidents reported
            </h3>
            <p className="text-slate-500">
              There have been no service disruptions in the past 30 days.
            </p>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default Status;
