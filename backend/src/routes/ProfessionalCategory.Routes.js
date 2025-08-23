import express from 'express';

import {getGroupedProfessionalCategories, CreateProfessionalCategory,getAllProfessionalCategory,getProfessionalCategoryById,updateProfessionalCategory,deleteProfessionalCategory,toggleProfessionalCategoryStatus } from "../controllers/ProfessionalCategory.controller.js";

const ProfessionalCategoryRouter = express.Router();


ProfessionalCategoryRouter.post('/',CreateProfessionalCategory);

ProfessionalCategoryRouter.get('/professional', getGroupedProfessionalCategories);
ProfessionalCategoryRouter.get('/',getAllProfessionalCategory);
ProfessionalCategoryRouter.get('/:id', getProfessionalCategoryById);
ProfessionalCategoryRouter.put('/:id', updateProfessionalCategory);
ProfessionalCategoryRouter.delete('/:id',deleteProfessionalCategory);
ProfessionalCategoryRouter.patch('/toggle-status/:id',toggleProfessionalCategoryStatus);





export default ProfessionalCategoryRouter;

