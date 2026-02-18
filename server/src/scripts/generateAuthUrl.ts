import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const generateUrl = () => {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("❌ Client ID or Secret missing in .env");
    return;
  }

  // Common Redirect URIs to try
  const redirectUri =
    "https://study-app-server-224a.onrender.com/auth/google/callback";
  // Alternate: "http://localhost" if the above fails

  const scope = "https://mail.google.com/";

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `access_type=offline&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `prompt=consent`; // Force consent to ensure refresh token is returned

  console.log("\n====== COPY AND PASTE THIS URL IN YOUR BROWSER ======\n");
  console.log(authUrl);
  console.log("\n========================================================\n");
  console.log("1. Login with your Google Account.");
  console.log("2. Allow permissions.");
  console.log("3. You will be redirected to the OAuth Playground.");
  console.log(
    "4. Copy the 'Authorization Code' from the step 2 box logic (or url query param).",
  );
  console.log("5. Paste that code here in the chat.");
};

generateUrl();
