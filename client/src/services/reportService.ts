import { userDataService } from "./userData";
import type { UserStats } from "./userData";
import type { TestDetails } from "../types";
import api from "./api";
// import {
//   type TestDetails,
// } from "../email-services/emailTemplates";

const WEEKLY_REPORT_KEY = "studysync_last_report_date";
const MONTHLY_REPORT_KEY = "studysync_last_monthly_report_date";

export const reportService = {
  // Send email using Nodemailer via Backend
  sendEmail: async (toEmail: string, subject: string, htmlContent: string) => {
    try {
      await api.post("/email/send", {
        to: toEmail,
        subject: subject,
        html: htmlContent,
      });

      // console.log(`Email sent successfully to ${toEmail}`);
    } catch (error: any) {
      console.error("Failed to send email:", error);
      if (error.response) {
        console.error(
          "Server Error Details:",
          JSON.stringify(error.response.data, null, 2),
        );
      }
    }
  },

  // Login Success Email
  sendLoginSuccessEmail: async (
    studentEmail: string,
    studentName: string,
    parentEmail?: string,
  ) => {
    // Send to Student
    await api.post("/email/send", {
      to: studentEmail,
      subject: "Login Notification - StudySync",
      templateType: "login",
      templateData: { name: studentName },
    });

    // Send to Parent (if exists)
    if (parentEmail) {
      await api.post("/email/send", {
        to: parentEmail,
        subject: "Login Notification - StudySync",
        templateType: "login",
        templateData: { name: "Parent" }, // Or handle differently if template supports parent name
      });
    }
  },

  // Regular Reports (Weekly & Monthly)
  checkAndSendReports: async () => {
    const profile = userDataService.getUserProfile();
    if (!profile) return;

    const today = new Date();

    // --- Weekly Report Check ---
    const lastWeeklyDate = localStorage.getItem(WEEKLY_REPORT_KEY);
    let sendWeekly = false;

    if (!lastWeeklyDate) {
      sendWeekly = true;
    } else {
      const last = new Date(lastWeeklyDate);
      const diffTime = Math.abs(today.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 7) {
        sendWeekly = true;
      }
    }

    if (sendWeekly) {
      // Get stats for LAST 7 DAYS only using the new helper
      const weeklyStats = await (userDataService.getPeriodStats
        ? userDataService.getPeriodStats(7)
        : userDataService.getStats());

      // Send to both
      if (profile.email) {
        await reportService.sendPeriodReport(
          profile.email,
          profile.name,
          weeklyStats,
          "Weekly",
        );
      }
      if (profile.parentEmail) {
        await reportService.sendPeriodReport(
          profile.parentEmail,
          profile.name,
          weeklyStats,
          "Weekly",
        );
      }
      localStorage.setItem(WEEKLY_REPORT_KEY, today.toISOString());
    }

    // --- Monthly Report Check ---
    const lastMonthlyDate = localStorage.getItem(MONTHLY_REPORT_KEY);
    let sendMonthly = false;

    if (!lastMonthlyDate) {
      sendMonthly = true;
    } else {
      const last = new Date(lastMonthlyDate);
      const diffTime = Math.abs(today.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 30) {
        sendMonthly = true;
      }
    }

    if (sendMonthly) {
      // Get stats for LAST 30 DAYS
      const monthlyStats = await (userDataService.getPeriodStats
        ? userDataService.getPeriodStats(30)
        : userDataService.getStats());

      if (profile.email) {
        await reportService.sendPeriodReport(
          profile.email,
          profile.name,
          monthlyStats,
          "Monthly",
        );
      }
      if (profile.parentEmail) {
        await reportService.sendPeriodReport(
          profile.parentEmail,
          profile.name,
          monthlyStats,
          "Monthly",
        );
      }
      localStorage.setItem(MONTHLY_REPORT_KEY, today.toISOString());
    }
  },

  sendPeriodReport: async (
    email: string,
    studentName: string,
    stats: UserStats,
    period: "Weekly" | "Monthly",
  ) => {
    await api.post("/email/send", {
      to: email,
      subject: `${period} Progress Report: ${studentName}`,
      templateType: "period_report",
      templateData: {
        name: studentName,
        period: period,
        stats: stats,
      },
    });
  },

  // New: Send Test Result Report
  sendTestResult: async (studentName: string, testDetails: TestDetails) => {
    const profile = userDataService.getUserProfile();

    // Send to Parent
    if (profile?.parentEmail) {
      await api.post("/email/send", {
        to: profile.parentEmail,
        subject: `Test Result: ${testDetails.subject} - ${studentName}`,
        templateType: "test_result",
        templateData: {
          name: studentName,
          details: testDetails,
        },
      });
    }

    // Send to Student
    if (profile?.email) {
      await api.post("/email/send", {
        to: profile.email,
        subject: `Your Test Result: ${testDetails.subject}`,
        templateType: "test_result",
        templateData: {
          name: studentName,
          details: testDetails,
        },
      });
    }
  },
};
