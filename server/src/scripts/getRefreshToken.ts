import dotenv from "dotenv";
import path from "path";
import https from "https";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

const exchangeCode = async (code: string) => {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  // This MUST match the redirect URI used in generateAuthUrl.ts
  const redirectUri = "https://study-app-server-224a.onrender.com/auth/google";

  if (!clientId || !clientSecret) {
    console.error("❌ Client ID or Secret missing in .env");
    return;
  }

  console.log("🔄 Exchanging code for tokens...");
  console.log(`   Code: ${code.substring(0, 10)}...`);
  console.log(`   Redirect URI: ${redirectUri}`);

  const postData = new URLSearchParams({
    code: code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  }).toString();

  const options = {
    hostname: "oauth2.googleapis.com",
    port: 443,
    path: "/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length,
    },
  };

  const req = https.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const response = JSON.parse(data);
        if (response.error) {
          console.error("❌ Error exchanging code:");
          console.error(JSON.stringify(response, null, 2));
        } else {
          console.log("\n✅ SUCCESS! Here is your Refresh Token:\n");
          console.log(response.refresh_token);
          console.log(
            "\n👉 Add this to your .env file as GMAIL_REFRESH_TOKEN\n",
          );
        }
      } catch (e) {
        console.error("❌ Failed to parse response:", e);
        console.error("Response:", data);
      }
    });
  });

  req.on("error", (e) => {
    console.error("❌ Request error:", e);
  });

  req.write(postData);
  req.end();
};

// Get code from command line argument
const code = process.argv[2];
if (!code) {
  console.log(
    "Usage: npx ts-node src/scripts/getRefreshToken.ts <authorization_code>",
  );
} else {
  exchangeCode(code);
}
