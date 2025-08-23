// models/CaFresher.model.js
import mongoose from "mongoose";

const CaFresherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: String, required: true },
    jobProfile: { type: String, required: true },
    jobLocation: { type: String, required: true },
    passingMonth: { type: String, required: true },
    passingYear: { type: String, required: true },
    ResumeUpload: { type: String, required: true }, // Store file path or filename
  },
  { timestamps: true }
);

const CaFresherModel = mongoose.model("CaFresher", CaFresherSchema);
export default CaFresherModel;
