import express from "express";
import {
    createCareerCategory,
    getAllCareerCategories,
    getCareerCategoryById,
    updateCareerCategory,
    deleteCareerCategory
} from "../controllers/CareerCategory.controller.js";

const CareerCategoryRouter = express.Router();

// Create
CareerCategoryRouter.post("/", createCareerCategory);

// Read all
CareerCategoryRouter.get("/", getAllCareerCategories);

// Read one
CareerCategoryRouter.get("/:id", getCareerCategoryById);

// Update
CareerCategoryRouter.put("/:id", updateCareerCategory);

// Delete
CareerCategoryRouter.delete("/:id", deleteCareerCategory);

export default CareerCategoryRouter;
