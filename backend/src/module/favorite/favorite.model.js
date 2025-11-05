import mongoose from "mongoose";

const FavoriteSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job-post",
        required: true,
    },

    type: {
        type: String,
        required: true,
    },




    createdAt: { type: Date, default: Date.now },
});


const FavoriteModel = mongoose.model("favorite", FavoriteSchema);


export default FavoriteModel;