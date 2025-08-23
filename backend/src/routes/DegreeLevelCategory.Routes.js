import express from "express";
import {
    createDegreeLevelCategory,
    getAllDegreeLevelCategories,
    getDegreeLevelCategoryById,
    updateDegreeLevelCategory,
    deleteDegreeLevelCategory
} from "../controllers/DegreeLevelCategory.controller.js";

const DegreeLevelCategoryRouter = express.Router();

// Create
DegreeLevelCategoryRouter.post("/", createDegreeLevelCategory);

// Read all
DegreeLevelCategoryRouter.get("/", getAllDegreeLevelCategories);

// Read one
DegreeLevelCategoryRouter.get("/:id", getDegreeLevelCategoryById);

// Update
DegreeLevelCategoryRouter.put("/:id", updateDegreeLevelCategory);

// Delete
DegreeLevelCategoryRouter.delete("/:id", deleteDegreeLevelCategory);

export default DegreeLevelCategoryRouter;
