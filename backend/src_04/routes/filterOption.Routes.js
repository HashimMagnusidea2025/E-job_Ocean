// routes/filterOption.routes.js
import express from "express";
import { insertDefaultFilterOptions,getAllFilterOptions } from "../controllers//filterOption.controller.js";

const filterOptionRouter = express.Router();

filterOptionRouter.post("/insert-filters", insertDefaultFilterOptions);

filterOptionRouter.get('/filter-Options',getAllFilterOptions);



export default filterOptionRouter;
