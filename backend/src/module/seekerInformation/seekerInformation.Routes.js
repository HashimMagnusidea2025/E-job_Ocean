import express from 'express';
import multer from "multer";
import path from "path";
import { CreateOrupdateSeekerInfo, getSeekerInfoByUser } from './seekerInformation.controller.js';
import { protect } from '../../middleware/auth.Middleware.js'
const SeekerInformationRouter = express.Router();




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/seekar"); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

SeekerInformationRouter.get('/me', protect, getSeekerInfoByUser);

SeekerInformationRouter.post('/update', protect, upload.single('profileImage'), CreateOrupdateSeekerInfo);


export default SeekerInformationRouter;