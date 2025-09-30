import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKEN_PATH = path.join(__dirname, "./token.json"); // store refresh token here

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Step 1: Generate OAuth URL
export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: "offline", // important to get refresh token
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
};

// Step 2: Save tokens after first auth
export const setTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Store refresh token to file for persistent use
  if (tokens.refresh_token) {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  }

  return tokens;
};

// Step 3: Load refresh token on server start
export const loadTokens = () => {
  if (fs.existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oauth2Client.setCredentials(tokens);
  }
};

// Step 4: Force refresh access token when expired
export const getAccessToken = async () => {
  try {
    loadTokens();
    const accessToken = await oauth2Client.getAccessToken();
    return accessToken.token; // always fresh
  } catch (err) {
    console.error("Error getting access token:", err);
    throw err;
  }
};
