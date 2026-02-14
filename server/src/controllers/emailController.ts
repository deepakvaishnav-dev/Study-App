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

      if (!gmailUser || !gmailAppPassword) {
        return res.status(500).json({
          error: "Gmail credentials not configured",
          message: "Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env file",
        });
      }

      let { to, subject, html, templateType, templateData } = req.body;

      if (!to || !subject) {
        return res
          .status(400)
          .json({ error: "Missing required fields: to, subject" });
      }

      // Generate HTML from template if provided
      if (!html && templateType && templateData) {
        try {
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
              return res.status(400).json({ error: "Invalid template type" });
          }
        } catch (renderError: any) {
          console.error("Error rendering email template:", renderError);
          return res
            .status(500)
            .json({
              error: "Failed to render email template",
              details: renderError.message,
            });
        }
      }

      if (!html) {
        return res
          .status(400)
          .json({ error: "Missing HTML content or valid template data" });
      }

      // Create Nodemailer transporter with Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      // Send email
      const info = await transporter.sendMail({
        from: `StudySync <${gmailUser}>`,
        to: to,
        subject: subject,
        html: html,
      });

      console.log("Email sent successfully:", info.messageId);

      return res.status(200).json({
        success: true,
        messageId: info.messageId,
        message: "Email sent successfully",
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({
        error: "Failed to send email",
        details: error.message,
      });
    }
  },
};
