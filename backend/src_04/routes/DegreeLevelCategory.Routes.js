import express from "express";
import {
    createDegreeLevelCategory,
    getAllDegreeLevelCategories,
    getDegreeLevelCategoryById,
    updateDegreeLevelCategory,
    deleteDegreeLevelCategory,
    getActiveDegreeLevelCategories
} from "../controllers/DegreeLevelCategory.controller.js";

const DegreeLevelCategoryRouter = express.Router();

// Create
DegreeLevelCategoryRouter.post("/", createDegreeLevelCategory);


DegreeLevelCategoryRouter.get("/active", getActiveDegreeLevelCategories);
// Read all
DegreeLevelCategoryRouter.get("/", getAllDegreeLevelCategories);

// Read one
DegreeLevelCategoryRouter.get("/:id", getDegreeLevelCategoryById);

// Update
DegreeLevelCategoryRouter.put("/:id", updateDegreeLevelCategory);

// Delete
DegreeLevelCategoryRouter.delete("/:id", deleteDegreeLevelCategory);

export default DegreeLevelCategoryRouter;
