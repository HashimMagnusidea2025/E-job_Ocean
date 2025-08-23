import express from "express";
import {
    createSkillsCategory,
    getAllSkillsCategories,
    getSkillsCategoryById,
    updateSkillsCategory,
    deleteSkillsCategory
} from "../controllers/SkillsCategory.controller.js";

const router = express.Router();

// Create
router.post("/", createSkillsCategory);

// Read all
router.get("/", getAllSkillsCategories);

// Read one
router.get("/:id", getSkillsCategoryById);

// Update
router.put("/:id", updateSkillsCategory);

// Delete
router.delete("/:id", deleteSkillsCategory);

export default router;
