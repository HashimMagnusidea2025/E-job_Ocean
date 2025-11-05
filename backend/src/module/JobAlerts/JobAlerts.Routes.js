import express from 'express';

import { createJobAlert,getMyJobAlert,deleteJobAlert } from './JobAlerts.controller.js';
import {protect} from '../../middleware/auth.Middleware.js'
const JobAlertsRoute = express.Router();


JobAlertsRoute.post('/',protect,createJobAlert);

JobAlertsRoute.get('/',protect,getMyJobAlert);
JobAlertsRoute.delete('/:id',protect,deleteJobAlert);

export default JobAlertsRoute;
