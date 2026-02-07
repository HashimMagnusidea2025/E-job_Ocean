import express from 'express'

import { CreateCAFresher,GetAllCAFresher,importcaRegistrations ,GetUploadCvList} from '../controllers/CaFresher.controller.js';



import multer from "multer";
import path from "path"; // <--  ADD THIS IMPORT

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/resume"),
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// const upload = multer({ storage: multer.memoryStorage() });



const CaFresherRouter = express.Router();

CaFresherRouter.post("/ca/import", upload.single("file"), importcaRegistrations);
CaFresherRouter.post('/',upload.single("document"), CreateCAFresher);
CaFresherRouter.get('/', GetAllCAFresher)
CaFresherRouter.get('/upload-cv',GetUploadCvList);


export default CaFresherRouter;