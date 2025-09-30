

import mongoose from 'mongoose';


const webinarRegistrationSchema = mongoose.Schema({

    webinarId: { type: mongoose.Schema.Types.ObjectId, ref: "webinar", },
    one_to_oneId: { type: mongoose.Schema.Types.ObjectId, ref: "one_to_one" },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    pinCode: {
        type: Number,
        required: true
    },
   type: { type: String, required: true },

    country: { ref: 'Country', type: Number, required: true },
    state: { ref: 'State', type: Number, required: true },
    city: { ref: 'City', type: Number, required: true },
    gstNumber: {
        type: Number
    },
}, { timestamps: true });


const webinarRegistrationModel = mongoose.model('WebinarRegistration', webinarRegistrationSchema);

export default webinarRegistrationModel;