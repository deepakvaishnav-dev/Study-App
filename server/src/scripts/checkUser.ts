import mongoose from "mongoose";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const checkAdmin = async () => {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/studysync";
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");

    const email = "studysyncrudrani@gmail.com";
    const user = await User.findOne({ email });

    if (user) {
      console.log("User found:");
      console.log("ID:", user._id);
      console.log("Email:", user.email);
      console.log("IsAdmin:", user.isAdmin);
    } else {
      console.log("User NOT found");
    }

    process.exit();
  } catch (error) {
    console.error("Error checking admin:", error);
    process.exit(1);
  }
};

checkAdmin();
