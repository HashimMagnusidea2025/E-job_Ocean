


import mongoose from 'mongoose';



const knowlegeBaseSchema = mongoose.Schema({


    title: {
        type: String,
        required: true 
    },
    description: {
        type: String,
         required: true 
    },
    tags: {
        type: String
    },
    keywords: {
        type: String
    },
    fromStatus: {
        type: String, enum: ["Enabled", "Disabled"],
    },

    uploadPDF: {
       type: String
    },
    count:{
        type:Number
    },
     status: {
        type: String, enum: ["active", "inactive"],
    },


},{ timestamps: true })

const knowlegeBaseModel = mongoose.model('knowlege_base', knowlegeBaseSchema);


export default knowlegeBaseModel;
