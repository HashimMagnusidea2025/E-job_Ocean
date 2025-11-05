

import mongoose from "mongoose";




const SeekerInformationSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",   //  User model se relation
        required: true
    },

    country: {
        type: Number,  // Changed to Number to match Country model
        ref: 'Country',
        required: true
    },
    state: {
        type: Number,  // Changed to Number to match State model
        ref: 'State',
        required: true
    },
    city: {
        type: String,  // Keep as String to match City model
        ref: 'City',
        required: true
    },

    dateofBirth: {
        type: String,

    },

    middletName: {
        type: String,

    },
    firstName: {
        type: String,

    },
    nickName: {
        type: String,

    },
    gender: {
        type: String,

    },
    maritalStatus: {
        type: String,

    },
    phone: {
        type: String,

    },
    mobile: {
        type: String,

    },
    streetAddress: {
        type: String,

    },
    youTubeVideoLink: {
        type: String,

    },
    jobExperience: {
        type: String,

    },
    careerLevel: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "CareerLevelCategory"

    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyCategory"

    },
    functionalArea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FunctionalAreaCategory"
    },
    salaryCurrency: {
        type: String,

    },
    currentSalary: {
        type: String,

    },
    expectedSalary: {
        type: String,

    },

    subscribetoNewsletter: { type: Boolean, default: false },

    summary: {
        type: String
    },

    profileImage: {
        type: String,

    },




}, {
    timestamps: true
})


const SeekerInformationModel = mongoose.model("seeker_information", SeekerInformationSchema);


export default SeekerInformationModel;
