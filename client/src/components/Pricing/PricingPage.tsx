import React, { useState } from "react";
import {
  Check,
  Zap,
  Crown,
  Star,
  Shield,
  ArrowRight,
  Sparkles,
  BookOpen,
  Brain,
  Target,
  X,
} from "lucide-react";
import UPIPaymentModal from "./UPIPaymentModal"; // Force TS refresh
import "./PricingPage.css";

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  badge?: string;
  features: string[];
  notIncluded?: string[];
  cta: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with your studies",
    icon: <BookOpen className="w-6 h-6" />,
    color: "#6b7280",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    cta: "Get Started Free",
    features: [
      "5 Notes per month",
      "Basic AI assistance",
      "2 Question papers",
      "Study planner (1 week)",
      "Basic analytics",
    ],
    notIncluded: [
      "Unlimited notes",
      "Advanced AI features",
      "PDF uploads",
      "Priority support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 199,
    originalPrice: 399,
    period: "month",
    description: "Everything you need to excel in your studies",
    icon: <Zap className="w-6 h-6" />,
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    badge: "Most Popular",
    cta: "Upgrade to Pro",
    popular: true,
    features: [
      "Unlimited Notes",
      "Advanced AI assistance",
      "Unlimited Question papers",
      "Full Study Planner",
      "PDF & Image uploads",
      "Detailed analytics",
      "Self Assessment tests",
      "Email reports",
      "Priority support",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 499,
    originalPrice: 999,
    period: "month",
    description: "Ultimate study companion for serious students",
    icon: <Crown className="w-6 h-6" />,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    badge: "Best Value",
    cta: "Go Premium",
    features: [
      "Everything in Pro",
      "1-on-1 AI tutoring sessions",
      "Custom study roadmaps",
      "Exam preparation mode",
      "Collaborative study groups",
      "Offline access",
      "Advanced performance insights",
      "Dedicated account manager",
      "Early access to new features",
    ],
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    grade: "Class 12",
    text: "StudySync Pro helped me score 95% in boards! The AI notes are amazing.",
    rating: 5,
    avatar: "RS",
  },
  {
    name: "Priya Patel",
    grade: "JEE Aspirant",
    text: "The question paper generator is a game changer for JEE prep!",
    rating: 5,
    avatar: "PP",
  },
  {
    name: "Arjun Singh",
    grade: "Class 10",
    text: "Finally an app that actually makes studying fun and effective.",
    rating: 5,
    avatar: "AS",
  },
];

const PricingPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const handleSelectPlan = (plan: Plan) => {
    if (plan.price === 0) return;
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const getPrice = (plan: Plan) => {
    if (billingCycle === "yearly") {
      return Math.round(plan.price * 10); // 2 months free
    }
    return plan.price;
  };

  const getOriginalPrice = (plan: Plan) => {
    if (billingCycle === "yearly" && plan.originalPrice) {
      return Math.round(plan.originalPrice * 12);
    }
    return plan.originalPrice;
  };

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <div className="pricing-hero">
        <div className="pricing-hero-badge">
          <Sparkles className="w-4 h-4" />
          <span>Limited Time Offer - Save up to 50%</span>
        </div>
        <h1 className="pricing-hero-title">
          Choose Your
          <span className="pricing-gradient-text"> Study Plan</span>
        </h1>
        <p className="pricing-hero-subtitle">
          Unlock your full potential with AI-powered study tools. Join thousands
          of students already achieving their goals.
        </p>

        {/* Billing Toggle */}
        <div className="billing-toggle">
          <button
            className={`billing-btn ${billingCycle === "monthly" ? "active" : ""}`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={`billing-btn ${billingCycle === "yearly" ? "active" : ""}`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly
            <span className="save-badge">Save 17%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card ${plan.popular ? "plan-card-popular" : ""}`}
          >
            {plan.badge && (
              <div className="plan-badge" style={{ background: plan.gradient }}>
                {plan.badge}
              </div>
            )}

            <div className="plan-header">
              <div className="plan-icon" style={{ background: plan.gradient }}>
                {plan.icon}
              </div>
              <div>
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-desc">{plan.description}</p>
              </div>
            </div>

            <div className="plan-pricing">
              {plan.price === 0 ? (
                <div className="price-display">
                  <span className="price-amount">Free</span>
                </div>
              ) : (
                <div className="price-display">
                  <span className="price-currency">₹</span>
                  <span className="price-amount">{getPrice(plan)}</span>
                  <div className="price-info">
                    {getOriginalPrice(plan) && (
                      <span className="price-original">
                        ₹{getOriginalPrice(plan)}
                      </span>
                    )}
                    <span className="price-period">
                      /{billingCycle === "yearly" ? "year" : "month"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              className={`plan-cta ${plan.price === 0 ? "plan-cta-free" : "plan-cta-paid"}`}
              style={plan.price > 0 ? { background: plan.gradient } : undefined}
              onClick={() => handleSelectPlan(plan)}
            >
              {plan.cta}
              {plan.price > 0 && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="plan-features">
              {plan.features.map((feature, i) => (
                <div key={i} className="feature-item feature-included">
                  <div
                    className="feature-check"
                    style={{ background: plan.gradient }}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
              {plan.notIncluded?.map((feature, i) => (
                <div key={i} className="feature-item feature-excluded">
                  <div className="feature-x">
                    <X className="w-3 h-3" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="features-highlight">
        <h2 className="section-title">Why Students Love StudySync</h2>
        <div className="features-grid">
          {[
            {
              icon: <Brain className="w-8 h-8" />,
              title: "AI-Powered Notes",
              desc: "Smart summarization and concept extraction",
              color: "#6366f1",
            },
            {
              icon: <Target className="w-8 h-8" />,
              title: "Personalized Learning",
              desc: "Adaptive study plans based on your performance",
              color: "#8b5cf6",
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Secure & Private",
              desc: "Your data is always safe and private",
              color: "#06b6d4",
            },
            {
              icon: <Star className="w-8 h-8" />,
              title: "Exam Ready",
              desc: "Targeted preparation for board exams and entrance tests",
              color: "#f59e0b",
            },
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              <div
                className="feature-icon"
                style={{
                  color: feature.color,
                  background: `${feature.color}20`,
                }}
              >
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <h2 className="section-title">What Students Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 star-filled" />
                ))}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <p className="author-name">{t.name}</p>
                  <p className="author-grade">{t.grade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes! You can cancel your subscription anytime. No hidden fees.",
            },
            {
              q: "Is my payment secure?",
              a: "Absolutely. We use UPI for 100% secure and instant payments.",
            },
            {
              q: "Can I upgrade/downgrade?",
              a: "Yes, you can change your plan anytime from your profile settings.",
            },
            {
              q: "Is there a student discount?",
              a: "Our plans are already student-friendly. Contact us for institutional pricing.",
            },
          ].map((faq, i) => (
            <div key={i} className="faq-card">
              <h4 className="faq-q">{faq.q}</h4>
              <p className="faq-a">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* UPI Payment Modal */}
      {showModal && selectedPlan && (
        <UPIPaymentModal
          plan={selectedPlan}
          amount={getPrice(selectedPlan)}
          billingCycle={billingCycle}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PricingPage;
