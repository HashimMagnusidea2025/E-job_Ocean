
import express from 'express';
import upload from '../middleware/multer.middleware.js';
import { getGeneralSettings,updateGeneralSettings } from '../controllers/generalsettings.controller.js';


const generalSettingsRoute = express.Router();

generalSettingsRoute.get('/', getGeneralSettings);

generalSettingsRoute.put('/',upload.fields([

    {name:"logo",maxCount:1},
    {name:"faviconIcon", maxCount:1}
]), updateGeneralSettings);

export default generalSettingsRoute;

