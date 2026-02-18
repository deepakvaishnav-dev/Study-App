import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

const testEmail = async () => {
  const {
    GMAIL_USER,
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
  } = process.env;

  console.log("Testing Email Sending (OAuth2)...");
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

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: GMAIL_USER,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
    },
  } as any);

  try {
    const info = await transporter.sendMail({
      from: `Test <${GMAIL_USER}>`,
      to: GMAIL_USER, // Send to self
      subject: "Test Email from Script (OAuth2)",
      text: "If you see this, nodemailer is working with Gmail OAuth2.",
    });
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error: any) {
    console.error("❌ Error sending email:", error);
  }
};

testEmail();
