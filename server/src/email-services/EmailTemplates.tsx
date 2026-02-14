import React from "react";
import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";
import type { UserStats } from "../types";

// Link to client
const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";

export interface TestDetails {
  subject: string;
  score: number;
  total: number;
  percentage: string;
  weakTopics: string[];
  totalQuestions?: number;
  timeTaken?: string;
  questions?: Array<{
    text: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
  }>;
}

// --- Shared Layout & Styles ---
interface EmailLayoutProps {
  previewText: string;
  heading: string;
  children: React.ReactNode;
}

const EmailLayout = ({ previewText, heading, children }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "#6366F1", // Indigo-500
                primaryDark: "#4F46E5", // Indigo-600
                accent: "#8B5CF6", // Purple-500
                success: "#10B981", // Green-500
                warning: "#F59E0B", // Amber-500
                background: "#F9FAFB", // Gray-50
                text: "#111827", // Gray-900
                textLight: "#6B7280", // Gray-500
                card: "#FFFFFF",
              },
            },
          },
        }}
      >
        <Body className="bg-background my-auto mx-auto font-sans">
          {/* Header with Gradient */}
          <Container className="my-[40px] mx-auto max-w-[600px]">
            <Section
              className="rounded-t-lg p-8 text-center"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              }}
            >
              <Heading className="text-white text-[32px] font-bold m-0 tracking-tight">
                StudySync
              </Heading>
              <Text className="text-white/90 text-[14px] m-0 mt-2">
                Your Learning Companion
              </Text>
            </Section>

            {/* Main Content Card */}
            <Section className="bg-card rounded-b-lg shadow-lg border border-solid border-[#E5E7EB]">
              <Section className="px-8 pt-8 pb-6">
                <Heading className="text-text text-[24px] font-bold text-center m-0 mb-4">
                  {heading}
                </Heading>
                {children}
              </Section>

              {/* Footer */}
              <Section className="px-8 py-6 bg-background rounded-b-lg border-t border-solid border-[#E5E7EB]">
                <Text className="text-textLight text-[12px] leading-[20px] text-center m-0">
                  © {new Date().getFullYear()} StudySync. All rights reserved.
                </Text>
                <Text className="text-textLight text-[12px] leading-[20px] text-center m-0 mt-1">
                  Keep learning, keep growing. 🚀
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// --- Login Notification Email ---
export const LoginNotificationEmail = ({ name }: { name: string }) => (
  <EmailLayout
    previewText={`Welcome back, ${name}! 👋`}
    heading={`Welcome Back, ${name}! 👋`}
  >
    <Section className="text-center mb-6">
      <div
        className="inline-block p-4 rounded-full mb-4"
        style={{
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
        }}
      >
        <Text className="text-[40px] m-0">🎉</Text>
      </div>
    </Section>

    <Text className="text-text text-[16px] leading-[26px] text-center mb-4">
      We noticed a new login on your account.
      <br />
      <strong>We're glad to see you back!</strong>
    </Text>

    <Section
      className="p-4 rounded-lg mb-6"
      style={{ backgroundColor: "#EEF2FF" }}
    >
      <Text className="text-primary text-[14px] leading-[22px] text-center m-0">
        💡 <strong>Pro Tip:</strong> Consistency is the key to mastery. Try to
        study a little every day!
      </Text>
    </Section>

    <Text className="text-textLight text-[14px] leading-[24px] text-center mb-6">
      Ready to continue your learning journey?
    </Text>

    <Section className="text-center">
      <Button
        className="rounded-lg text-white text-[14px] font-semibold no-underline text-center px-8 py-4"
        style={{
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
        }}
        href={baseUrl}
      >
        Go to Dashboard →
      </Button>
    </Section>
  </EmailLayout>
);

