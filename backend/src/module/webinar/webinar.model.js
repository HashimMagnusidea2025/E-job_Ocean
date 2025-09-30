import mongoose from "mongoose";


const WebinarSchema = mongoose.Schema({

    WebinarTitle: {
        type: String
    },
    WebinarSlug: {
        type: String
    },
    Introduction: {
        type: String
    },
    Description: {
        type: String
    },
    Keywords: {
        type: String
    },
    WebinarStartDateTime: {
        type: String
    },
    WebinarEndDateTime: {
        type: String
    },
    NumberofSeats: {
        type: Number
    },

    YouTubeVideoLink: {
        type: String
    },
    RegistrationStartDateTime: {
        type: String
    },
    RegistrationCloseDateTime: {
        type: String
    },
    WebinarMode: {
        type: String, enum: ['online', 'offline']
    },

    WebinarType: {
        type: String, enum: ['Free', 'Paid']
    },
    webinarlink: {
        type: String
    },
    webinarAddress: {
        type: String
    },
    registrationFees: {
        type: String
    },
    WebinarImage: {
        type: String
    },
    WebinarVideoOptional: {
        type: String
    },
    WebinarLogo: {
        type: String
    },
    IncludingGST: {
        type: String
    },
    IsActive: {
        type: String, enum: ["active", "inactive"],
    },
    Speaker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Speaker"
    },

    googleEventId: {
        type: String
    },
    googleMeetLink: {
        type: String
    },
    googleCalendarLink: {
        type: String
    },
    googleCalendarId: {
        type: String
    },
    googleAccessToken: {
        type: String
    }

})

const WebinarModel = mongoose.model('webinar', WebinarSchema);

export default WebinarModel;