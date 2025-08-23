import express from 'express';
import { getCMS, updateCMS } from '../controllers/CMS.controller.js';
import upload from '../middleware/multer.middleware.js';
import { protect } from '../middleware/auth.Middleware.js';

const CMSRouter = express.Router();

CMSRouter.get('/', getCMS);


CMSRouter.put('/', upload.single("logo"), updateCMS);

export default CMSRouter;
