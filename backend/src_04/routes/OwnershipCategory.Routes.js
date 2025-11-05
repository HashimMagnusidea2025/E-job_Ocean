import express from "express";
import {
    createOwnershipCategory,
    getAllOwnershipCategories,
    getOwnershipCategoryById,
    updateOwnershipCategory,
    deleteOwnershipCategory,
    getActiveOwnershipCategories
  
} from "../controllers/OwnershipCategory.controller.js";

const OwnershipCategoryRouter = express.Router();

// Create
OwnershipCategoryRouter.post("/", createOwnershipCategory);

// Read all
OwnershipCategoryRouter.get("/", getAllOwnershipCategories);

OwnershipCategoryRouter.get("/active/:id", getActiveOwnershipCategories);

// Read one
OwnershipCategoryRouter.get("/:id", getOwnershipCategoryById);

// Update
OwnershipCategoryRouter.put("/:id", updateOwnershipCategory);

// Delete
OwnershipCategoryRouter.delete("/:id", deleteOwnershipCategory);

export default OwnershipCategoryRouter;
