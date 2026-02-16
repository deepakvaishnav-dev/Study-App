import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { render } from "@react-email/render";
import { TestResultEmail } from "../email-services/EmailTemplates";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const debugEmail = async () => {
  console.log("🔍 Starting Email Debug Script...");

  // 1. Check Credentials
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  console.log("1️⃣ Checking Credentials...");
  console.log(`   User: ${gmailUser}`);
  console.log(
    `   Password: ${gmailAppPassword ? `Present (${gmailAppPassword.length} chars)` : "MISSING"}`,
  );

  if (!gmailUser || !gmailAppPassword) {
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

  // 3. Test Email Sending
  console.log("3️⃣ Testing Email Sending (Port 587)...");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: gmailUser,
      pass: gmailAppPassword.replace(/\s/g, ""),
    },
    debug: true, // Enable debug logs
    logger: true, // Enable logger
  });

  try {
    await transporter.verify();
    console.log("   ✅ Transporter Verified (Connection OK)");

    const info = await transporter.sendMail({
      from: `Debug <${gmailUser}>`,
      to: gmailUser, // Send to self
      subject: "Debug Email - Template & Send",
      html: htmlContent,
    });
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error: any) {
    console.error("❌ Sending Failed:");
    console.error("   Code:", error.code);
    console.error("   Response:", error.response);
    console.error("   Message:", error.message);
  }
};

debugEmail();
