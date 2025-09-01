import express from "express";
import {
    createEstablishedInCategory,
    getAllEstablishedInCategories,
    getEstablishedInCategoryById,
    updateEstablishedInCategory,
    deleteEstablishedInCategory,
    getActiveEstablishedInCategories
} from "../controllers/EstablishedInCategory.controller.js";

const EstablishedInCategoryRouter = express.Router();

// Create
EstablishedInCategoryRouter.post("/", createEstablishedInCategory);

// Read all
EstablishedInCategoryRouter.get("/", getAllEstablishedInCategories);

EstablishedInCategoryRouter.get("/active/:id", getActiveEstablishedInCategories);
// Read one
EstablishedInCategoryRouter.get("/:id", getEstablishedInCategoryById);

// Update
EstablishedInCategoryRouter.put("/:id", updateEstablishedInCategory);

// Delete
EstablishedInCategoryRouter.delete("/:id", deleteEstablishedInCategory);

export default EstablishedInCategoryRouter;
