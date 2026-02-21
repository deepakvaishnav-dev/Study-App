import React from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col pt-16 sm:pt-20">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-900 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <div className="prose prose-indigo max-w-none text-gray-700 space-y-4">
          <p>
            Last Updated: <strong>{new Date().toLocaleDateString()}</strong>
          </p>
          <p>
            Welcome to StudySync. We are committed to protecting your personal
            information and your right to privacy. If you have any questions or
            concerns about our policy, or our practices with regards to your
            personal information, please contact us.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            1. Information We Collect
          </h2>
          <p>
            We collect personal information that you provide to us, such as
            name, email address, password, educational level (grade), and any
            other information you actively enter in our application for
            generating study materials, setting up profiles, saving notes, or
            test results.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            2. How We Use Your Information
          </h2>
          <p>
            We use your information to provide, maintain, and improve our
            StudySync services, specifically to personalize learning
            experiences, deliver generated resources, send administrative
            notices (like test reports and password resets), and ensure the
            security of our platform.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            3. Sharing Your Information
          </h2>
          <p>
            We do not sell, rent, or trade your personal information to third
            parties. We may share information with trusted third-party service
            providers (such as hosting services or email deliverability
            services) strictly for the operation of the StudySync platform.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            4. Security of Your Information
          </h2>
          <p>
            We use administrative, technical, and physical security measures to
            help protect your personal information. While we have taken
            reasonable steps to secure the personal information you provide to
            us, please be aware that despite our efforts, no security measures
            are perfect or impenetrable.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            5. Contact Us
          </h2>
          <p>
            If you have questions or comments about this policy, you may email
            us at studysyncrudrani@gmail.com.
          </p>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default PrivacyPolicy;
