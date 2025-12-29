import express from "express";
import {
    getSocialMediaIcons,
    createSocialMediaIcons,
    updateSocialMediaIcons,
    deleteSocialMediaIcons,
    getActiveSocialMediaIcons
} from "./SocialMediaIcon.controller.js";

const SocialMediaIconrouter = express.Router();

// Get all
SocialMediaIconrouter.get("/", getSocialMediaIcons);

// Create
SocialMediaIconrouter.post("/", createSocialMediaIcons);

SocialMediaIconrouter.get("/active", getActiveSocialMediaIcons);

// Update
SocialMediaIconrouter.put("/:id", updateSocialMediaIcons);

// Delete
SocialMediaIconrouter.delete("/:id", deleteSocialMediaIcons);

export default SocialMediaIconrouter;
