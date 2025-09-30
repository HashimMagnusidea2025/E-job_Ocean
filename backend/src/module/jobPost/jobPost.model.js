import mongoose from "mongoose";


const JobPostSchema = mongoose.Schema({

    jobTitle: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    details_des: {
        type: String
    },
    no_of_opning: {
        type: Number
    },

    qualification: {
        type: String
    },

    experience: {
        type: String
    },
    location: {
        type: String
    },
    email: {
       type: String
    },
    contact: {
        type: String
    },
    name: {
        type: String
    },
    file_attach: {
        type: String
    },

},{ timestamps: true })


const JobPostModel = mongoose.model('job-post',JobPostSchema);

export default JobPostModel;
