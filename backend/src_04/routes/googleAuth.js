import express from "express";
import { getAuthUrl, setTokens } from "../utils/googleAuth.js";
import fs from "fs";

const router = express.Router();

// Step 1: Send user to Google OAuth consent screen
router.get("/auth-url", (req, res) => {
  const url = getAuthUrl();
  res.json({ url });
});

// Step 2: Google callback with code
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    const tokens = await setTokens(code);

    // Optionally save refresh token to .env
    if (tokens.refresh_token) {
      fs.appendFileSync(".env", `\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    }

    // After success, redirect to your frontend dashboard
    res.redirect("http://localhost:5173/admin-dashboard"); 
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
