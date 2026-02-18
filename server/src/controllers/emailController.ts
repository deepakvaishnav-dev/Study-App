import { Request, Response } from "express";
import nodemailer from "nodemailer";
// @ts-ignore
import MailComposer from "nodemailer/lib/mail-composer";
import { google } from "googleapis";
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

      // OAuth2 Setup for Google APIs
      const oAuth2Client = new google.auth.OAuth2(
        GMAIL_CLIENT_ID,
        GMAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground", // Redirect URI
      );

      oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

      // Create a new MailComposer instance to generate the raw email
      // We use nodemailer just for formatting, NOT for sending via SMTP
      const mailComposer = new MailComposer({
        from: `StudySync <${GMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
      });

      const message = await mailComposer.compile().build();
      const rawMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      console.log("📤 Sending email via Gmail API...");

      const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

      const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: rawMessage,
        },
      });

      console.log("✅ Email sent successfully:", response.data.id);

      return res.status(200).json({
        success: true,
        messageId: response.data.id,
        message: "Email sent successfully",
      });
    } catch (error: any) {
      console.error("❌ Error sending via Gmail API:", error);
      console.error("❌ Error details:", error.message);
      if (error.response) {
        console.error("❌ API Response Error:", error.response.data);
      }

      let errorMessage = "Failed to send email";
      if (error.code === 401 || error.code === 403) {
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

      console.log("🔍 Verifying Gmail API connection...");

      const oAuth2Client = new google.auth.OAuth2(
        GMAIL_CLIENT_ID,
        GMAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground",
      );

      oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

      const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

      // Check profile to verify credentials
      await gmail.users.getProfile({ userId: "me" });

      console.log("✅ Gmail API connection verified successfully");

      return res.status(200).json({
        success: true,
        message: "Server is ready to send emails via Gmail API",
        user: GMAIL_USER,
      });
    } catch (error: any) {
      console.error("❌ Verification failed:", error);

      let errorMessage = "Verification failed";
      if (error.code === 401 || error.code === 403) {
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
