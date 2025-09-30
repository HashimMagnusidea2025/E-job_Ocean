
import WebinarModel from "./webinar.model.js";
import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";
import { createCalendarEvent } from "../../utils/googleCalendar.js";


import webinarRegistrationModel from "../webinarRegistration/webinarRegistration.model.js";


import moment from "moment-timezone";
export const CreateWebinar = async (req, res) => {
    try {
        let data = req.body;

        if (req.files?.WebinarImage) {
            data.WebinarImage = `/uploads/webinars/${req.files.WebinarImage[0].filename}`;
        }
        if (req.files?.WebinarLogo) {
            data.WebinarLogo = `/uploads/webinars/${req.files.WebinarLogo[0].filename}`;
        }
        if (req.files?.WebinarVideoOptional && req.files.WebinarVideoOptional.length > 0) {
            data.WebinarVideoOptional = `/uploads/webinars/${req.files.WebinarVideoOptional[0].filename}`;
        } else {
            data.WebinarVideoOptional = undefined; // explicitly set undefined if no file
        }

        // Save webinar in DB   
        const webinar = await WebinarModel.create(data);

        // 🔥 Create Google Calendar Event
        try {
            const event = await createCalendarEvent({ webinar, registration: { name: "Initial" }, attendees: [] });

            webinar.googleEventId = event.id;
            webinar.googleCalendarLink = event.htmlLink;
            webinar.googleMeetLink = event.hangoutLink || null;
            webinar.googleCalendarId = "primary";

            await webinar.save();
            console.log(webinar);

        } catch (calendarErr) {
            console.error("Google Calendar error:", calendarErr.message);
        }

        res.status(201).json(webinar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};  





export const getWebinars = async (req, res) => {


    try {
        const webinars = await WebinarModel.find().populate('Speaker');
        res.json(webinars);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

export const getWebinarById = async (req, res) => {

    try {


        const webinar = await WebinarModel.findById(req.params.id).populate('Speaker');

        if (!webinar) return res.status(404).json({ message: "Webinar not found" });
        res.json(webinar);

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const updateWebinar = async (req, res) => {

    try {



        let data = req.body;

        if (req.files?.WebinarImage) {
            data.WebinarImage = `/uploads/webinars/${req.files.WebinarImage[0].filename}`;
        }
        if (req.files?.WebinarLogo) {
            data.WebinarLogo = `/uploads/webinars/${req.files.WebinarLogo[0].filename}`;
        }
        // Update Webinar
        if (req.files?.WebinarVideoOptional && req.files.WebinarVideoOptional.length > 0) {
            data.WebinarVideoOptional = `/uploads/webinars/${req.files.WebinarVideoOptional[0].filename}`;
        } else {
            data.WebinarVideoOptional = undefined; // explicitly set undefined if no file
        }
        const webinar = await WebinarModel.findByIdAndUpdate(req.params.id, data,
            { new: true, runValidators: true });

        if (!webinar) {
            return res.status(404).json({ message: "Webinar not found" });
        }
        res.json(webinar);


    } catch (err) {
        res.status(400).json({ massage: "webinar not Found" })
    }
}

export const deleteWebinar = async (req, res) => {

    try {
        const webinar = await WebinarModel.findByIdAndDelete(req.params.id);
        if (!webinar) return res.status(404).json({ massage: "Webinar not Found" });
        res.json({ message: "Webinar deleted successfully" });


    } catch (err) {
        res.status(500).json({ massage: err.massage })
    }
}





export const createGoogleEvent = async (req, res) => {
    try {
        const { id: registrationId } = req.params;
        const registration = await webinarRegistrationModel.findById(registrationId);

        if (!registration)
            return res.status(404).json({ message: "Registration not found" });

        const webinar = await WebinarModel.findById(registration.webinarId);

        if (!webinar)
            return res.status(404).json({ message: "Webinar not found" });

        let event;

        // Check if webinar already has a Google event
        if (webinar.googleEventId) {
            // ✅ Update existing event to add attendee
            event = await calendar.events.get({
                calendarId: "primary",
                eventId: webinar.googleEventId,
            });

            const attendees = event.data.attendees || [];
            attendees.push({ email: registration.email });

            await calendar.events.patch({
                calendarId: "primary",
                eventId: webinar.googleEventId,
                resource: { attendees },
                sendUpdates: "all", // notify attendee
            });

        } else {
            // ✅ Create new event only if not exists
            const newEvent = await createCalendarEvent({
                webinar,
                registration,
                attendees: [{ email: registration.email }],
            });

            // Save event id & links to webinar
            webinar.googleEventId = newEvent.id;
            webinar.googleCalendarLink = newEvent.htmlLink;
            webinar.googleMeetLink = newEvent.conferenceData?.entryPoints?.[0]?.uri;
            await webinar.save();
        }

        res.status(200).json({ success: true, message: "Attendee added to Google event" });

    } catch (err) {
        console.error("Error adding attendee to Google Calendar event:", err);
        res.status(500).json({ message: "Failed to add attendee" });
    }
};
