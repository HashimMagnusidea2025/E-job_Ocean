import mongoose from "mongoose";

const EstablishedInCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, {
    timestamps: true
});

const EstablishedInCategorymodel = mongoose.model("EstablishedInCategory", EstablishedInCategorySchema);

export default EstablishedInCategorymodel;
