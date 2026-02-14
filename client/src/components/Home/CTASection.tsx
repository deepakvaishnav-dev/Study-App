import React from "react";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";

interface CTASectionProps {
  onLoginClick: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onLoginClick }) => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient-shift">
        {/* Overlay Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full filter blur-3xl animate-float animate-morph" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-white/10 rounded-full filter blur-3xl animate-float animate-morph animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full filter blur-3xl animate-pulse animate-morph" />

      {/* Animated Geometric Shapes */}
      <div className="absolute top-20 right-1/4 w-24 h-24 border-4 border-white/20 rounded-lg animate-rotate-3d" />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 border-4 border-white/20 rotate-45 animate-tilt" />
      <div className="absolute top-1/3 left-10 w-20 h-20 bg-white/10 rounded-full animate-particle-float" />
      <div className="absolute bottom-1/3 right-10 w-32 h-32 bg-white/10 rounded-full animate-particle-float animation-delay-2000" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full mb-8 animate-bounce-slow">
          <Rocket className="w-10 h-10 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight animate-fade-in-up px-4">
          Ready to Transform Your{" "}
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-white blur-2xl opacity-50" />
            <span className="relative">Learning?</span>
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed animate-fade-in-up animation-delay-200 px-4">
          Join thousands of students who are already achieving their academic
          goals with StudySync. Start your journey today!
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400 px-4">
          <button
            onClick={onLoginClick}
            className="group relative w-full sm:w-auto px-12 py-6 bg-white text-indigo-600 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center gap-3">
              Get Started Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-8 sm:mt-12 animate-fade-in-up animation-delay-600 px-4">
          {[
            { icon: "✓", text: "No Credit Card Required" },
            { icon: "✓", text: "Free Forever Plan" },
            { icon: "✓", text: "Cancel Anytime" },
          ].map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-white/90 font-semibold"
            >
              <div className="w-6 h-6 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-sm">
                {badge.icon}
              </div>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Sparkles Decoration */}
        <div className="absolute top-20 left-20 animate-pulse">
          <Sparkles className="w-8 h-8 text-white/40" />
        </div>
        <div className="absolute bottom-20 right-20 animate-pulse animation-delay-1000">
          <Sparkles className="w-6 h-6 text-white/40" />
        </div>
        <div className="absolute top-1/2 right-10 animate-pulse animation-delay-2000">
          <Sparkles className="w-10 h-10 text-white/40" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
