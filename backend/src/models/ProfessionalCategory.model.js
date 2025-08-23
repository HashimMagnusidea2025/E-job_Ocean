  import mongoose from "mongoose";

  const professionalCategorySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  }, {
    timestamps: true
  });

  const ProfessionalCategoryModel = mongoose.model("Professional_Category", professionalCategorySchema);

  export default ProfessionalCategoryModel;
