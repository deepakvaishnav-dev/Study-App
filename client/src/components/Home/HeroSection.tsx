import React, { useEffect, useState } from "react";
import { Sparkles, Zap, Download, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onLoginClick: () => void;
  onInstallClick: () => void;
  showInstallButton: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onLoginClick,
  onInstallClick,
  showInstallButton,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 animate-background-gradient">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 50%)`,
          }}
        />
      </div>

      {/* Morphing Orbs with Advanced Animations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animate-morph" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animate-morph animation-delay-2000" />
      <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animate-morph animation-delay-4000" />

      {/* Additional Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-particle-float" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-particle-float animation-delay-3000" />
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-particle-float animation-delay-1000" />

      {/* Animated Wave Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-10">
        <svg
          className="absolute bottom-0 w-full h-full animate-wave"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#gradient1)"
            fillOpacity="0.5"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-xl rounded-full border border-indigo-100 shadow-lg mb-8 animate-fade-in-down hover:scale-105 transition-transform cursor-pointer">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            The Ultimate Student Companion
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 leading-[1.1] tracking-tight mb-4 sm:mb-6 animate-fade-in-up px-4">
          Master Your{" "}
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 blur-2xl opacity-30 animate-pulse" />
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient">
              Academic Journey
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in-up animation-delay-200">
          Organize your studies, generate{" "}
          <span className="font-bold text-indigo-600">AI-powered tests</span>,
          and track your progress with{" "}
          <span className="font-bold text-purple-600">beautiful analytics</span>
          . Everything you need to excel, all in one place.
        </p>

        {/* Premium CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-400">
          <button
            onClick={onLoginClick}
            className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 overflow-hidden shine-effect"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center justify-center gap-2">
              Get Started Now
              <Zap className="w-5 h-5 fill-current group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            </span>
          </button>

          {showInstallButton && (
            <button
              onClick={onInstallClick}
              className="group w-full sm:w-auto px-10 py-5 bg-white text-indigo-600 border-2 border-indigo-200 rounded-2xl font-bold text-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 shine-effect overflow-hidden"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Install App
            </button>
          )}
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto animate-fade-in-up animation-delay-600 px-4">
          {[
            { value: "50K+", label: "Active Students" },
            { value: "1M+", label: "Tests Generated" },
            { value: "95%", label: "Success Rate" },
            { value: "4.9★", label: "User Rating" },
          ].map((stat, index) => (
            <div
              key={index}
              className="relative bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer animate-glow-pulse group overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Ripple Effect on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 animate-ripple" />

              <div className="relative z-10">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 animate-zoom-in">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-semibold">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-6 h-6 text-slate-400 rotate-90" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
