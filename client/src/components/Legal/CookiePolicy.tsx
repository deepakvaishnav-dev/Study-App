import React from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";
import { Cookie, ShieldAlert, Key, Zap } from "lucide-react";

const CookiePolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col pt-16 sm:pt-20">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-orange-100 text-orange-600 rounded-full mb-6">
            <Cookie className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            How we use cookies and similar technologies to provide, improve, and
            protect our platform.
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <p className="font-semibold px-6 py-4 bg-gray-50 border-l-4 border-orange-500 rounded-r-xl">
            Last Updated: <strong>{new Date().toLocaleDateString()}</strong>
          </p>

          <p>
            StudySync uses cookies to ensure that we give you the best
            experience on our website. This Cookie Policy explains what cookies
            are, how we use them, the types of cookies we use, and how to manage
            your cookie preferences.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 my-12 not-prose">
            {[
              {
                icon: Key,
                title: "Essential Cookies",
                desc: "Required for authentication, security, and basic platform operations.",
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                icon: ShieldAlert,
                title: "Security Cookies",
                desc: "Help us identify and prevent security risks and keep your account safe.",
                color: "text-green-500",
                bg: "bg-green-50",
              },
              {
                icon: Zap,
                title: "Performance Cookies",
                desc: "Allow us to analyze site usage and improve performance (e.g., loading speeds).",
                color: "text-purple-500",
                bg: "bg-purple-50",
              },
              {
                icon: Cookie,
                title: "Functional Cookies",
                desc: "Remember your preferences, such as language or grade level settings.",
                color: "text-orange-500",
                bg: "bg-orange-50",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            1. What are cookies?
          </h2>
          <p>
            Cookies are small text files that are placed on your computer or
            mobile device when you visit a website. They are widely used to make
            websites work or work more efficiently, as well as to provide
            reporting information.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            2. How do we use cookies?
          </h2>
          <p>
            We use first-party and third-party cookies for several reasons. Some
            cookies are required for technical reasons in order for our Website
            to operate, and we refer to these as "essential" or "strictly
            necessary" cookies. Other cookies also enable us to track and target
            the interests of our users to enhance the experience on our Website.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
            3. How can I control cookies?
          </h2>
          <p>
            You have the right to decide whether to accept or reject cookies.
            You can exercise your cookie rights by setting your preferences in
            the Cookie Consent Manager. You can also amend your web browser
            controls to accept or refuse cookies. If you choose to reject
            cookies, you may still use our website though your access to some
            functionality and areas of our website may be restricted.
          </p>

          <div className="mt-12 p-8 bg-slate-900 text-white rounded-3xl text-center not-prose">
            <h3 className="text-2xl font-bold mb-4">
              Need to update your preferences?
            </h3>
            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
              You can change your cookie preferences at any time. Clicking the
              button below will open our consent manager.
            </p>
            <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
              Manage Cookie Settings
            </button>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default CookiePolicy;
