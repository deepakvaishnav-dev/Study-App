import api from "./src/services/api";

// Define Type locally to avoid dependency on @google/genai
const Type = {
  STRING: "STRING",
  NUMBER: "NUMBER",
  INTEGER: "INTEGER",
  BOOLEAN: "BOOLEAN",
  ARRAY: "ARRAY",
  OBJECT: "OBJECT",
};

const requestQueue: (() => void)[] = [];
let isProcessing = false;
let lastRequestTime = 0;
const MIN_DELAY = 2000;

// Quota and rate limit state
let isQuotaExhausted = false;
let quotaResetTime = 0;
let isRateLimited = false;
let rateLimitResetTime = 0;
// Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to be environment agnostic
let quotaResetTimeout: ReturnType<typeof setTimeout> | null = null;

// Listeners for quota status changes
const quotaListeners: Set<() => void> = new Set();

export const onQuotaStatusChange = (callback: () => void) => {
  quotaListeners.add(callback);
  return () => quotaListeners.delete(callback);
};

const notifyQuotaListeners = () => {
  quotaListeners.forEach((callback) => callback());
};

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  isProcessing = true;

  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_DELAY) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_DELAY - timeSinceLastRequest),
    );
  }

  const next = requestQueue.shift();
  if (next) await next();
  lastRequestTime = Date.now();
  isProcessing = false;
  processQueue();
};

