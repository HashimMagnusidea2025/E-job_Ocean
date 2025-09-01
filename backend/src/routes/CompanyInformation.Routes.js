import express from 'express';
import CompanyInformationController from '../controllers/CompanyInformation.controller.js';
import multer from 'multer';
import path from 'path';
import {protect} from "../middleware/auth.Middleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/employerLogo");  
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });
// POST /api/Company-Information
router.post('/',upload.single("employerLogo"),protect, CompanyInformationController.CompanyInformationcreate);

// GET all
router.get('/',protect, CompanyInformationController.CompanyInformationgetAll);

router.get("/my-company", protect, CompanyInformationController.getCompanyByUserId);



// GET by ID
router.get('/:id', CompanyInformationController.CompanyInformationgetById);

// PUT (update)
router.put('/:id', upload.single('employerLogo'), CompanyInformationController.CompanyInformationupdate);

router.put("/my-company/update/:id", protect,upload.single("employerLogo"), CompanyInformationController.CompanyInformationupdate);

// DELETE
router.delete('/:id', CompanyInformationController.CompanyInformationdelete);
router.patch("/toggle-status/:id", CompanyInformationController.toggleStatus);
// Add this to your company information routes
router.get('/user/logo', protect, CompanyInformationController.getCompanyLogoByUserId);

export default router;
