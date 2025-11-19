import mongoose from "mongoose";


const JobPostSchema = mongoose.Schema({

    jobTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    benefits: {
        type: String
    },
    salaryFrom: {
        type: Number
    },
    salaryTo: {
        type: Number
    },
    salaryCurrency: {

        type: String
    },
    salaryPeriod: {
        type: String
    },
    mode: {
        type: String
    },

    hideSalary: { type: Boolean, default: false },

    careerLevel: { type: mongoose.Schema.Types.ObjectId, ref: "CareerLevelCategory" },
    functionalArea: { type: mongoose.Schema.Types.ObjectId, ref: "FunctionalAreaCategory" },
    jobType: { type: mongoose.Schema.Types.ObjectId, ref: "jobTypeCategory" },
    jobShift: { type: mongoose.Schema.Types.ObjectId, ref: "jobShiftCategory" },

    positions: { type: Number },
    expiryDate: { type: Date },
    degreeLevel: { type: mongoose.Schema.Types.ObjectId, ref: "DegreeLevelCategory" },
    experience: { type: String },
    mode: { type: String, enum: ["remote", "online", "offline"]},
    externalJob: { type: Boolean, default: false },
    isFreelance: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    country: { ref: 'Country', type: Number, required: true },
    state: { ref: 'State', type: Number, required: true },
    city: { ref: 'City', type: Number, required: true },

    skills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SkillsCategory"
        }
    ],

    file_attach: {
        type: String
    },
    //  NEW FIELD: Store who posted the job
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming you have a User model
        required: true
    },
    //  NEW FIELD: To distinguish between admin and employer posts
    postedByType: {
        type: String,
        enum: ["superadmin", "Employer"],
        default: "Employer"
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyInformation",
        required: true
    }

}, { timestamps: true })


const JobPostModel = mongoose.model('job-post', JobPostSchema);

export default JobPostModel;