// --- Period Report Email ---
export const PeriodReportEmail = ({
  name,
  period,
  stats,
}: {
  name: string;
  period: "Weekly" | "Monthly";
  stats: UserStats;
}) => {
  const studyHours = (stats.totalStudyMinutes / 60).toFixed(1);

  return (
    <EmailLayout
      previewText={`Your ${period} Progress Report 📊`}
      heading={`${period} Progress Report 📊`}
    >
      <Text className="text-text text-[16px] leading-[26px] text-center mb-6">
        Hi <strong>{name}</strong>, here's your summary for the last{" "}
        <strong>{period === "Weekly" ? "7 days" : "30 days"}</strong>.
      </Text>

      {/* Stats Grid */}
      <Section className="mb-6">
        <table
          cellPadding="0"
          cellSpacing="0"
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "12px",
          }}
        >
          <tr>
            <td
              className="rounded-lg p-4 text-center"
              style={{
                background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
              }}
            >
              <Text className="text-primary text-[32px] font-bold m-0">
                {stats.streakDays}
              </Text>
              <Text className="text-textLight text-[13px] m-0 mt-1">
                🔥 Day Streak
              </Text>
            </td>
            <td
              className="rounded-lg p-4 text-center"
              style={{
                background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
              }}
            >
              <Text className="text-success text-[32px] font-bold m-0">
                {studyHours}h
              </Text>
              <Text className="text-textLight text-[13px] m-0 mt-1">
                📚 Study Time
              </Text>
            </td>
          </tr>
          <tr>
            <td
              className="rounded-lg p-4 text-center"
              style={{
                background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
              }}
            >
              <Text className="text-warning text-[32px] font-bold m-0">
                {stats.totalNotes}
              </Text>
              <Text className="text-textLight text-[13px] m-0 mt-1">
                📝 Notes Created
              </Text>
            </td>
            <td
              className="rounded-lg p-4 text-center"
              style={{
                background: "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)",
              }}
            >
              <Text className="text-accent text-[32px] font-bold m-0">
                {stats.totalTests}
              </Text>
              <Text className="text-textLight text-[13px] m-0 mt-1">
                ✅ Tests Taken
              </Text>
            </td>
          </tr>
        </table>
      </Section>

      {/* Motivational Message */}
      <Section
        className="p-4 rounded-lg mb-6 text-center"
        style={{
          background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
        }}
      >
        <Text className="text-primary text-[16px] font-bold m-0">
          💪 Keep Going!
        </Text>
        <Text className="text-textLight text-[14px] m-0 mt-1">
          {stats.streakDays >= 7
            ? "Your consistency is paying off. Great work!"
            : "Every study session brings you closer to your goals."}
        </Text>
      </Section>

      <Text className="text-text text-[15px] leading-[24px] text-center mb-6">
        {stats.streakDays >= 7
          ? "🎉 Amazing consistency! You're building a strong learning habit."
          : "Keep up the great work! Consistency is key to mastery."}
      </Text>

      <Section className="text-center">
        <Button
          className="rounded-lg text-white text-[14px] font-semibold no-underline text-center px-8 py-4"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
          }}
          href={`${baseUrl}/dashboard`}
        >
          View Full Stats →
        </Button>
      </Section>
    </EmailLayout>
  );
};

