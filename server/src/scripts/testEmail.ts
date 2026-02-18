import nodemailer from "nodemailer";
// @ts-ignore
import MailComposer from "nodemailer/lib/mail-composer";
import dotenv from "dotenv";
import path from "path";
import { google } from "googleapis";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

const testEmail = async () => {
  const {
    GMAIL_USER,
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
  } = process.env;

  console.log("Testing Email Sending (Gmail API)...");
  console.log("User:", GMAIL_USER || "Missing");
  console.log("Client ID:", GMAIL_CLIENT_ID ? "Set" : "Missing");

  if (
    !GMAIL_USER ||
    !GMAIL_CLIENT_ID ||
    !GMAIL_CLIENT_SECRET ||
    !GMAIL_REFRESH_TOKEN
  ) {
    console.error("❌ OAuth Credentials missing in .env");
    return;
  }

  try {
    const oAuth2Client = new google.auth.OAuth2(
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground",
    );

    oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const mailComposer = new MailComposer({
      from: `Test <${GMAIL_USER}>`,
      to: GMAIL_USER, // Send to self
      subject: "Test Email from Script (Gmail API)",
      text: "If you see this, we are successfully using the Gmail API directly!",
    });

    const message = await mailComposer.compile().build();
    const rawMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    console.log("📤 Sending...");
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMessage,
      },
    });

    console.log("✅ Email sent successfully:", response.data.id);
  } catch (error: any) {
    console.error("❌ Error sending email:", error.message);
    if (error.response) {
      console.error("❌ API Response:", error.response.data);
    }
  }
};

testEmail();
