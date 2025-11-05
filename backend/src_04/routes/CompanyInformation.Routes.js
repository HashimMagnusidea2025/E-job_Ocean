import express from 'express';
import CompanyInformationController from '../controllers/CompanyInformation.controller.js';
import multer from 'multer';
import path from 'path';
import {protect} from "../middleware/auth.Middleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'employerLogo') {
      cb(null, 'uploads/employerLogo/');
    } else if (file.fieldname === 'hiringCompanies') {
      cb(null, 'uploads/hiringCompanies/');
    } else {
      cb(null, 'uploads/others/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
// POST /api/Company-Information
router.post('/', upload.fields([
    { name: 'employerLogo',  },
    { name: 'hiringCompanies', }
  ]),protect, CompanyInformationController.CompanyInformationcreate);

// GET all
router.get('/',CompanyInformationController.CompanyInformationgetAll);

router.get("/my-company", protect, CompanyInformationController.getCompanyByUserId);



// GET by ID
router.get('/:id', CompanyInformationController.CompanyInformationgetById);

// PUT (update)
router.put('/:id', upload.single('employerLogo'), CompanyInformationController.CompanyInformationupdate);

router.put("/my-company/update/:id", protect,upload.fields([
    { name: 'employerLogo',},
    { name: 'hiringCompanies',}
  ]), CompanyInformationController.CompanyInformationupdate);

// DELETE
router.delete('/:id', CompanyInformationController.CompanyInformationdelete);
router.patch("/toggle-status/:id", CompanyInformationController.toggleStatus);
// Add this to your company information routes
router.get('/user/logo', protect, CompanyInformationController.getCompanyLogoByUserId);

export default router;
