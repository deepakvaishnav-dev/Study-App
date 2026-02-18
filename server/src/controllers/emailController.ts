import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import {
  LoginNotificationEmail,
  PeriodReportEmail,
  TestResultEmail,
} from "../email-services/EmailTemplates";

export const emailController = {
  sendEmail: async (req: Request, res: Response) => {
    try {
      // Get Gmail credentials from environment variables
      const {
        GMAIL_USER,
        GMAIL_CLIENT_ID,
        GMAIL_CLIENT_SECRET,
        GMAIL_REFRESH_TOKEN,
      } = process.env;

      console.log("📧 Email send request received");
      console.log("Gmail User:", GMAIL_USER ? "✅ Set" : "❌ Missing");
      console.log("Client ID:", GMAIL_CLIENT_ID ? "✅ Set" : "❌ Missing");
      console.log(
        "Client Secret:",
        GMAIL_CLIENT_SECRET ? "✅ Set" : "❌ Missing",
      );
      console.log(
        "Refresh Token:",
        GMAIL_REFRESH_TOKEN ? "✅ Set" : "❌ Missing",
      );

      if (
        !GMAIL_USER ||
        !GMAIL_CLIENT_ID ||
        !GMAIL_CLIENT_SECRET ||
        !GMAIL_REFRESH_TOKEN
      ) {
        console.error("❌ Gmail OAuth credentials not configured");
        return res.status(500).json({
          error: "Gmail credentials not configured",
          message:
            "Please set GMAIL_USER, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN in .env file",
        });
      }

      let { to, subject, html, templateType, templateData } = req.body;

      console.log("Email details:", { to, subject, templateType });

      if (!to || !subject) {
        console.error("❌ Missing required fields");
        return res
          .status(400)
          .json({ error: "Missing required fields: to, subject" });
      }

      // Generate HTML from template if provided
      if (!html && templateType && templateData) {
        try {
          console.log("📝 Rendering email template:", templateType);
          switch (templateType) {
            case "login":
              html = await render(
                LoginNotificationEmail({ name: templateData.name }),
              );
              break;
            case "period_report":
              html = await render(
                PeriodReportEmail({
                  name: templateData.name,
                  period: templateData.period,
                  stats: templateData.stats,
                }),
              );
              break;
            case "test_result":
              html = await render(
                TestResultEmail({
                  name: templateData.name,
                  details: templateData.details,
                }),
              );
              break;
            default:
              console.error("❌ Invalid template type:", templateType);
              return res.status(400).json({ error: "Invalid template type" });
          }
          console.log("✅ Template rendered successfully");
        } catch (renderError: any) {
          console.error("❌ Error rendering email template:", renderError);
          console.error("Render error details:", renderError.message);
          return res.status(500).json({
            error: "Failed to render email template",
            details: renderError.message,
          });
        }
      }

      if (!html) {
        console.error("❌ No HTML content provided");
        return res
          .status(400)
          .json({ error: "Missing HTML content or valid template data" });
      }

      // Create Nodemailer transporter with Gmail OAuth2
      // Using explicit host/port and forcing IPv4 to avoid Render timeout issues
      console.log("📮 Creating email transporter (SMTP:587 with OAuth2)...");
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          type: "OAuth2",
          user: GMAIL_USER,
          clientId: GMAIL_CLIENT_ID,
          clientSecret: GMAIL_CLIENT_SECRET,
          refreshToken: GMAIL_REFRESH_TOKEN,
        },
        family: 4, // Force IPv4 to avoid IPv6 issues on Render
      } as any);

      // Send email
      console.log("📤 Sending email to:", to);
      const info = await transporter.sendMail({
        from: `StudySync <${GMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
      });

      console.log("✅ Email sent successfully:", info.messageId);

      return res.status(200).json({
        success: true,
        messageId: info.messageId,
        message: "Email sent successfully",
      });
    } catch (error: any) {
      console.error("❌ Error sending:", JSON.stringify(error));
      console.error("❌ Error sending email:");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      // console.error("Error stack:", error.stack); // Reduce noise

      let errorMessage = "Failed to send email";
      if (error.code === "EAUTH" || error.responseCode === 535) {
        errorMessage = "Authentication failed: Check OAuth credentials";
      }

      res.status(500).json({
        error: errorMessage,
        details: error.message,
        code: error.code,
      });
    }
  },

  verifyConnection: async (req: Request, res: Response) => {
    try {
      const {
        GMAIL_USER,
        GMAIL_CLIENT_ID,
        GMAIL_CLIENT_SECRET,
        GMAIL_REFRESH_TOKEN,
      } = process.env;

      if (
        !GMAIL_USER ||
        !GMAIL_CLIENT_ID ||
        !GMAIL_CLIENT_SECRET ||
        !GMAIL_REFRESH_TOKEN
      ) {
        return res.status(500).json({
          success: false,
          message: "OAuth credentials missing in environment variables",
        });
      }

      console.log("🔍 Verifying email connection (OAuth2)...");
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          type: "OAuth2",
          user: GMAIL_USER,
          clientId: GMAIL_CLIENT_ID,
          clientSecret: GMAIL_CLIENT_SECRET,
          refreshToken: GMAIL_REFRESH_TOKEN,
        },
        family: 4, // Force IPv4
      } as any);

      await transporter.verify();
      console.log("✅ Email connection verified successfully");

      return res.status(200).json({
        success: true,
        message: "Server is ready to take our messages",
        user: GMAIL_USER,
      });
    } catch (error: any) {
      console.error("❌ Verification failed:", error);

      let errorMessage = "Verification failed";
      if (error.code === "EAUTH" || error.responseCode === 535) {
        errorMessage = "Authentication failed: Check OAuth credentials";
      }

      return res.status(500).json({
        success: false,
        error: errorMessage,
        details: error.message,
        code: error.code,
      });
    }
  },
};
