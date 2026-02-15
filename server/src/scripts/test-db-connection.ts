import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from the server directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

console.log("--- MongoDB Connection Test Script v2 ---");
console.log(`Node Version: ${process.version}`);
console.log(`Attempting to connect...`);

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI is not defined in .env file");
  process.exit(1);
}

// Mask password for safe logging
const safeURI = MONGODB_URI.replace(/:([^@]+)@/, ":****@");
console.log(`URI: ${safeURI}`);

const run = async () => {
  try {
    // Attempt connection with increased timeout and IPv4 forced
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout
      family: 4, // Force IPv4
    });
    console.log("✅ SUCCESS: Connected to MongoDB successfully!");

    await mongoose.disconnect();
    console.log("Disconnected gracefully.");
  } catch (error: any) {
    console.error("\n❌ CONNECTION FAILED");
    console.error("Error Name:", error.name);
    console.error("Error Code:", error.code);
    console.error("Message:", error.message);

    if (error.codeName === "AtlasError" && error.code === 8000) {
      console.log("\n🚨 CRITICAL: AUTHENTICATION FAILED");
      console.log(
        'The "bad auth" error means your Username or Password in .env is INCORRECT.',
      );
      console.log(
        "Action: Update MONGODB_URI in server/.env with the correct password.",
      );
    } else if (error.message.includes("SSL") || error.message.includes("TLS")) {
      console.log("\n⚠️  SSL ERROR");
      console.log(
        "Action: Ensure your IP is Whitelisted in Atlas Network Access.",
      );
    }
  }
};

run();
