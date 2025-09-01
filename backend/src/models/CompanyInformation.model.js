import mongoose from "mongoose";

const CompanyInformationSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // ✅ User model se relation
    required: true
  },

  company: {
    employerLogo: {
      type: String
    },
    name: { type: String, required: true },
    industry: { type: String },
    ownershipType: { type: String },
    description: { type: String },
    companyLogo: { type: String },
    officesCount: { type: String },
    employeesCount: { type: String },
    foundedYear: { type: Number },
    website: { type: String },
    phone: { type: String },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      pinterest: { type: String },
    },
    address: {
      country: { type: String },
      state: { type: String },
      city: { type: String },
      companyAddress: { type: String },
      companyLocation: { type: String },
    }
  },

  // HR Person Info
  hrContact: {
    name: { type: String },
    email: { type: String },
    designation: { type: String },
    companyRegistrationNumber: { type: String }
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
},
  {
    timestamps: true
  });

const CompanyInformationModel = mongoose.model('CompanyInformation', CompanyInformationSchema)
export default CompanyInformationModel;
