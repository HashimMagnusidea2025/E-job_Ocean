
import mongoose from "mongoose";
const webinarRegistrationSchema = mongoose.Schema(
  {
    webinarId: { type: mongoose.Schema.Types.ObjectId, ref: "webinar" },
    one_to_oneId: { type: mongoose.Schema.Types.ObjectId, ref: "one_to_one" },
    assignment_id: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    mobile: { type: String },
    pinCode: { type: Number },
    type: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    gstNumber: { type: String },
    selectDate: { type: String },
    WebinarType: { type: String, enum: ["Pending", "Free", "Paid"] },
    startTime: { type: String },
    reminderSent: {
      type: Object,
      default: {
        "24_hours": false,
        "5_minutes": false,
      },
    },

  },
  { timestamps: true }
);
const WebinarRegistration = mongoose.model(
  "webinarregistrations",
  webinarRegistrationSchema
);
export default WebinarRegistration;