import express from "express";
import {
    createFunctionalAreaCategory,
    getAllFunctionalAreaCategories,
    getFunctionalAreaCategoryById,
    updateFunctionalAreaCategory,
    deleteFunctionalAreaCategory,
    getActiveFunctionalAreaCategories
} from "../controllers/FunctionalAreaCategory.controller.js";

const FunctionalAreaCategoryRouter = express.Router();

// Create
FunctionalAreaCategoryRouter.post("/", createFunctionalAreaCategory);

FunctionalAreaCategoryRouter.get("/active", getActiveFunctionalAreaCategories);

// Read all
FunctionalAreaCategoryRouter.get("/", getAllFunctionalAreaCategories);

// Read one
FunctionalAreaCategoryRouter.get("/:id", getFunctionalAreaCategoryById);

// Update
FunctionalAreaCategoryRouter.put("/:id", updateFunctionalAreaCategory);

// Delete
FunctionalAreaCategoryRouter.delete("/:id", deleteFunctionalAreaCategory);

export default FunctionalAreaCategoryRouter;
