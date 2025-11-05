import express from "express";
import {
    createCompanyCategory,
    getAllCompanyCategories,
    getCompanyCategoryById,
    updateCompanyCategory,
    deleteCompanyCategory,
    getActiveCompanyCategories
} from "../controllers/CompanyCategory.controller.js";

const CompanyCategoryRouter = express.Router();

// Create
CompanyCategoryRouter.post("/", createCompanyCategory);

// Read all
CompanyCategoryRouter.get("/", getAllCompanyCategories);

// Read one
CompanyCategoryRouter.get("/:id", getCompanyCategoryById);

// Update
CompanyCategoryRouter.put("/:id", updateCompanyCategory);

// Delete
CompanyCategoryRouter.delete("/:id", deleteCompanyCategory);

CompanyCategoryRouter.get("/active/:id", getActiveCompanyCategories);

export default CompanyCategoryRouter;
