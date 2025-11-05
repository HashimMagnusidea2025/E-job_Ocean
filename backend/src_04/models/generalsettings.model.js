

import mongoose from "mongoose";

const generalSettingSchema = mongoose.Schema({
    name: {
        type: String
    },  
    companyName: {
        type: String
    },
    companyEmail: {
        type: String
    },
    companyPhone: {
        type: String
    },
    companyAddress: {

        type: String
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    logo: {
        type: String
    },
    faviconIcon: {
        type: String
    },
    GST: {

        type: String
    }


})

const generalSettingModel = mongoose.model('generalSettings', generalSettingSchema);

export default generalSettingModel;
