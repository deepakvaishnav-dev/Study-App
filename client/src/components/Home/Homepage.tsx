import React, { useState, useEffect } from "react";
import { LogIn, Menu, X } from "lucide-react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import StatisticsSection from "./StatisticsSection";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";
import FooterSection from "./FooterSection";
import "./animations.css";

interface HomepageProps {
  onLoginClick: () => void;
  onInstallClick: () => void;
  showInstallButton: boolean;
}

const Homepage: React.FC<HomepageProps> = ({
  onLoginClick,
  onInstallClick,
  showInstallButton,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Statistics", href: "#statistics" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Premium Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-3xl shadow-2xl border-b-2 border-gradient"
            : "bg-white/70 backdrop-blur-2xl shadow-xl border-b border-slate-100/50"
        }`}
        style={{
          borderImage: scrolled
            ? "linear-gradient(90deg, rgba(99,102,241,0.5), rgba(168,85,247,0.5), rgba(236,72,153,0.5)) 1"
            : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo with Premium Effects */}
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <img
                  src="/studysync.png"
                  alt="StudySync Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-300">
                StudySync
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="relative text-slate-700 font-semibold hover:text-indigo-600 transition-colors group py-2"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Premium Login Button */}
            <div className="hidden md:block">
              <button
                onClick={onLoginClick}
                className="group relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2 overflow-hidden shine-effect"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <LogIn className="relative w-4 h-4 group-hover:translate-x-0.5 group-hover:rotate-12 transition-all duration-300" />
                <span className="relative">Login</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-900" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-900" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-3 bg-white/98 backdrop-blur-2xl border-t border-slate-200">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="block px-4 py-3 text-slate-700 font-semibold hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 rounded-xl transition-all"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLoginClick();
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <div id="home">
          <HeroSection
            onLoginClick={onLoginClick}
            onInstallClick={onInstallClick}
            showInstallButton={showInstallButton}
          />
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="statistics">
          <StatisticsSection />
        </div>
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <CTASection onLoginClick={onLoginClick} />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Homepage;
