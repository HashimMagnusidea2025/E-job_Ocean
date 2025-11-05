import { google } from "googleapis";
import moment from "moment-timezone";
import { oauth2Client, getAccessToken } from "./googleAuth.js";

export const createCalendarEvent = async ({ webinar, registration, attendees }) => {
  if (!registration) throw new Error("registration not defined");

  try {
    // Refresh access token if expired
    const accessToken = await getAccessToken();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: webinar.WebinarTitle,
      description: webinar.Description || "Webinar Event",
      start: { dateTime: moment(webinar.WebinarStartDateTime).toISOString(), timeZone: "Asia/Kolkata" },
      end: { dateTime: moment(webinar.WebinarEndDateTime).toISOString(), timeZone: "Asia/Kolkata" },
      attendees,
      conferenceData: { createRequest: { requestId: `webinar-${Date.now()}`, conferenceSolutionKey: { type: "hangoutsMeet" } } },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    console.log("✅ Google Calendar Event Created:", response.data.htmlLink);
    return response.data;
  } catch (err) {
    console.error("❌ Error creating calendar event:", err.message);
    throw err;
  }
};
