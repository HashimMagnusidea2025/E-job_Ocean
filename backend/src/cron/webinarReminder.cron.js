import cron from "node-cron";
import WebinarModel from "../module/webinar/webinar.model.js";
import webinarRegistrationModel from "../module/webinarRegistration/webinarRegistration.model.js";
import { sendWebinarReminder,sendOneToOneReminderEmail } from "../utils/sendReminderEmail.js";
import OneToOneModel from "../module/OneToOne/OneToOne.model.js";
import CourseSchemaModel from "../module/Course/Course.model.js";
import courseRegistrationModel from "../module/CourseRegister/CourseRegister.model.js";
// cron.schedule("0 * * * *", async () => {
//   console.log("⏳ Running webinar reminder cron...");

//   const now = new Date();
//   const tomorrowStart = new Date(now);
//   tomorrowStart.setDate(now.getDate() + 1);
//   tomorrowStart.setHours(0, 0, 0, 0);

//   const tomorrowEnd = new Date(tomorrowStart);
//   tomorrowEnd.setHours(23, 59, 59, 999);

//   const webinars = await WebinarModel.find({
//     WebinarStartDateTime: {
//       $gte: tomorrowStart,
//       $lte: tomorrowEnd,
//     },
//   });

//   for (const webinar of webinars) {
//     const registrations = await webinarRegistrationModel.find({
//       webinarId: webinar._id,
//       type: "webinar",
//     });

//     for (const reg of registrations) {
//       await sendWebinarReminder({
//         email: reg.email,
//         firstName: reg.firstName,
//         webinarTitle: webinar.WebinarTitle,
//         startTime: webinar.WebinarStartDateTime,
//       });

//       console.log("✅ Reminder sent to:", reg.email);
//     }
//   }
// });




// cron.schedule("* * * * *", async () => {
//   console.log("⏳ Checking webinar reminders...");

//   const now = new Date();

//   // ---- 24 HOURS BEFORE WINDOW ----
//   const before24hStart = new Date(now.getTime() + 24 * 60 * 60 * 1000 - 60 * 1000);
//   const before24hEnd   = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 60 * 1000);

//   // ---- 5 MINUTES BEFORE WINDOW ----
//   const before5mStart = new Date(now.getTime() + 5 * 60 * 1000 - 30 * 1000);
//   const before5mEnd   = new Date(now.getTime() + 5 * 60 * 1000 + 30 * 1000);

//   const webinars = await WebinarModel.find({
//     WebinarStartDateTime: {
//       $gte: before24hStart,
//       $lte: before24hEnd,
//     },
//   });

//   const webinars5Min = await WebinarModel.find({
//     WebinarStartDateTime: {
//       $gte: before5mStart,
//       $lte: before5mEnd,
//     },
//   });

//   // 🔔 24 HOURS REMINDER
//   await sendReminders(webinars, "24_hours");

//   // 🔔 5 MINUTES REMINDER
//   await sendReminders(webinars5Min, "5_minutes");
// });



cron.schedule("* * * * *", async () => {
  console.log("⏳ Checking webinar reminders...");

  const now = new Date();

  // 🔹 ALL webinars fetch karo (string hai isliye)
  const webinars = await WebinarModel.find({
    WebinarStartDateTime: { $exists: true },
  });

  for (const webinar of webinars) {

    // 🔑 STRING → DATE
    const webinarStart = new Date(webinar.WebinarStartDateTime);

    if (isNaN(webinarStart)) {
      console.log("❌ Invalid date:", webinar.WebinarStartDateTime);
      continue;
    }

    const diffMs = webinarStart.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    console.log(
      `🕒 ${webinar.WebinarTitle} | Starts in ${diffHours} hrs / ${diffMinutes} min`
    );

    //  24 HOURS BEFORE
    if (diffHours === 24) {
      await sendReminders(webinar, "24_hours");
    }

    //  5 MINUTES BEFORE
    if (diffMinutes === 5) {
      await sendReminders(webinar, "5_minutes");
    }
  }
});


async function sendReminders(webinar, reminderType) {
  const registrations = await webinarRegistrationModel.find({
    webinarId: webinar._id,
    type: "webinar",
    [`reminderSent.${reminderType}`]: { $ne: true },
  });

  for (const reg of registrations) {
    await sendWebinarReminder({
      email: reg.email,
      firstName: reg.firstName,
      webinarTitle: webinar.WebinarTitle,
      startTime: webinar.WebinarStartDateTime,
    });

    await webinarRegistrationModel.updateOne(
      { _id: reg._id },
      { $set: { [`reminderSent.${reminderType}`]: true } }
    );

    console.log(`✅ ${reminderType} reminder sent to ${reg.email}`);
  }
}


cron.schedule("* * * * *", async () => {
  console.log("⏳ Checking ONE-TO-ONE reminders...");

  const now = new Date();

  const sessions = await OneToOneModel.find({
    sessionDateTime: { $exists: true },
  });

  for (const session of sessions) {
    const sessionStart = new Date(session.sessionDateTime);

    if (isNaN(sessionStart)) {
      console.log("❌ Invalid one-to-one date:", session.sessionDateTime);
      continue;
    }

    const diffMs = sessionStart.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));

    console.log(
      `🕒 One-to-One | Starts in ${diffHours} hrs / ${diffMinutes} min`
    );

    // 🔔 24 HOURS BEFORE
    if (diffHours === 24) {
      await sendOneToOneReminders(session, "24_hours");
    }

    // 🔔 5 MINUTES BEFORE
    if (diffMinutes === 5) {
      await sendOneToOneReminders(session, "5_minutes");
    }
  }
});


async function sendOneToOneReminders(session, reminderType) {
  const registrations = await webinarRegistrationModel.find({
    oneToOneId: session._id,
    type: "one_to_one",
    [`reminderSent.${reminderType}`]: { $ne: true },
  });

  for (const reg of registrations) {
    await sendOneToOneReminderEmail({
      email: reg.email,
      firstName: reg.firstName,
      mentorName: session.mentorName,
      startTime: session.sessionDateTime,
      reminderType,
    });

    await webinarRegistrationModel.updateOne(
      { _id: reg._id },
      { $set: { [`reminderSent.${reminderType}`]: true } }
    );

    console.log(`✅ One-to-One ${reminderType} reminder sent to ${reg.email}`);
  }
}
