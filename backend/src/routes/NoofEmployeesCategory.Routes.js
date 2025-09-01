import express from "express";
import {
    createNoofEmployeesCategory,
    getAllNoofEmployeesCategories,
    getNoofEmployeesCategoryById,
    updateNoofEmployeesCategory,
    deleteNoofEmployeesCategory,
    getActiveNoofEmployeesCategories
} from "../controllers/NoofEmployeesCategory.controller.js";

const NoofEmployeesCategoryRouter = express.Router();

// Create
NoofEmployeesCategoryRouter.post("/", createNoofEmployeesCategory);

// Read all
NoofEmployeesCategoryRouter.get("/", getAllNoofEmployeesCategories);

NoofEmployeesCategoryRouter.get("/active/:id", getActiveNoofEmployeesCategories);
// Read one
NoofEmployeesCategoryRouter.get("/:id", getNoofEmployeesCategoryById);

// Update
NoofEmployeesCategoryRouter.put("/:id", updateNoofEmployeesCategory);

// Delete
NoofEmployeesCategoryRouter.delete("/:id", deleteNoofEmployeesCategory);

export default NoofEmployeesCategoryRouter;
