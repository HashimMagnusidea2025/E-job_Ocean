

import express from "express";
import { getAllPostOffices, getByPincode, searchByName,  getDetailsByPincode } from "./PostOffice.controller.js";

const PostOfficerouter = express.Router();

PostOfficerouter.get("/", getAllPostOffices); // GET all
PostOfficerouter.get("/pincode/:pincode", getByPincode); // GET by pincode
PostOfficerouter.get("/search", searchByName); // search by name (query param ?name=adilabad)
PostOfficerouter.get("/details/:pincode", getDetailsByPincode); // 🔹 NEW route


export default PostOfficerouter;