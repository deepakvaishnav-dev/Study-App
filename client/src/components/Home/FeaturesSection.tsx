import React, { useState } from "react";
import {
  Star,
  Brain,
  Target,
  TrendingUp,
  BookOpen,
  Award,
  Sparkles,
} from "lucide-react";

const FeaturesSection: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Generate custom quizzes, summaries, and study materials instantly with advanced AI models tailored to your learning style.",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Visualize your growth with detailed analytics, performance graphs, and weekly reports that keep you motivated.",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      icon: Target,
      title: "Smart Planning",
      description:
        "Organize your study schedule with intelligent reminders and never miss a deadline with our smart planning system.",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description:
        "Access a vast collection of study materials, notes, and resources curated specifically for your courses.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Award,
      title: "Achievement System",
      description:
        "Earn badges and rewards as you progress. Gamify your learning journey and stay motivated every step of the way.",
      gradient: "from-rose-500 to-pink-500",
      bgGradient: "from-rose-50 to-pink-50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      icon: Sparkles,
      title: "Personalized Experience",
      description:
        "Adaptive learning paths that adjust to your pace and preferences, ensuring optimal learning outcomes.",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      {/* Background Decoration with Advanced Animations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl animate-morph" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-morph animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl animate-rotate-3d opacity-30" />
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute top-10 right-20 w-20 h-20 border-4 border-indigo-300 rounded-lg animate-tilt opacity-20" />
      <div className="absolute bottom-20 left-20 w-16 h-16 border-4 border-purple-300 rotate-45 animate-tilt animation-delay-1000 opacity-20" />
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full animate-particle-float opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4">
            <Star className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-indigo-600">
              POWERFUL FEATURES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 sm:mb-6">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Succeed
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            Powerful tools designed to transform your learning experience and
            help you achieve your academic goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card */}
              <div
                className={`relative h-full bg-white rounded-3xl p-8 border-2 transition-all duration-500 ${
                  hoveredIndex === index
                    ? "border-transparent shadow-2xl -translate-y-2 scale-105"
                    : "border-slate-100 shadow-lg"
                }`}
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Animated Border */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    style={{ padding: "2px", zIndex: -1 }}
                  >
                    <div className="w-full h-full bg-white rounded-3xl" />
                  </div>
                </div>

                {/* Floating Particles */}
                {hoveredIndex === index && (
                  <>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-500 rounded-full animate-ping animation-delay-300" />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up animation-delay-600">
          <p className="text-slate-600 mb-4">
            And many more features to discover...
          </p>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
