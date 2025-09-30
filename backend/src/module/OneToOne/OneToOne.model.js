
import mongoose from 'mongoose';

const OneToOneSchema = mongoose.Schema({

    Speaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Speaker"
    },
    selectDays: {
        type: [String], // array of strings
    },
    selectDate: {
        type: String
    },
    courseTitle: {
        type: String
    },
    courseDescription: {
        type: String
    },
    fees: {
        type: String
    },
    courseType: {
        type: String
    },
    paymentType: {
        type: String
    },

    includingGST: {
        type: Boolean,
        default: false,
    },


    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    status: {
        type: String, enum: ["active", "inactive"],
    },
});

const OneToOneModel = mongoose.model('one_to_one', OneToOneSchema);


export default OneToOneModel;