const enqueueRequest = <T>(fn: () => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    // Check if quota is exhausted
    if (isQuotaExhausted) {
      const remainingTime = Math.max(0, quotaResetTime - Date.now());
      const hoursRemaining = Math.ceil(remainingTime / (1000 * 60 * 60));
      reject(
        new Error(
          `QUOTA_EXHAUSTED: Please wait ${hoursRemaining} hour(s) for daily reset or upgrade your plan.`,
        ),
      );
      return;
    }

    // Check if rate limited
    if (isRateLimited && Date.now() < rateLimitResetTime) {
      const remainingTime = rateLimitResetTime - Date.now();
      reject(
        new Error(
          `RATE_LIMITED: Please wait ${Math.ceil(remainingTime / 1000)} seconds before trying again.`,
        ),
      );
      return;
    }

    requestQueue.push(async () => {
      try {
        const result = await fn();
        isRateLimited = false;
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
};

interface GoogleApiError {
  code?: number;
  status?: string;
  message?: string;
  details?: ErrorDetail[];
}

interface ErrorDetail {
  "@type"?: string;
  retryDelay?: string;
  violations?: QuotaViolation[];
}

interface QuotaViolation {
  quotaId?: string;
}

const parseApiError = (error: any): GoogleApiError | null => {
  if (error.response?.data?.error) {
    const backendError = error.response.data.error;
    // Attempt to parse if it resembles a Google API error forwarded
    if (typeof backendError === "string") {
      try {
        return JSON.parse(backendError);
      } catch {
        return { message: backendError };
      }
    }
    return backendError;
  }
  return null;
};

const getRetryDelay = (error: any): number | null => {
  // If backend forwards 429
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers?.["retry-after"];
    if (retryAfter) return parseInt(retryAfter) * 1000;
  }
  return null;
};

const isDailyQuotaExhausted = (error: any): boolean => {
  // If backend signals quota exhausted specifically
  // You might need to adjust this based on how your backend handles it
  // For now assuming 503 or specific message
  const parsed = parseApiError(error);
  if (
    parsed?.message?.includes("quota") &&
    parsed?.message?.includes("limit: 0")
  )
    return true;
  return false;
};

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  baseDelay: number = 3000,
): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const parsedError = parseApiError(error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      const retryDelay = getRetryDelay(error);

      // Check for network errors
      const isNetworkError =
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("NetworkError") ||
        errorMessage.includes("ERR_NETWORK_CHANGED") ||
        !error.response; // No response often means network error

      // Check for daily quota exhausted
      const isQuotaExhaustedError = isDailyQuotaExhausted(error);

      // Check for temporary rate limits (can be retried)
      const isTemporaryRateLimit =
        (error.response?.status === 429 || parsedError?.code === 429) &&
        !isQuotaExhaustedError;

      // Handle daily quota exhausted - DO NOT RETRY
      if (isQuotaExhaustedError) {
        isQuotaExhausted = true;
        quotaResetTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        if (quotaResetTimeout) {
          clearTimeout(quotaResetTimeout);
        }
        quotaResetTimeout = setTimeout(
          () => {
            isQuotaExhausted = false;
            quotaResetTime = 0;
            quotaResetTimeout = null;
            notifyQuotaListeners();
            console.log(
              "Daily quota reset. You can now make API requests again.",
            );
          },
          24 * 60 * 60 * 1000,
        );

        notifyQuotaListeners();
        console.error(
          "Daily quota exhausted. Please wait 24 hours or upgrade your plan.",
        );
        throw new Error(
          "QUOTA_EXHAUSTED: The free tier daily limit has been reached.",
        );
      }

      // Retry on network errors or temporary rate limits
      if ((isNetworkError || isTemporaryRateLimit) && attempt < maxRetries) {
        if (isTemporaryRateLimit) {
          isRateLimited = true;
          const delay = retryDelay || baseDelay * Math.pow(2, attempt);
          rateLimitResetTime = Date.now() + delay;

          console.warn(
            `Temporary rate limit, retrying in ${Math.ceil(delay / 1000)}s... (attempt ${attempt + 1}/${maxRetries + 1})`,
          );
        } else if (isNetworkError) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.warn(
            `Network error, retrying in ${Math.ceil(delay / 1000)}s... (attempt ${attempt + 1}/${maxRetries + 1})`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        const delay = retryDelay || baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Log and throw non-retryable errors
      console.error("Non-retryable error encountered:", parsedError || error);
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
};

// Generate AI Notes
export const generateAINotes = async (topic: string, subject: string) => {
  return await enqueueRequest(() =>
    retryWithBackoff(async () => {
      const response = await api.post("/gemini/generate", {
        model: "gemini-2.5-flash-lite",
        contents: `Generate detailed study notes for the topic "${topic}" in the subject "${subject}". 
Include:
1. Introduction
2. Key Concepts (Bullet points)
3. Important Diagrams description
4. Formulas (if applicable)
5. Summary
Use Markdown format.`,
        config: {
          temperature: 0.7,
          topP: 0.95,
        },
      });
      return response.data.text;
    }),
  );
};

// Generate Question Paper
export const generateQuestionPaper = async (
  subject: string,
  chapter: string,
  difficulty: string,
) => {
  return await enqueueRequest(() =>
    retryWithBackoff(async () => {
      const response = await api.post("/gemini/generate", {
        model: "gemini-2.5-flash-lite",
        contents: `Create a question paper for ${subject}, Chapter: ${chapter}, Difficulty: ${difficulty}.
Provide exactly 10 MCQs, 5 short answer questions, and 5 long answer questions.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    type: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                  },
                  required: [
                    "id",
                    "text",
                    "correctAnswer",
                    "type",
                    "difficulty",
                  ],
                },
              },
            },
            required: ["questions"],
          },
        },
      });

      try {
        return JSON.parse(response.data.text?.trim() || "{}");
      } catch {
        console.error("Failed to parse AI response as JSON");
        return { questions: [] };
      }
    }),
  );
};

// Export quota status for UI
export { isQuotaExhausted, quotaResetTime };

// Helper to get quota status
export const getQuotaStatus = () => ({
  isExhausted: isQuotaExhausted,
  resetTime: quotaResetTime,
  hoursUntilReset: isQuotaExhausted
    ? Math.ceil((quotaResetTime - Date.now()) / (1000 * 60 * 60))
    : 0,
  minutesUntilReset: isQuotaExhausted
    ? Math.ceil((quotaResetTime - Date.now()) / (1000 * 60))
    : 0,
});

// Manual reset function (for testing or when user upgrades)
export const resetQuotaStatus = () => {
  isQuotaExhausted = false;
  quotaResetTime = 0;
  if (quotaResetTimeout) {
    clearTimeout(quotaResetTimeout);
    quotaResetTimeout = null;
  }
  notifyQuotaListeners();
  console.log("Quota status manually reset.");
};