// --- Test Result Email ---
export const TestResultEmail = ({
  name,
  details,
}: {
  name: string;
  details: TestDetails;
}) => {
  const percentage = parseFloat(details.percentage);
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 70;
  const isPassing = percentage >= 50;

  const getPerformanceColor = () => {
    if (isExcellent) return "#10B981"; // Green
    if (isGood) return "#6366F1"; // Indigo
    if (isPassing) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  const getPerformanceEmoji = () => {
    if (isExcellent) return "🌟";
    if (isGood) return "👏";
    if (isPassing) return "👍";
    return "💪";
  };

  const getPerformanceMessage = () => {
    if (isExcellent) return "Excellent Work!";
    if (isGood) return "Great Job!";
    if (isPassing) return "Good Effort!";
    return "Keep Practicing!";
  };

  return (
    <EmailLayout
      previewText={`Test Result: ${details.subject} - ${details.percentage}%`}
      heading={`Test Result: ${details.subject} 📝`}
    >
      <Text className="text-text text-[16px] leading-[26px] text-center mb-6">
        Hi <strong>{name}</strong>, you just completed a test on{" "}
        <strong>{details.subject}</strong>.
      </Text>

      {/* Score Display */}
      <Section
        className="rounded-lg p-8 text-center mb-6"
        style={{
          background: `linear-gradient(135deg, ${getPerformanceColor()}15 0%, ${getPerformanceColor()}25 100%)`,
          border: `2px solid ${getPerformanceColor()}`,
        }}
      >
        <Text
          className="text-[56px] m-0"
          style={{ color: getPerformanceColor() }}
        >
          {getPerformanceEmoji()}
        </Text>
        <Text
          className="text-[48px] font-bold m-0 mt-2"
          style={{ color: getPerformanceColor() }}
        >
          {details.percentage}%
        </Text>
        <Text className="text-textLight text-[16px] m-0 mt-2">
          Score: {details.score} / {details.total}
        </Text>
        <Text
          className="text-[18px] font-semibold m-0 mt-3"
          style={{ color: getPerformanceColor() }}
        >
          {getPerformanceMessage()}
        </Text>
      </Section>

      {/* Test Details */}
      <Section className="mb-6">
        <table
          cellPadding="0"
          cellSpacing="0"
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "8px",
          }}
        >
          <tr>
            <td
              className="rounded-lg p-3 text-center"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <Text className="text-textLight text-[12px] m-0">Questions</Text>
              <Text className="text-text text-[18px] font-semibold m-0 mt-1">
                {details.total}
              </Text>
            </td>
            <td
              className="rounded-lg p-3 text-center"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <Text className="text-textLight text-[12px] m-0">Time Taken</Text>
              <Text className="text-text text-[18px] font-semibold m-0 mt-1">
                {details.timeTaken || "N/A"}
              </Text>
            </td>
          </tr>
        </table>
      </Section>

      <Hr className="border-[#E5E7EB] my-6 mx-0 w-full" />

      {/* Weak Topics */}
      {details.weakTopics.length > 0 ? (
        <Section className="mb-6">
          <Heading className="text-[18px] font-semibold mb-3 text-text">
            📌 Areas for Improvement
          </Heading>
          <Section
            className="rounded-lg p-4"
            style={{ backgroundColor: "#FEF3C7" }}
          >
            {details.weakTopics.map((topic, index) => (
              <Text
                key={index}
                className="text-[14px] text-text m-0"
                style={{
                  marginBottom:
                    index < details.weakTopics.length - 1 ? "8px" : "0",
                }}
              >
                • {topic}
              </Text>
            ))}
          </Section>
          <Text className="text-textLight text-[13px] m-0 mt-3 text-center">
            💡 Focus on these topics in your next study session
          </Text>
        </Section>
      ) : (
        <Section
          className="rounded-lg p-4 mb-6 text-center"
          style={{
            background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
          }}
        >
          <Text className="text-success text-[16px] font-bold m-0">
            🎉 Perfect Understanding!
          </Text>
          <Text className="text-textLight text-[14px] m-0 mt-1">
            You mastered all topics in this test.
          </Text>
        </Section>
      )}

      {/* Detailed Question Analysis */}
      {details.questions && details.questions.length > 0 && (
        <>
          <Hr className="border-[#E5E7EB] my-6 mx-0 w-full" />

          <Heading className="text-[20px] font-bold mb-4 text-text text-center">
            📋 Detailed Question Analysis
          </Heading>

          <Text className="text-textLight text-[13px] mb-6 text-center">
            Review each question to understand your performance
          </Text>

          {details.questions.map((question, index) => (
            <Section
              key={index}
              className="rounded-lg p-4 mb-4"
              style={{
                backgroundColor: question.isCorrect ? "#ECFDF5" : "#FEF2F2",
                border: `1px solid ${question.isCorrect ? "#10B981" : "#EF4444"}`,
              }}
            >
              {/* Question Number & Status */}
              <Section className="mb-3">
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  style={{ width: "100%" }}
                >
                  <tr>
                    <td style={{ width: "50%" }}>
                      <Text className="text-text text-[14px] font-bold m-0">
                        Q{index + 1}
                      </Text>
                    </td>
                    <td style={{ width: "50%", textAlign: "right" }}>
                      <Text
                        className="text-[14px] font-semibold m-0"
                        style={{
                          color: question.isCorrect ? "#10B981" : "#EF4444",
                        }}
                      >
                        {question.isCorrect ? "✅ Correct" : "❌ Incorrect"}
                      </Text>
                    </td>
                  </tr>
                </table>
              </Section>

              {/* Question Text */}
              <Text className="text-text text-[14px] leading-[22px] mb-3">
                {question.text}
              </Text>

              {/* Answers */}
              <Section
                className="rounded p-3 mb-2"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
              >
                <Text className="text-textLight text-[12px] m-0 mb-1">
                  <strong>Your Answer:</strong>
                </Text>
                <Text
                  className="text-[13px] m-0"
                  style={{
                    color: question.isCorrect ? "#10B981" : "#EF4444",
                  }}
                >
                  {question.userAnswer}
                </Text>
              </Section>

              {!question.isCorrect && (
                <Section
                  className="rounded p-3 mb-2"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                >
                  <Text className="text-textLight text-[12px] m-0 mb-1">
                    <strong>Correct Answer:</strong>
                  </Text>
                  <Text className="text-success text-[13px] m-0">
                    {question.correctAnswer}
                  </Text>
                </Section>
              )}

              {/* Explanation */}
              {question.explanation && (
                <Section
                  className="rounded p-3"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                >
                  <Text className="text-textLight text-[12px] m-0 mb-1">
                    <strong>💡 Explanation:</strong>
                  </Text>
                  <Text className="text-text text-[13px] m-0 leading-[20px]">
                    {question.explanation}
                  </Text>
                </Section>
              )}
            </Section>
          ))}

          {/* Summary Stats */}
          <Section
            className="rounded-lg p-4 mt-6 text-center"
            style={{
              background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
            }}
          >
            <Text className="text-primary text-[14px] font-semibold m-0">
              📊 Summary: {details.score} correct out of {details.total}{" "}
              questions
            </Text>
            <Text className="text-textLight text-[13px] m-0 mt-1">
              {percentage >= 70
                ? "Great work! Keep up the momentum!"
                : "Review the incorrect answers and try again!"}
            </Text>
          </Section>
        </>
      )}

      <Section className="text-center mt-6">
        <Button
          className="rounded-lg text-white text-[14px] font-semibold no-underline text-center px-8 py-4"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
          }}
          href={`${baseUrl}/dashboard/self-assessment`}
        >
          Take Another Test →
        </Button>
      </Section>
    </EmailLayout>
  );
};
