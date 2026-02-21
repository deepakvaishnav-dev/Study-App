import React from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";
import { FileBadge, Github, CreativeCommons, Scale } from "lucide-react";

// Mock data for open source licenses
const openSourceSoftware = [
  {
    name: "React",
    author: "Meta Platforms, Inc.",
    license: "MIT",
    url: "https://react.dev/",
  },
  {
    name: "Tailwind CSS",
    author: "Tailwind Labs Inc.",
    license: "MIT",
    url: "https://tailwindcss.com/",
  },
  {
    name: "Lucide Icons",
    author: "Lucide Contributors",
    license: "ISC",
    url: "https://lucide.dev/",
  },
  {
    name: "Axios",
    author: "Matt Zabriskie",
    license: "MIT",
    url: "https://axios-http.com/",
  },
  {
    name: "Zustand",
    author: "Daishi Kato",
    license: "MIT",
    url: "https://zustand-demo.pmnd.rs/",
  },
  {
    name: "React Router",
    author: "Remix Software",
    license: "MIT",
    url: "https://reactrouter.com/",
  },
  {
    name: "Express",
    author: "OpenJS Foundation",
    license: "MIT",
    url: "https://expressjs.com/",
  },
  {
    name: "Mongoose",
    author: "LearnBoost",
    license: "MIT",
    url: "https://mongoosejs.com/",
  },
];

const Licenses: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-16 sm:pt-20">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-600 rounded-2xl mb-6">
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Open Source Licenses
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl">
              StudySync is made possible by the incredible open-source
              community. Here are the tools we use and their licenses.
            </p>
          </div>
          <div className="hidden md:flex opacity-10">
            <Github className="w-32 h-32" />
          </div>
        </div>

        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-16">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 font-bold text-slate-900">
                    Software Element
                  </th>
                  <th className="py-4 px-6 font-bold text-slate-900">
                    Author / Copyright Link
                  </th>
                  <th className="py-4 px-6 font-bold text-slate-900">
                    License Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {openSourceSoftware.map((oss, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <a
                        href={oss.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-indigo-600 hover:underline"
                      >
                        {oss.name}
                      </a>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{oss.author}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {oss.license}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <FileBadge className="w-8 h-8 text-indigo-500 shrink-0" />
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                MIT License
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A short and simple permissive license with conditions only
                requiring preservation of copyright and license notices.
                Licensed works, modifications, and larger works may be
                distributed under different terms and without source code.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <CreativeCommons className="w-8 h-8 text-indigo-500 shrink-0" />
            <div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Assets & Imagery
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Unless otherwise noted, all stock imagery used on StudySync is
                licensed from platforms granting commercial usage rights (like
                Unsplash), and all icons belong to the Lucide icon set licensed
                under ISC.
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default Licenses;
