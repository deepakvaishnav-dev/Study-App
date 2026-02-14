import React, { useState } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Medical Student",
      university: "AIIMS Delhi",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      rating: 5,
      text: "StudySync transformed my study routine completely! The AI-generated tests helped me ace my exams with a 95% score. The progress tracking keeps me motivated every single day.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      name: "Rahul Verma",
      role: "Engineering Student",
      university: "IIT Bombay",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
      rating: 5,
      text: "The smart planning feature is a game-changer! I can organize all my subjects, track deadlines, and the AI summaries save me hours of study time. Absolutely worth it!",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Ananya Patel",
      role: "MBA Candidate",
      university: "IIM Ahmedabad",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
      rating: 5,
      text: "I love the analytics dashboard! Being able to visualize my progress and identify weak areas has improved my performance by 40%. This app is essential for serious students.",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      name: "Arjun Singh",
      role: "Law Student",
      university: "NLSIU Bangalore",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      rating: 5,
      text: "The resource library and AI-powered study materials are incredible. I can generate custom quizzes for any topic in seconds. It's like having a personal tutor 24/7!",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      name: "Sneha Reddy",
      role: "Commerce Student",
      university: "SRCC Delhi",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
      rating: 5,
      text: "Best study app I've ever used! The achievement system keeps me motivated, and the weekly reports help me stay on track. My grades have improved significantly since I started using it.",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4">
            <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span className="text-sm font-bold text-amber-600">
              STUDENT TESTIMONIALS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 sm:mb-6">
            Loved by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Students
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
            See what our community of successful students has to say about their
            experience
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Card */}
          <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 border border-slate-100 overflow-hidden">
            {/* Gradient Background */}
            <div
              className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${currentTestimonial.gradient} opacity-10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2`}
            />

            {/* Quote Icon */}
            <div className="absolute top-8 left-8 opacity-10">
              <Quote className="w-24 h-24 text-slate-900" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-xl sm:text-2xl text-slate-700 leading-relaxed mb-6 sm:mb-8 font-medium">
                "{currentTestimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentTestimonial.gradient} p-1`}
                >
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-full h-full rounded-full bg-white"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-slate-600">
                    {currentTestimonial.role} • {currentTestimonial.university}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="group w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 hover:bg-indigo-600 hover:border-indigo-600 transition-all flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors" />
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-8 h-3 bg-gradient-to-r from-indigo-600 to-purple-600"
                      : "w-3 h-3 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="group w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 hover:bg-indigo-600 hover:border-indigo-600 transition-all flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Thumbnail Preview */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {testimonials.map((testimonial, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? "scale-100 opacity-100"
                    : "scale-75 opacity-40 hover:opacity-70"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} p-1`}
                >
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full rounded-full bg-white"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
