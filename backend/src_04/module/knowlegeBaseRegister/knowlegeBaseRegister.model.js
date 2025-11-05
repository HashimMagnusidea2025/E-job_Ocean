import mongoose from "mongoose";


const knowlegeBaseRegisterSchema = mongoose.Schema({

    knowlegeBaseId: { 
        type: mongoose.Schema.Types.ObjectId, ref: "knowlege_base", },

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },

}, { timestamps: true })


const knowlegeBaseRegisterModel = mongoose.model('knowlege_base_register',knowlegeBaseRegisterSchema);

export default knowlegeBaseRegisterModel;