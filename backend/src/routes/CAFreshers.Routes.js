import express from 'express'

import { CreateCAFresher,GetAllCAFresher } from '../controllers/CaFresher.controller.js';
import upload from '../middleware/multer.middleware.js';


const CaFresherRouter = express.Router();

CaFresherRouter.post('/',upload.single("document"), CreateCAFresher);
CaFresherRouter.get('/', GetAllCAFresher)


export default CaFresherRouter;