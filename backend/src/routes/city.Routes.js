import express from "express";
import {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
  getCitiesByState
} from "../controllers/city.controller.js";

const cityrouter = express.Router();

// GET all cities
cityrouter.get("/", getAllCities);

cityrouter.get("/state/:stateId", getCitiesByState);

// GET a city by id
cityrouter.get("/:id", getCityById);

// POST a new city
cityrouter.post("/", createCity);

// PUT update city by id
cityrouter.put("/:id", updateCity);

// DELETE a city by id
cityrouter.delete("/:id", deleteCity);

export default cityrouter;
