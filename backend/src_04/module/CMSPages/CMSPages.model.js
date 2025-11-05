import mongoose from "mongoose";


const CMSContentSchema = mongoose.Schema({

    page: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CMSPage",
        required: true,
    },

    line_1: {
        type: String
    },
    line_2: {
        type: String
    },
    line_3: {
        type: String
    },
    line_4: {
        type: String
    },
    line_5: {
        type: String
    },
    status: {
        type: String, enum: ["active", "inactive"],
        default: "active",
    },
})


const CMSContentModel = mongoose.model('CMSContent', CMSContentSchema)


export default CMSContentModel;
