import express from "express";
import CMSPageControllers from "./CMS.controller.js";

const CMSPageRoutes = express.Router();
const CMSPageController = new CMSPageControllers();

// Create
CMSPageRoutes.post("/", (req, res) => CMSPageController.CreateCMSPage(req, res));

// Get all
CMSPageRoutes.get("/", (req, res) => CMSPageController.getCMSPage(req, res));

// Update
CMSPageRoutes.put("/:id", (req, res) => CMSPageController.UpdateCMSPage(req, res));

// Delete
CMSPageRoutes.delete("/:id", (req, res) => CMSPageController.DeleteCMSPage(req, res));

// Toggle Status
CMSPageRoutes.patch("/:id/toggle", (req, res) => CMSPageController.ToggleCMSPage(req, res));

export default CMSPageRoutes;
