import express from "express";

import {

  createCMSContent,
  getAllCMSContent,
  getCMSContentById,
  updateCMSContent,
  deleteCMSContent,
} from "./CMSPages.controller.js";
const CMSContentrouter = express.Router();

CMSContentrouter.post("/", createCMSContent);
CMSContentrouter.get("/", getAllCMSContent);
CMSContentrouter.get('/:id',getCMSContentById); 
CMSContentrouter.put('/:id',updateCMSContent)
CMSContentrouter.delete('/:id',deleteCMSContent)

export default CMSContentrouter;
