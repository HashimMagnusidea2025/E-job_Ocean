
import express from 'express';

import { createState,getAllState,getStateById,getStatesByCountryId } from '../controllers/State.controller.js';


const StateRouter = express.Router();

StateRouter.post('/', createState);
StateRouter.get('/',getAllState);
StateRouter.get('/:id', getStateById);
StateRouter.get("/country/:id", getStatesByCountryId);

// CountryRouter.put('/:id',updateCountry);
// CountryRouter.delete('/:id', deteleConutry);

export default StateRouter;
