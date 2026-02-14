import mongoose from "mongoose";
import User from "../models/User";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/studysync";
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");

    const email = "studysyncrudrani@gmail.com";
    const password = "RudraniTeams@1012@23";
    const name = "Admin Rudrani";

    let user = await User.findOne({ email });

    if (user) {
      user.isAdmin = true;
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      console.log("Admin user updated successfully");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
        isAdmin: true,
        formattedDate: new Date(),
      });

      await user.save();
      console.log("Admin user created successfully");
    }

    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
