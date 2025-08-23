
import express from 'express';

import { createLocation,getAllLocation,getLocationById,updateLocation,deteleLocation } from '../controllers/location.controller.js';


const LocationRouter = express.Router();

LocationRouter.post('/', createLocation);
LocationRouter.get('/',getAllLocation);
LocationRouter.get('/:id',getLocationById);

LocationRouter.put('/:id',updateLocation);
LocationRouter.delete('/:id', deteleLocation);

export default LocationRouter;
