
import express from 'express';

import { createCountry,getAllCountry,getCountryById } from '../controllers/countries.controller.js';


const CountryRouter = express.Router();

CountryRouter.post('/', createCountry);
CountryRouter.get('/',getAllCountry);
CountryRouter.get('/:id',getCountryById);

// CountryRouter.put('/:id',updateCountry);
// CountryRouter.delete('/:id', deteleConutry);

export default CountryRouter
