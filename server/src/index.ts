import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import reportRoutes from "./routes/reportRoutes";
import userRoutes from "./routes/userRoutes";
import geminiRoutes from "./routes/geminiRoutes";
import emailRoutes from "./routes/emailRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/user", userRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "StudySync API is running",
  });
});

// Start server FIRST (important for Render)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    "📧 Email Config:",
    process.env.GMAIL_USER
      ? `User: ${process.env.GMAIL_USER.substring(0, 3)}***@***`
      : "User: MISSING",
  );
  console.log(
    "🔑 Email Password:",
    process.env.GMAIL_APP_PASSWORD
      ? `Set (${process.env.GMAIL_APP_PASSWORD.length} chars)`
      : "MISSING",
  );
});

// MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/studysync";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err: any) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

connectDB();

mongoose.connection.on("error", (err) => {
  console.error("MongoDB runtime error:", err);
});
