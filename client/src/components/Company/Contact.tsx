import React, { useState } from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

const Contact: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate API call
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16 sm:pt-20">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <div className="inline-block p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-6">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
              Get in touch
            </h1>
            <p className="text-lg text-slate-600 mb-12">
              Have questions about StudySync? Want to partner with us or bring
              our platform to your school? We'd love to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                  <p className="text-slate-600">
                    Our friendly team is here to help.
                  </p>
                  <a
                    href="mailto:studysyncrudrani@gmail.com"
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    studysyncrudrani@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Office</h3>
                  <p className="text-slate-600">Come say hello at our HQ.</p>
                  <p className="font-medium text-slate-800">
                    123 Innovation Drive
                    <br />
                    Tech City, TC 10010
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                  <Phone className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                  <p className="text-slate-600">Mon-Fri from 9am to 6pm.</p>
                  <a
                    href="tel:+15550000000"
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    +1 (555) 000-0000
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Send us a message
            </h2>

            {status === "success" ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-200 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl">Message Sent!</h3>
                <p>
                  Thanks for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {status === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default Contact;
