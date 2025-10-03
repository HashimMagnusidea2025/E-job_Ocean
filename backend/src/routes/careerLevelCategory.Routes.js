import express from "express";
import {
    createCareerLevelCategory,
    getAllCareerLevelCategories,
    getCareerLevelCategoryById,
    updateCareerLevelCategory,
    deleteCareerLevelCategory,
    getActiveCareerLevelCategories
} from "../controllers/CareerLevelCategory.controller.js";

const CareerLevelCategoryRouter = express.Router();

// Create
CareerLevelCategoryRouter.post("/", createCareerLevelCategory);
CareerLevelCategoryRouter.get("/active", getActiveCareerLevelCategories);
// Read all
CareerLevelCategoryRouter.get("/", getAllCareerLevelCategories);

// Read one
CareerLevelCategoryRouter.get("/:id", getCareerLevelCategoryById);

// Update
CareerLevelCategoryRouter.put("/:id", updateCareerLevelCategory);

// Delete
CareerLevelCategoryRouter.delete("/:id", deleteCareerLevelCategory);

export default CareerLevelCategoryRouter;
