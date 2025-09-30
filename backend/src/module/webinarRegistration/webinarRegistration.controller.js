import webinarRegistrationModel from "./webinarRegistration.model.js";
import WebinarModel from '../webinar/webinar.model.js'
import { createCalendarEvent } from "../../utils/googleCalendar.js";
import { oauth2Client } from "../../config/googleConfig.js";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import OneToOneModel from '../OneToOne/OneToOne.model.js'
dotenv.config();


import { google } from "googleapis";

// ✅ Transporter config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const BASE_URL = `http://localhost:${process.env.PORT}`;
export const CreateWebinarRegistration = async (req, res) => {
  try {
    const { email, mobile, webinarId, firstName } = req.body;

    // Step 1: Check for existing registration
    const existing = await webinarRegistrationModel.findOne({
      email,
      mobile,
      webinarId,
      type: "webinar",
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "You are already registered for this webinar with this email and mobile.",
      });
    }

    // Step 2: Create new registration
    const Registration = new webinarRegistrationModel({
      ...req.body,
      type: "webinar",
    });
    await Registration.save();

    // Webinar fetch

    const webinar = await WebinarModel.findById(Registration.webinarId);
    const webinarTitle = webinar?.WebinarTitle || "Upcoming Webinar";
    const webinarStart = webinar?.WebinarStartDateTime || "";
    const webinarEnd = webinar?.WebinarEndDateTime || "";
    const webinarDescription = webinar?.Description || "";
    const webinarImageUrl = webinar?.WebinarImage
      ? `${BASE_URL}${webinar.WebinarImage}`
      : `${BASE_URL}/uploads/default.png`;


    // ✅ Send email to user
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: Registration.email, // email from the saved registration
      subject: `Webinar Registration Successful - ${webinarTitle}`,
      html: `
  <style>
      body { font-family: 'Arial', sans-serif; background-color: #E3F2FD; margin: 0; padding: 0; text-align: center; }
      table { border-spacing: 0; width: 100%; }
      td { padding: 0; }
      .email-container { max-width: 600px; margin: 30px auto; background-color: #FFFFFF; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
      .header { text-align: center; padding: 15px; background-color:rgb(204, 226, 249); }
      .header img { width: 100%; height: auto; border-radius: 10px 10px 0 0; }
      .content { padding: 25px; font-size: 16px; line-height: 1.6; color: #333; text-align: left; }
      .content p { margin: 10px 0; }
      .footer { background-color: #F8F9FA; padding: 20px; font-size: 14px; color: #555; text-align: center; border-top: 1px solid #ddd; }
      .footer a { color: #007BFF; text-decoration: none; font-weight: bold; }
  </style>
  <body>
      <table role="presentation">
          <tr>
              <td align="center">
                  <table role="presentation" class="email-container">
                      <tr style="background-color:rgb(204, 226, 249);">
                          <td class="header">
                                <img src="${webinarImageUrl}" alt="Webinar Image" style="width:100%; height:auto;">
                          </td>
                      </tr>
                      <tr>
                          <td class="content">
                              <h2 style="text-align: center; color: #333;">Webinar Confirmation</h2>
                              <p>Hello ${Registration.firstName || "Participant"},</p>
                              <p>🎉 This is a confirmation message for your enrollment in Webinar <strong>"${webinarTitle}"</strong>.</p>
                              <p>Scheduled from <b>${webinarStart}</b> to <b>${webinarEnd}</b> (IST).</p>
                              <p>${webinarDescription}</p>
                              <p>For any support or queries, feel free to reach out to ${process.env.SMTP_EMAIL} or reply to this message.</p>
                          </td>
                      </tr>
                      <tr>
                          <td class="footer">
                              <p style="font-size: 17px; color: #aaa; padding: 10px 0;">Stay connected with us through our social media platforms.</p>
                              <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                                  <a href="https://www.instagram.com/" target="_blank" style="background-color: #E4405F; padding: 6px; border-radius: 6px;">Instagram</a>
                                  <a href="https://www.facebook.com/" target="_blank" style="background-color: #1877F2; padding: 6px; border-radius: 6px;">Facebook</a>
                                  <a href="https://www.linkedin.com/" target="_blank" style="background-color: #0077B5; padding: 6px; border-radius: 6px;">LinkedIn</a>
                                  <a href="https://twitter.com/" target="_blank" style="background-color: #1DA1F2; padding: 6px; border-radius: 6px;">Twitter</a>
                              </div>
                              <p>If you have any questions, contact us at <a href="mailto:${process.env.SMTP_EMAIL}">${process.env.SMTP_EMAIL}</a>.</p>
                              <p>&copy; 2024 Your Company | All rights reserved.</p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  `,
    };



    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Registration email sent to", email);
    } catch (mailErr) {
      console.error("❌ Email sending error:", mailErr.message);
      // Email fail होने पर भी registration को fail मत करो
    }

    // Attach to Google Calendar (only webinars)
    if (!webinar || !webinar.googleEventId) {
      return res.status(201).json({
        success: true,
        message: "Registration successful (No Google event linked)",
        Registration,
      });
    }

    // Google Calendar API (unchanged)
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const event = await calendar.events.get({
      calendarId: webinar.googleCalendarId || "primary",
      eventId: webinar.googleEventId,
    });

    const attendees = event.data.attendees || [];
    attendees.push({ email: Registration.email });

    await calendar.events.patch({
      calendarId: webinar.googleCalendarId || "primary",
      eventId: webinar.googleEventId,
      resource: { attendees },
      sendUpdates: "all", // notify the new attendee
    });

    res
      .status(201)
      .json({
        message:
          "Registration successful, attendee added to Google event & email sent",
        Registration,
      });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ err: err.message });
  }
};


