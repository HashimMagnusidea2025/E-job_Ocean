import mongoose from 'mongoose';

const JobAlertsSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    jobTitle: {
        type: String,
        required: true,
    },

    // skills: {

    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "SkillsCategory",
    // },
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "buildSkills",
    }],
    country: { ref: 'Country', type: Number, required: true },
    state: { ref: 'State', type: Number, required: true },
    city: { ref: 'City', type: Number, required: true },

    careerLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CareerLevelCategory",
    },
    functionalArea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FunctionalAreaCategory",
    },
    experience: {
        type: String
    },
    mode: {
        type: String
    },


}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
},)


const JobAlertsModel = mongoose.model('jobalerts', JobAlertsSchema);

export default JobAlertsModel;

