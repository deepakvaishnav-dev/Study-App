import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

const testEmail = async () => {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  console.log("Testing Email Sending...");
  console.log("User:", gmailUser);
  console.log(
    "Password length:",
    gmailAppPassword ? gmailAppPassword.length : 0,
  );

  if (!gmailUser || !gmailAppPassword) {
    console.error("❌ Credentials missing in .env");
    return;
  }

  // Strip spaces from app password just in case
  const cleanPassword = gmailAppPassword.replace(/\s/g, "");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: gmailUser,
      pass: cleanPassword, // Try with cleaned password
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `Test <${gmailUser}>`,
      to: gmailUser, // Send to self
      subject: "Test Email from Script",
      text: "If you see this, nodemailer is working with the provided credentials.",
    });
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error: any) {
    console.error("❌ Error sending email:", error);
  }
};

testEmail();
