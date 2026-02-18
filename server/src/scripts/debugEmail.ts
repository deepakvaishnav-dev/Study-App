import nodemailer from "nodemailer";
// @ts-ignore
import MailComposer from "nodemailer/lib/mail-composer";
import dotenv from "dotenv";
import path from "path";
import { google } from "googleapis";
import { render } from "@react-email/render";
import { TestResultEmail } from "../email-services/EmailTemplates";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const debugEmail = async () => {
  console.log("🔍 Starting Email Debug Script (Gmail API)...");

  // 1. Check Credentials
  const {
    GMAIL_USER,
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
  } = process.env;

  console.log("1️⃣ Checking Credentials...");
  console.log(`   User: ${GMAIL_USER}`);
  console.log(`   Client ID: ${GMAIL_CLIENT_ID ? "Present" : "MISSING"}`);
  console.log(
    `   Client Secret: ${GMAIL_CLIENT_SECRET ? "Present" : "MISSING"}`,
  );
  console.log(
    `   Refresh Token: ${GMAIL_REFRESH_TOKEN ? "Present" : "MISSING"}`,
  );

  if (
    !GMAIL_USER ||
    !GMAIL_CLIENT_ID ||
    !GMAIL_CLIENT_SECRET ||
    !GMAIL_REFRESH_TOKEN
  ) {
    console.error("❌ Credentials missing. Aborting.");
    process.exit(1);
  }

  // 2. Test Template Rendering
  console.log("2️⃣ Testing Template Rendering...");
  let htmlContent = "";
  try {
    const mockDetails = {
      subject: "Debug Test",
      score: 8,
      total: 10,
      percentage: "80",
      weakTopics: ["Topic A", "Topic B"],
      timeTaken: "5m 30s",
      questions: [],
    };

    // Fix: Call the component function directly as it might be used in the controller
    // Note: In the controller it is: TestResultEmail({ ... })
    const emailComponent = TestResultEmail({
      name: "Debug User",
      details: mockDetails,
    });

    htmlContent = await render(emailComponent);
    console.log("✅ Template rendered successfully!");
    // console.log("   HTML Preview:", htmlContent.substring(0, 100) + "...");
  } catch (error: any) {
    console.error("❌ Template Rendering Failed:", error);
    process.exit(1);
  }

  // 3. Test Email Sending via Gmail API
  console.log("3️⃣ Testing Email Sending (Gmail API)...");

  try {
    const oAuth2Client = new google.auth.OAuth2(
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground",
    );

    oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    // Verify connection first
    await gmail.users.getProfile({ userId: "me" });
    console.log("   ✅ Gmail API Connection Verified");

    const mailComposer = new MailComposer({
      from: `Debug <${GMAIL_USER}>`,
      to: GMAIL_USER, // Send to self
      subject: "Debug Email (Gmail API) - Template & Send",
      html: htmlContent,
    });

    const message = await mailComposer.compile().build();
    const rawMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    console.log("   📤 Sending...");
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: rawMessage,
      },
    });

    console.log("✅ Email sent successfully:", response.data.id);
  } catch (error: any) {
    console.error("❌ Sending Failed:");
    console.error("   Message:", error.message);
    if (error.response) {
      console.error("   API Response:", error.response.data);
    }
  }
};

debugEmail();
