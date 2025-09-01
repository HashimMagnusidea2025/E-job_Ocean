import express from "express";
import {
    createjobShiftCategory,
    getAlljobShiftCategories,
    getjobShiftCategoryById,
    updatejobShiftCategory,
    deletejobShiftCategory
} from "../controllers/jobShiftCategory.controller.js";

const jobShiftCategoryRouter = express.Router();

// Create
jobShiftCategoryRouter.post("/", createjobShiftCategory);

// Read all
jobShiftCategoryRouter.get("/", getAlljobShiftCategories);

// Read one
jobShiftCategoryRouter.get("/:id", getjobShiftCategoryById);

// Update
jobShiftCategoryRouter.put("/:id", updatejobShiftCategory);

// Delete
jobShiftCategoryRouter.delete("/:id", deletejobShiftCategory);

export default jobShiftCategoryRouter;
