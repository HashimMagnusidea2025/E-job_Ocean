import mongoose from 'mongoose';

const SocialMediaIconSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    link: {
        type: String,
    },
    status: {
        type: String, enum: ["active", "inactive"],
    },

})

const SocialMediaIconModel = mongoose.model("SocialMediaIcon", SocialMediaIconSchema);

export default SocialMediaIconModel;