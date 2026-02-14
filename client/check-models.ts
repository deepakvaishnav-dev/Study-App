import * as dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.VITE_API_KEY;

if (!apiKey) {
  console.error("No API key found in .env");
  process.exit(1);
}

console.log("Using API Key:", apiKey.substring(0, 10) + "...");

// const ai = new GoogleGenAI({
//   apiKey: apiKey,
//   apiVersion: "v1beta",
// });

async function listModels() {
  try {
    console.log("Fetching models...");
    // Note: The Node SDK might not exposes listModels directly on the main instance easily in all versions,
    // using fetch for direct API call to be sure.

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );

    if (!response.ok) {
      console.error(`Error ${response.status}: ${response.statusText}`);
      const text = await response.text();
      console.error(text);
      return;
    }

    const data = await response.json();
    console.log("\nAvailable Models:");
    if (data.models) {
      data.models.forEach(
        (m: {
          name: string;
          displayName: string;
          supportedGenerationMethods?: string[];
        }) => {
          const name = m.name.replace("models/", "");
          if (
            m.supportedGenerationMethods &&
            m.supportedGenerationMethods.includes("generateContent") &&
            name.includes("pro")
          ) {
            console.log(`- ${name} (${m.displayName})`);
          }
        },
      );
    } else {
      console.log("No models field in response.");
      console.log(data);
    }
  } catch (error) {
    console.error("Failed to list models:", error);
  }
}

listModels();
