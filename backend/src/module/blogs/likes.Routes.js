
import express from 'express';

import { LikeCreate ,getLikeCount,incrementView,getViewCount} from "./likes.controller.js";
import {protect} from '../../middleware/auth.Middleware.js'
const LikeRoute  = express.Router();


LikeRoute.post('/', protect, LikeCreate);
LikeRoute.get('/likes/:id/:type', getLikeCount);

LikeRoute.post('/view/:blogId', incrementView);
LikeRoute.get('/view/:blogId', getViewCount);

export default LikeRoute;