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
        gmailAppPassword ? "✅ Set" : "❌ Missing",
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
      console.log("📮 Creating email transporter...");
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
        // Force IPv4 for Render compatibility
        family: 4,
        // Add detailed logging and increased timeouts
        logger: true,
        debug: true,
        connectionTimeout: 60000, // 60s
        greetingTimeout: 30000, // 30s
        socketTimeout: 60000, // 60s
      } as any);

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
      console.error("❌ Error sending email:");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      res.status(500).json({
        error: "Failed to send email",
        details: error.message,
      });
    }
  },
};
