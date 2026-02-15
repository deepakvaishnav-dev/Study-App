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

// Basic Route
app.get("/", (req, res) => {
  res.send("StudySync API is running");
});

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/studysync";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4, // Force IPv4 to avoid Node.js v17+ IPv6 issues with Atlas
    });
    console.log("Connected to MongoDB");
  } catch (err: any) {
    console.error("Failed to connect to MongoDB", err);
    if (
      err.message &&
      (err.message.includes("SSL") || err.message.includes("TLS"))
    ) {
      console.error(
        "⚠️  POSSIBLE CAUSE: Your IP Address might not be whitelisted in MongoDB Atlas or there is a local firewall issue.",
      );
    }
    // Retry logic could be added here, but usually best to fail fast in dev
    // process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