export const updateWebinarRegistration = async (req, res) => {
  try {
    const { id } = req.params; // Registration ID
    const updateData = req.body; // Updated fields

    // ✅ Find and update
    const updatedRegistration = await webinarRegistrationModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // return updated document
    ).populate("webinarId");

    if (!updatedRegistration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration updated successfully",
      registration: updatedRegistration,
    });

  } catch (err) {
    console.error("Error updating registration:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const deleteWebinarRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete
    const deleted = await webinarRegistrationModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting registration:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};






// export const CreateOneToOneRegistration = async (req, res) => {
//   try {
//     const { email, mobile, one_to_oneId, firstName, lastName } = req.body;

//     // ✅ check duplicate
//     const existing = await webinarRegistrationModel.findOne({
//       email,
//       mobile,
//       one_to_oneId,
//       type: "one_to_one"
//     });

//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message: "You are already registered for this session."
//       });
//     }

//     const Registration = new webinarRegistrationModel({ ...req.body, type: "one_to_one" });
//     await Registration.save();

//     // Step 3: Fetch one-to-one session details with speaker information
//     const oneToOneSession = await OneToOneModel.findById(one_to_oneId).populate('Speaker');
//     if (!oneToOneSession) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     const speaker = oneToOneSession.Speaker;
//     const sessionDate = oneToOneSession.date;
//     const startTime = oneToOneSession.startTime;
//     const endTime = oneToOneSession.endTime;
//     const paymentType = oneToOneSession.paymentType || "free";

//     // ✅ Send email to user (attendee)
//     const userMailOptions = {
//       from: process.env.SMTP_EMAIL,
//       to: Registration.email,
//       subject: `One-to-One Session Confirmation with ${speaker.firstName} ${speaker.lastName}`,
//       html: `
//         <style>
//           body { font-family: 'Arial', sans-serif; background-color: #E3F2FD; margin: 0; padding: 0; text-align: center; }
//           table { border-spacing: 0; width: 100%; }
//           td { padding: 0; }
//           .email-container { max-width: 600px; margin: 30px auto; background-color: #FFFFFF; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
//           .header { text-align: center; padding: 15px; background-color: rgb(204, 226, 249); }
//           .content { padding: 25px; font-size: 16px; line-height: 1.6; color: #333; text-align: left; }
//           .content p { margin: 10px 0; }
//           .session-details { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
//           .footer { background-color: #F8F9FA; padding: 20px; font-size: 14px; color: #555; text-align: center; border-top: 1px solid #ddd; }
//           .footer a { color: #007BFF; text-decoration: none; font-weight: bold; }
//         </style>
//         <body>
//           <table role="presentation">
//             <tr>
//               <td align="center">
//                 <table role="presentation" class="email-container">
//                   <tr style="background-color: rgb(204, 226, 249);">
//                     <td class="header">
//                       <h1 style="color: #333; margin: 0;">One-to-One Session Confirmation</h1>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td class="content">
//                       <h2 style="text-align: center; color: #333;">Hello ${Registration.firstName} ${Registration.lastName}!</h2>
//                       <p>🎉 Your one-to-one session has been successfully booked.</p>

//                       <div class="session-details">
//                         <h3 style="color: #333; margin-top: 0;">Session Details:</h3>
//                         <p><strong>Expert:</strong> ${speaker.salutation || ''} ${speaker.firstName} ${speaker.lastName}</p>
//                         <p><strong>Date:</strong> ${sessionDate}</p>
//                         <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
//                         <p><strong>Session Type:</strong> ${paymentType === 'paid' ? 'Paid Session' : 'Free Session'}</p>
//                         ${speaker.description ? `<p><strong>About Expert:</strong> ${speaker.description}</p>` : ''}
//                       </div>

//                       <p><strong>Important Notes:</strong></p>
//                       <ul>
//                         <li>Please be available 5 minutes before the session starts</li>
//                         <li>Ensure you have stable internet connection</li>
//                         <li>The meeting link will be shared 1 hour before the session</li>
//                         <li>For any queries, contact us at ${process.env.SMTP_EMAIL}</li>
//                       </ul>

//                       <p>We look forward to your session!</p>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td class="footer">
//                       <p style="font-size: 17px; color: #aaa; padding: 10px 0;">Stay connected with us through our social media platforms.</p>
//                       <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
//                         <a href="https://www.instagram.com/" target="_blank" style="background-color: #E4405F; padding: 6px; border-radius: 6px; color: white;">Instagram</a>
//                         <a href="https://www.facebook.com/" target="_blank" style="background-color: #1877F2; padding: 6px; border-radius: 6px; color: white;">Facebook</a>
//                         <a href="https://www.linkedin.com/" target="_blank" style="background-color: #0077B5; padding: 6px; border-radius: 6px; color: white;">LinkedIn</a>
//                         <a href="https://twitter.com/" target="_blank" style="background-color: #1DA1F2; padding: 6px; border-radius: 6px; color: white;">Twitter</a>
//                       </div>
//                       <p>If you have any questions, contact us at <a href="mailto:${process.env.SMTP_EMAIL}">${process.env.SMTP_EMAIL}</a>.</p>
//                       <p>&copy; 2024 Your Company | All rights reserved.</p>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </body>
//       `,
//     };
//     // ✅ Send email to speaker
//     const speakerMailOptions = {
//       from: process.env.SMTP_EMAIL,
//       to: speaker.email, // Speaker's email
//       subject: `New One-to-One Session Booking - ${Registration.firstName} ${Registration.lastName}`,
//       html: `
//         <style>
//           body { font-family: 'Arial', sans-serif; background-color: #f0f8ff; margin: 0; padding: 0; text-align: center; }
//           table { border-spacing: 0; width: 100%; }
//           td { padding: 0; }
//           .email-container { max-width: 600px; margin: 30px auto; background-color: #FFFFFF; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
//           .header { text-align: center; padding: 15px; background-color: #4CAF50; color: white; }
//           .content { padding: 25px; font-size: 16px; line-height: 1.6; color: #333; text-align: left; }
//           .content p { margin: 10px 0; }
//           .attendee-details { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
//           .footer { background-color: #F8F9FA; padding: 20px; font-size: 14px; color: #555; text-align: center; border-top: 1px solid #ddd; }
//         </style>
//         <body>
//           <table role="presentation">
//             <tr>
//               <td align="center">
//                 <table role="presentation" class="email-container">
//                   <tr>
//                     <td class="header">
//                       <h1 style="color: white; margin: 0;">New Session Booking</h1>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td class="content">
//                       <h2 style="text-align: center; color: #333;">Hello ${speaker.salutation || ''} ${speaker.firstName} ${speaker.lastName}!</h2>
//                       <p>You have a new one-to-one session booking.</p>

//                       <div class="attendee-details">
//                         <h3 style="color: #333; margin-top: 0;">Attendee Details:</h3>
//                         <p><strong>Name:</strong> ${Registration.firstName} ${Registration.lastName}</p>
//                         <p><strong>Email:</strong> ${Registration.email}</p>
//                         <p><strong>Mobile:</strong> ${Registration.mobile}</p>
//                         <p><strong>Location:</strong> ${Registration.city ? await getCityName(Registration.city) : 'N/A'}, ${Registration.state ? await getStateName(Registration.state) : 'N/A'}</p>
//                         ${Registration.gstNumber ? `<p><strong>GST Number:</strong> ${Registration.gstNumber}</p>` : ''}
//                       </div>

//                       <div class="attendee-details">
//                         <h3 style="color: #333; margin-top: 0;">Session Details:</h3>
//                         <p><strong>Date:</strong> ${sessionDate}</p>
//                         <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
//                         <p><strong>Session Type:</strong> ${paymentType === 'paid' ? 'Paid Session' : 'Free Session'}</p>
//                       </div>

//                       <p><strong>Preparation Notes:</strong></p>
//                       <ul>
//                         <li>Please be available 5 minutes before the session starts</li>
//                         <li>The meeting link will be automatically generated and shared</li>
//                         <li>You will receive a reminder 1 hour before the session</li>
//                       </ul>

//                       <p>Thank you for sharing your expertise!</p>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td class="footer">
//                       <p>If you have any scheduling conflicts, please contact the admin immediately.</p>
//                       <p>Contact admin: <a href="mailto:${process.env.SMTP_EMAIL}">${process.env.SMTP_EMAIL}</a></p>
//                       <p>&copy; 2024 Your Company | All rights reserved.</p>
//                     </td>
//                   </tr>
//                 </table>
//               </td>
//             </tr>
//           </table>
//         </body>
//       `,
//     };

//     // Send emails
//     try {
//       // Send email to user
//       await transporter.sendMail(userMailOptions);
//       console.log("✅ Registration email sent to user:", email);

//       // Send email to speaker
//       await transporter.sendMail(speakerMailOptions);
//       console.log("✅ Notification email sent to speaker:", speaker.email);

//     } catch (mailErr) {
//       console.error("❌ Email sending error:", mailErr.message);
//       // Email fail होने पर भी registration को fail मत करो
//     }

//       // For paid sessions, proceed to payment
//     if (paymentType.toLowerCase() === "paid") {
//       return res.status(200).json({
//         success: true,
//         message: "Registration successful. Proceed to payment.",
//         Registration,
//         requiresPayment: true
//       });
//     }

//       // For free sessions
//     res.status(201).json({
//       success: true,
//       message: "Registration successful for free session.",
//       Registration,
//       requiresPayment: false
//     });


//     //  No Google Calendar required here
//     res.status(201).json({
//       success: true,
//       message: "One-to-One session registration successful",
//       Registration
//     });
//   } catch (err) {
//     console.error("One-to-One Registration error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// Update One-to-One registration

export const CreateOneToOneRegistration = async (req, res) => {
  try {
    const { email, mobile, one_to_oneId, firstName, lastName } = req.body;

    // Step 1: Check for existing registration
    const existing = await webinarRegistrationModel.findOne({
      email,
      mobile,
      one_to_oneId,
      type: "one_to_one",
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this session with this email and mobile.",
      });
    }

    // Step 2: Create new registration
    const Registration = new webinarRegistrationModel({
      ...req.body,
      type: "one_to_one",
    });
    await Registration.save();

    // Step 3: Fetch one-to-one session details with speaker information
    const oneToOneSession = await OneToOneModel.findById(one_to_oneId).populate('Speaker');

    if (!oneToOneSession) {
      return res.status(404).json({ message: "Session not found" });
    }

    const speaker = oneToOneSession.Speaker;
    const sessionDate = oneToOneSession.selectDate;
    const startTime = oneToOneSession.startTime;
    const endTime = oneToOneSession.endTime;
    const paymentType = oneToOneSession.paymentType || "free";

    // ✅ Send email to user (attendee)
    const userMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: Registration.email,
      subject: `One-to-One Session Confirmation with ${speaker.firstName} ${speaker.lastName}`,
      html: `
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #E3F2FD; margin: 0; padding: 0; text-align: center; }
          table { border-spacing: 0; width: 100%; }
          td { padding: 0; }
          .email-container { max-width: 600px; margin: 30px auto; background-color: #FFFFFF; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 15px; background-color: rgb(204, 226, 249); }
          .content { padding: 25px; font-size: 16px; line-height: 1.6; color: #333; text-align: left; }
          .content p { margin: 10px 0; }
          .session-details { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { background-color: #F8F9FA; padding: 20px; font-size: 14px; color: #555; text-align: center; border-top: 1px solid #ddd; }
          .footer a { color: #007BFF; text-decoration: none; font-weight: bold; }
        </style>
        <body>
          <table role="presentation">
            <tr>
              <td align="center">
                <table role="presentation" class="email-container">
                  <tr style="background-color: rgb(204, 226, 249);">
                    <td class="header">
                      <h1 style="color: #333; margin: 0;">One-to-One Session Confirmation</h1>
                    </td>
                  </tr>
                  <tr>
                    <td class="content">
                      <h2 style="text-align: center; color: #333;">Hello ${Registration.firstName} ${Registration.lastName}!</h2>
                      <p>🎉 Your one-to-one session has been successfully booked.</p>
                      
                      <div class="session-details">
                        <h3 style="color: #333; margin-top: 0;">Session Details:</h3>
                        <p><strong>Expert:</strong> ${speaker.salutation || ''} ${speaker.firstName} ${speaker.lastName}</p>
                        <p><strong>Date:</strong> ${sessionDate}</p>
                        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
                        <p><strong>Session Type:</strong> ${paymentType === 'paid' ? 'Paid Session' : 'Free Session'}</p>
                        ${speaker.description ? `<p><strong>About Expert:</strong> ${speaker.description}</p>` : ''}
                      </div>

                      <p><strong>Important Notes:</strong></p>
                      <ul>
                        <li>Please be available 5 minutes before the session starts</li>
                        <li>Ensure you have stable internet connection</li>
                        <li>The meeting link will be shared 1 hour before the session</li>
                        <li>For any queries, contact us at ${process.env.SMTP_EMAIL}</li>
                      </ul>

                      <p>We look forward to your session!</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="footer">
                      <p style="font-size: 17px; color: #aaa; padding: 10px 0;">Stay connected with us through our social media platforms.</p>
                      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                        <a href="https://www.instagram.com/" target="_blank" style="background-color: #E4405F; padding: 6px; border-radius: 6px; color: white;">Instagram</a>
                        <a href="https://www.facebook.com/" target="_blank" style="background-color: #1877F2; padding: 6px; border-radius: 6px; color: white;">Facebook</a>
                        <a href="https://www.linkedin.com/" target="_blank" style="background-color: #0077B5; padding: 6px; border-radius: 6px; color: white;">LinkedIn</a>
                        <a href="https://twitter.com/" target="_blank" style="background-color: #1DA1F2; padding: 6px; border-radius: 6px; color: white;">Twitter</a>
                      </div>
                      <p>If you have any questions, contact us at <a href="mailto:${process.env.SMTP_EMAIL}">${process.env.SMTP_EMAIL}</a>.</p>
                      <p>&copy; 2024 Your Company | All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      `,
    };

    // ✅ Send email to speaker
    const speakerMailOptions = {
      from: process.env.SMTP_EMAIL,
      to: speaker.email, // Speaker's email
      subject: `New One-to-One Session Booking - ${Registration.firstName} ${Registration.lastName}`,
      html: `
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #f0f8ff; margin: 0; padding: 0; text-align: center; }
          table { border-spacing: 0; width: 100%; }
          td { padding: 0; }
          .email-container { max-width: 600px; margin: 30px auto; background-color: #FFFFFF; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 15px; background-color: #4CAF50; color: white; }
          .content { padding: 25px; font-size: 16px; line-height: 1.6; color: #333; text-align: left; }
          .content p { margin: 10px 0; }
          .attendee-details { background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { background-color: #F8F9FA; padding: 20px; font-size: 14px; color: #555; text-align: center; border-top: 1px solid #ddd; }
        </style>
        <body>
          <table role="presentation">
            <tr>
              <td align="center">
                <table role="presentation" class="email-container">
                  <tr>
                    <td class="header">
                      <h1 style="color: white; margin: 0;">New Session Booking</h1>
                    </td>
                  </tr>
                  <tr>
                    <td class="content">
                      <h2 style="text-align: center; color: #333;">Hello ${speaker.salutation || ''} ${speaker.firstName} ${speaker.lastName}!</h2>
                      <p>You have a new one-to-one session booking.</p>
                      
                      <div class="attendee-details">
                        <h3 style="color: #333; margin-top: 0;">Attendee Details:</h3>
                        <p><strong>Name:</strong> ${Registration.firstName} ${Registration.lastName}</p>
                        <p><strong>Email:</strong> ${Registration.email}</p>
                        <p><strong>Mobile:</strong> ${Registration.mobile}</p>
                        <p><strong>Location:</strong> ${Registration.city}, ${Registration.state}</p>
                        ${Registration.gstNumber ? `<p><strong>GST Number:</strong> ${Registration.gstNumber}</p>` : ''}
                      </div>

                      <div class="attendee-details">
                        <h3 style="color: #333; margin-top: 0;">Session Details:</h3>
                        <p><strong>Date:</strong> ${sessionDate}</p>
                        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
                        <p><strong>Session Type:</strong> ${paymentType === 'paid' ? 'Paid Session' : 'Free Session'}</p>
                      </div>

                      <p><strong>Preparation Notes:</strong></p>
                      <ul>
                        <li>Please be available 5 minutes before the session starts</li>
                        <li>The meeting link will be automatically generated and shared</li>
                        <li>You will receive a reminder 1 hour before the session</li>
                      </ul>

                      <p>Thank you for sharing your expertise!</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="footer">
                      <p>If you have any scheduling conflicts, please contact the admin immediately.</p>
                      <p>Contact admin: <a href="mailto:${process.env.SMTP_EMAIL}">${process.env.SMTP_EMAIL}</a></p>
                      <p>&copy; 2024 Your Company | All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      `,
    };

    // Send emails
    try {
      // Send email to user
      await transporter.sendMail(userMailOptions);
      console.log("✅ Registration email sent to user:", email);

      // Send email to speaker
      await transporter.sendMail(speakerMailOptions);
      console.log("✅ Notification email sent to speaker:", speaker.email);

    } catch (mailErr) {
      console.error("❌ Email sending error:", mailErr.message);
      // Email fail होने पर भी registration को fail मत करो
    }

    // For paid sessions, proceed to payment
    if (paymentType.toLowerCase() === "paid") {
      return res.status(200).json({
        success: true,
        message: "Registration successful. Proceed to payment.",
        Registration,
        requiresPayment: true
      });
    }

    // For free sessions
    res.status(201).json({
      success: true,
      message: "Registration successful for free session.",
      Registration,
      requiresPayment: false
    });

  } catch (err) {
    console.error("One-to-One Registration error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Helper functions to get city and state names (if needed)
async function getCityName(cityId) {
  try {
    const city = await CityModel.findById(cityId);
    return city ? city.name : 'N/A';
  } catch (error) {
    return 'N/A';
  }
}

async function getStateName(stateId) {
  try {
    const state = await StateModel.findById(stateId);
    return state ? state.name : 'N/A';
  } catch (error) {
    return 'N/A';
  }
}



export const updateOneToOneRegistration = async (req, res) => {
  try {
    const { id } = req.params; // Registration ID
    const updateData = req.body; // Updated fields

    // Find and update the registration
    const updatedRegistration = await webinarRegistrationModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    ).populate("one_to_oneId"); // Populate the session details

    if (!updatedRegistration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "One-to-One registration updated successfully",
      registration: updatedRegistration,
    });

  } catch (err) {
    console.error("Error updating One-to-One registration:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// controllers/oneToOneRegistrationController.js

export const deleteOneToOneRegistration = async (req, res) => {
  try {
    const { id } = req.params; // Registration ID

    // Find and delete the registration
    const deletedRegistration = await webinarRegistrationModel.findByIdAndDelete(id);

    if (!deletedRegistration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "One-to-One registration deleted successfully",
      registration: deletedRegistration,
    });

  } catch (err) {
    console.error("Error deleting One-to-One registration:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




// Get all webinar registrations
export const getWebinarRegistrationsList = async (req, res) => {
  try {
    const registrations = await webinarRegistrationModel
      .find({ type: "webinar" })
      .populate("webinarId");
    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all one-to-one registrations
export const getOneToOneRegistrationsList = async (req, res) => {
  try {
    const registrations = await webinarRegistrationModel
      .find({ type: "one_to_one" })
      .populate("one_to_oneId");
    res.json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getWebinarRegistration = async (req, res) => {

  try {

    const Registration = await webinarRegistrationModel.find().populate("webinarId");
    res.json(Registration);
    console.log(Registration);


  } catch (err) {
    res.status(500).json({ err: "Server error" });
  }
}



export const getWebinarRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching registration ID:", id);

    const registration = await webinarRegistrationModel.findById(id).populate("webinarId");
    console.log("Registration found:", registration);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json(registration);
  } catch (err) {
    console.error("Error in getWebinarRegistrationById:", err);
    res.status(500).json({ message: err.message });
  }
};


export const createGoogleEvent = async (req, res) => {
  try {
    const { id: registrationId } = req.params;
    const registration = await webinarRegistrationModel.findById(registrationId);

    if (!registration)
      return res.status(404).json({ message: "Registration not found" });

    const webinar = await WebinarModel.findById(registration.webinarId);

    if (!webinar)
      return res.status(404).json({ message: "Webinar not found" });

    if (!webinar.googleEventId) {
      return res.status(400).json({ message: "No Google event exists for this webinar" });
    }

    // ✅ Define calendar instance here
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Get existing event
    const event = await calendar.events.get({
      calendarId: webinar.googleCalendarId || "primary",
      eventId: webinar.googleEventId,
    });

    const attendees = event.data.attendees || [];

    // Avoid duplicate attendee
    if (!attendees.find(a => a.email === registration.email)) {
      attendees.push({ email: registration.email });
    }

    await calendar.events.patch({
      calendarId: webinar.googleCalendarId || "primary",
      eventId: webinar.googleEventId,
      resource: { attendees },
      sendUpdates: "all",
    });

    res.status(200).json({
      success: true,
      message: "Attendee added to existing Google event",
    });

  } catch (err) {
    console.error("Error adding attendee to Google Calendar event:", err);
    res.status(500).json({ message: "Failed to add attendee" });
  }
};




