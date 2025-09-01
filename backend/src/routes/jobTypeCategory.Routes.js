import express from "express";
import {
    createjobTypeCategory,
    getAlljobTypeCategories,
    getjobTypeCategoryById,
    updatejobTypeCategory,
    deletejobTypeCategory
} from "../controllers/jobTypeCategory.controller.js";

const jobTypeCategoryRouter = express.Router();

// Create
jobTypeCategoryRouter.post("/", createjobTypeCategory);

// Read all
jobTypeCategoryRouter.get("/", getAlljobTypeCategories);

// Read one
jobTypeCategoryRouter.get("/:id", getjobTypeCategoryById);

// Update
jobTypeCategoryRouter.put("/:id", updatejobTypeCategory);

// Delete
jobTypeCategoryRouter.delete("/:id", deletejobTypeCategory);

export default jobTypeCategoryRouter;
