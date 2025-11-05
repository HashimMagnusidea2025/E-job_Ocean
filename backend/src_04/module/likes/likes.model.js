


import mongoose from "mongoose";

const LikeSchema = mongoose.Schema({

    id: { 
            type: mongoose.Schema.Types.Mixed, // ✅ Number ya String dono accept karega
            required: true 
        },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    viewCount: {
        type: Number,
        default: 0,
    },

    title: {
        type: String
    },
    type: {
        type: String
    },

    createdAt: { type: Date, default: Date.now },

})

const LikeModel = mongoose.model("Like", LikeSchema);

export default LikeModel;
