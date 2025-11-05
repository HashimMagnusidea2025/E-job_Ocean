import express from "express";
import {
    createNoofOfficeCategory,
    getAllNoofOfficeCategories,
    getNoofOfficeCategoryById,
    updateNoofOfficeCategory,
    deleteNoofOfficeCategory,
    getActiveNoofOfficeCategories
} from "../controllers/NoofOfficeCategory.controller.js";

const NoofOfficeCategoryRouter = express.Router();

// Create
NoofOfficeCategoryRouter.post("/", createNoofOfficeCategory);

// Read all
NoofOfficeCategoryRouter.get("/", getAllNoofOfficeCategories);


NoofOfficeCategoryRouter.get("/active/:id", getActiveNoofOfficeCategories);
// Read one
NoofOfficeCategoryRouter.get("/:id", getNoofOfficeCategoryById);

// Update
NoofOfficeCategoryRouter.put("/:id", updateNoofOfficeCategory);

// Delete
NoofOfficeCategoryRouter.delete("/:id", deleteNoofOfficeCategory);

export default NoofOfficeCategoryRouter;
