import mongoose from "mongoose";
const CitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },   // 👈 String
    name: { type: String, required: true, trim: true },
    state_id: { type: String, required: true },           // 👈 String
    state_code: { type: String, required: true },
    country_id: { type: String, required: true },         // 👈 String
    country_code: { type: String, required: true },
    latitude: { type: String, required: true },           // 👈 String (Atlas me string hai)
    longitude: { type: String, required: true },          // 👈 String
    created_at: { type: String },                         // 👈 String (ISO date string hai)
    updated_at: { type: String },
    flag: { type: String },                               // 👈 "1"/"0" aa raha hai, so string
    wikiDataId: { type: String },
  },
  { collection: "city", timestamps: false }

);

export default mongoose.model("City", CitySchema);
