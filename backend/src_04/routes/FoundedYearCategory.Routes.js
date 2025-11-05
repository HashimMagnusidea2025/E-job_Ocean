import express from "express";
import {
    createFoundedYearCategory,
    getAllFoundedYearCategories,
    getFoundedYearCategoryById,
    updateFoundedYearCategory,
    deleteFoundedYearCategory
} from "../controllers/FoundedYearCategory.controller.js";

const FoundedYearCategoryRouter = express.Router();

// Create
FoundedYearCategoryRouter.post("/", createFoundedYearCategory);

// Read all
FoundedYearCategoryRouter.get("/", getAllFoundedYearCategories);

// Read one
FoundedYearCategoryRouter.get("/:id", getFoundedYearCategoryById);

// Update
FoundedYearCategoryRouter.put("/:id", updateFoundedYearCategory);

// Delete
FoundedYearCategoryRouter.delete("/:id", deleteFoundedYearCategory);

export default FoundedYearCategoryRouter;
