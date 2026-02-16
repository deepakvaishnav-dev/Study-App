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
      const gmailUser = process.env.GMAIL_USER;
      const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

      console.log("📧 Email send request received");
      console.log("Gmail User:", gmailUser ? "✅ Set" : "❌ Missing");
      console.log(
        "Gmail App Password:",
        gmailAppPassword
          ? `✅ Set (Length: ${gmailAppPassword.length})`
          : "❌ Missing",
      );

      if (!gmailUser || !gmailAppPassword) {
        console.error("❌ Gmail credentials not configured");
        return res.status(500).json({
          error: "Gmail credentials not configured",
          message: "Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env file",
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

      // Create Nodemailer transporter with Gmail
      // Create Nodemailer transporter with Gmail Service (handles ports/secure automatically)
      console.log("📮 Creating email transporter (service: gmail)...");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPassword?.replace(/\s/g, ""), // Strip spaces
        },
      });

      // Send email
      console.log("📤 Sending email to:", to);
      const info = await transporter.sendMail({
        from: `StudySync <${gmailUser}>`,
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
        errorMessage = "Authentication failed: Check email and app password";
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
      const gmailUser = process.env.GMAIL_USER;
      const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

      if (!gmailUser || !gmailAppPassword) {
        return res.status(500).json({
          success: false,
          message: "Credentials missing in environment variables",
        });
      }

      console.log("🔍 Verifying email connection...");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPassword?.replace(/\s/g, ""),
        },
      });

      await transporter.verify();
      console.log("✅ Email connection verified successfully");

      return res.status(200).json({
        success: true,
        message: "Server is ready to take our messages",
        user: gmailUser,
      });
    } catch (error: any) {
      console.error("❌ Verification failed:", error);

      let errorMessage = "Verification failed";
      if (error.code === "EAUTH" || error.responseCode === 535) {
        errorMessage = "Authentication failed: Check email and app password";
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
