import mongoose from "mongoose";

const StateSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  country_id: {
    type: Number,
    required: true
  },
  country_code: {
    type: String,
    required: true
  },
  fips_code: {
    type: String
  },
  iso2: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  created_at: {
    type: String, 
  },
  updated_at: {
    type: String 
  },
  flag: {
    type: Number,
    default: 1
  },
  wikiDataId: {
    type: String
  }
}, { timestamps: false,
 collection: "State"
}); 


const Statemodel = mongoose.model("State",StateSchema)

export default Statemodel;
