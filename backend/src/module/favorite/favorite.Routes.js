import express from 'express';


import { toggleFavorite ,getAllFavorites,deleteFavorite, getMyFavorites} from './favorite.controller.js';

import { protect } from '../../middleware/auth.Middleware.js';

const FavoriteRoute = express.Router();


FavoriteRoute.post('/toggle',protect, toggleFavorite);
FavoriteRoute.get('/me',protect,getMyFavorites);
FavoriteRoute.get('/', getAllFavorites);
FavoriteRoute.delete("/:id",protect, deleteFavorite);

export default FavoriteRoute;