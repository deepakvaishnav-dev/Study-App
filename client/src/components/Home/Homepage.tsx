import React from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import StatisticsSection from "./StatisticsSection";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";
import FooterSection from "./FooterSection";
import Navbar from "./Navbar";
import PricingPage from "../Pricing/PricingPage";
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
  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Premium Navbar */}
      <Navbar onLoginClick={onLoginClick} />

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
        <div id="pricing">
          <PricingPage />
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
