import express from 'express'

import { CreateCAFresher,GetAllCAFresher } from '../controllers/CaFresher.controller.js';



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



const CaFresherRouter = express.Router();

CaFresherRouter.post('/',upload.single("document"), CreateCAFresher);
CaFresherRouter.get('/', GetAllCAFresher)


export default CaFresherRouter;