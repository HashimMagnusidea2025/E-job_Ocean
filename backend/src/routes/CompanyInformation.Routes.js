import express from 'express';
import CompanyInformationController from '../controllers/CompanyInformation.controller.js';

import upload from '../middleware/multer.middleware.js'
const router = express.Router();

// POST /api/Company-Information
router.post('/', CompanyInformationController.CompanyInformationcreate);

// GET all
router.get('/', CompanyInformationController.CompanyInformationgetAll);

// GET by ID
router.get('/:id', CompanyInformationController.CompanyInformationgetById);

// PUT (update)
router.put('/', upload.single('employerLogo'), CompanyInformationController.CompanyInformationupdate);


// DELETE
router.delete('/:id', CompanyInformationController.CompanyInformationdelete);

export default router;
