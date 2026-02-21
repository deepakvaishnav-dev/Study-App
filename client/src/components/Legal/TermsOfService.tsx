import React from "react";
import Navbar from "../Home/Navbar";
import FooterSection from "../Home/FooterSection";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col pt-16 sm:pt-20">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-900 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <div className="prose prose-indigo max-w-none text-gray-700 space-y-4">
          <p>
            Last Updated: <strong>{new Date().toLocaleDateString()}</strong>
          </p>
          <p>
            Please read these Terms of Service ("Terms") carefully before using
            the StudySync application operated by us.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using StudySync, you agree to be bound by these
            Terms. If you disagree with any part of the terms, then you may not
            access the service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            2. User Accounts
          </h2>
          <p>
            When you create an account with us, you must provide us information
            that is accurate, complete, and current at all times. Failure to do
            so constitutes a breach of the Terms, which may result in immediate
            termination of your account on our Service.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            3. Subscriptions and Limits
          </h2>
          <p>
            Certain features of StudySync are billed on a subscription basis.
            You will be billed in advance on a recurring and periodic basis. For
            the Pro plan, limits apply per user, such as a maximum of 15 notes
            created per day and 10 tests taken per day. Our Free plan includes a
            7-day evaluation limit, after which payment is required or access
            will be restricted.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            4. Permitted Use
          </h2>
          <p>
            The StudySync platform and original content, features, and
            functionality are and will remain the exclusive property of
            StudySync and its licensors. You agree not to misuse our systems or
            use the learning materials provided for commercial redistribution.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            5. Changes to Terms
          </h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. By continuing to access or use our Service
            after those revisions become effective, you agree to be bound by the
            revised terms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            6. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at
            studysyncrudrani@gmail.com.
          </p>
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default TermsOfService;
