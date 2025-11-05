

// import mongoose from 'mongoose';


// const webinarRegistrationSchema = mongoose.Schema({

//     webinarId: { type: mongoose.Schema.Types.ObjectId, ref: "webinar", },
//     one_to_oneId: { type: mongoose.Schema.Types.ObjectId, ref: "one_to_one" },
//     firstName: {
//         type: String,
//         required: true
//     },
//     lastName: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     mobile: {
//         type: String,
//         required: true
//     },
//     pinCode: {
//         type: Number,
//         required: true
//     },
//     type: { type: String, required: true },

//     country: { ref: 'Country', type: Number, required: true },
//     state: { ref: 'State', type: String, required: true },
//     city: { ref: 'City', type: String, required: true },
//     // country: { ref: 'Country', type: mongoose.Schema.Types.ObjectId, required: true },
//     // state: { ref: 'State', type: mongoose.Schema.Types.ObjectId, required: true },
//     // city: { ref: 'City', type: mongoose.Schema.Types.ObjectId, required: true },

//     gstNumber: {
//         type: Number
//     },
//     selectDate: {
//         type: String
//     },
//     WebinarType: {
//         type: String, enum: ['Free', 'Paid', ]
//     },
//     startTime: {
//         type: String
//     },

// }, { timestamps: true });


// const webinarRegistrationModel = mongoose.model('WebinarRegistration', webinarRegistrationSchema);

// export default webinarRegistrationModel;





import mongoose from "mongoose";
const webinarRegistrationSchema = mongoose.Schema(
  {
    webinarId: { type: mongoose.Schema.Types.ObjectId,  ref: "webinar" },
    one_to_oneId: { type: mongoose.Schema.Types.ObjectId, ref: "one_to_one" },
    assignment_id:{type: String},
    firstName: { type: String },
    lastName: { type: String},
    email: { type: String },
    mobile: { type: String },
    pinCode: { type: Number },
    type: { type: String},
    country: { type: String },
    state: { type: String },
    city: { type: String},
    gstNumber: { type: String },
    selectDate: { type: String },
    WebinarType: { type: String, enum: ["Pending","Free", "Paid"] },
    startTime: { type: String },
  },
  { timestamps: true }
);
const WebinarRegistration = mongoose.model(
  "webinarregistrations",
  webinarRegistrationSchema
);
export default WebinarRegistration;