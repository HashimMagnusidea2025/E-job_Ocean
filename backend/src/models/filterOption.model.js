// models/filterOption.model.js
import mongoose from "mongoose";

const FilterOptionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
        unique: true // 👈 add this to avoid duplicates
  },
  values: [{ type: String }]
});

const FilterOption = mongoose.model("FilterOption", FilterOptionSchema);

export default FilterOption;
