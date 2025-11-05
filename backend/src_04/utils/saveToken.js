const { google } = require("googleapis");
const dotenv = require("dotenv");
const path = require("path");

// Load env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

async function getToken() {
  try {
    // Take code from command line: node saveToken.js <your_code>
    const code = process.argv[2];
    if (!code) {
      console.error("❌ Please provide the authorization code: node saveToken.js <code>");
      process.exit(1);
    }

    const { tokens } = await oauth2Client.getToken(code);
    console.log("✅ Tokens received:", tokens);

    // Optionally save tokens to a file
    const fs = require("fs");
    fs.writeFileSync("token.json", JSON.stringify(tokens, null, 2));
    console.log("💾 Tokens saved to token.json");
  } catch (err) {
    console.error("❌ Error while getting tokens:", err.response?.data || err.message);
  }
}

getToken();
