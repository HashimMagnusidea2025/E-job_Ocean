import express from "express";
import {
    createDegreeTypeCategory,
    getAllDegreeTypeCategories,
    getDegreeTypeCategoryById,
    updateDegreeTypeCategory,
    deleteDegreeTypeCategory,
    getActiveDegreeTypeCategories
} from "../controllers/DegreeTypeCategory.controller.js";

const DegreeTypeCategoryRouter = express.Router();

// Create
DegreeTypeCategoryRouter.post("/", createDegreeTypeCategory);


DegreeTypeCategoryRouter.get("/active", getActiveDegreeTypeCategories);
// Read all
DegreeTypeCategoryRouter.get("/", getAllDegreeTypeCategories);

// Read one
DegreeTypeCategoryRouter.get("/:id", getDegreeTypeCategoryById);

// Update
DegreeTypeCategoryRouter.put("/:id", updateDegreeTypeCategory);

// Delete
DegreeTypeCategoryRouter.delete("/:id", deleteDegreeTypeCategory);

export default DegreeTypeCategoryRouter;
