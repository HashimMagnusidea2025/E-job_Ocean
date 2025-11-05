import mongoose from "mongoose";


const JobRegisterSchema = mongoose.Schema({
    
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "job-post", required: true },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    country: { ref: 'Country', type: Number, required: true },
    state: { ref: 'State', type: Number, required: true },
    city: { ref: 'City', type: Number, required: true },

    resume: {
        type: String,
        required: true
    }

}, { timestamps: true });


const JobRegisterModel = mongoose.model('job-register', JobRegisterSchema);

export default JobRegisterModel;