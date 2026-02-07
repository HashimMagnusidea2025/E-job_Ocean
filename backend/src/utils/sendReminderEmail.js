import nodemailer from "nodemailer";
import generalSettingModel from "../models/generalsettings.model.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendWebinarReminder = async ({
    email,
    firstName,
    webinarTitle,
    startTime,
    reminderType,
}) => {
    const settings = await generalSettingModel.findOne();
    const companyName = settings?.companyName || "Your Company";
    const companyEmail = settings?.companyEmail || "support@example.com";
    const logoUrl = settings?.logo
        ? `${process.env.BASE_URL}${settings.logo}`
        : `${process.env.BASE_URL}/uploads/default.png`;

    const formattedTime = new Date(startTime).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
    });

    const isFiveMin = reminderType === "5_minutes";

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: isFiveMin
            ? `🚨 Starting in 5 Minutes – ${webinarTitle}`
            : `⏰ Webinar Reminder – ${webinarTitle} (Tomorrow)`,

        html: `
<body style="margin:0; padding:0; background-color:#E3F2FD; font-family: Arial, sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#E3F2FD;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
  style="margin:30px auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 8px rgba(0,0,0,0.1);">

<!-- Header -->
<tr>
<td align="center" style="background:#CCE2F9; padding:20px;">
<img src="${logoUrl}" width="180" alt="Logo" />
<h2 style="margin:10px 0 0; color:#333;">
${isFiveMin ? "🚨 Webinar Starting Soon" : "⏰ Webinar Reminder"}
</h2>
</td>
</tr>

<!-- Content -->
<tr>
<td style="padding:25px; color:#333; font-size:16px; line-height:1.6;">
<p>Hello <strong>${firstName || "Participant"}</strong>,</p>

<p>
${isFiveMin
                ? `Your webinar <strong>"${webinarTitle}"</strong> is starting in <b>just 5 minutes</b>.`
                : `This is a friendly reminder that your webinar <strong>"${webinarTitle}"</strong> is scheduled for tomorrow.`}
</p>

<table width="100%" cellpadding="0" cellspacing="0"
 style="background:#f8f9fa; border-radius:8px; margin:15px 0;">
<tr>
<td style="padding:15px;">
<p style="margin:0;"><strong>🗓 Date & Time:</strong></p>
<p style="margin:5px 0;"><strong>${formattedTime} (IST)</strong></p>
</td>
</tr>
</table>

<p>
Please make sure you join on time and have a stable internet connection.
</p>

<p style="margin-top:20px;">
We’re excited to have you with us 🚀
</p>
</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#F8F9FA; padding:20px; text-align:center; font-size:14px; color:#666;">
<p>
Need help? Contact us at
<a href="mailto:${companyEmail}" style="color:#007BFF; text-decoration:none;">
${companyEmail}
</a>
</p>
<p style="margin-top:10px;">
&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>
</body>
`,
    };

    await transporter.sendMail(mailOptions);
};



export const sendOneToOneReminderEmail = async ({
  email,
  firstName,
  mentorName,
  startTime,
  reminderType,
}) => {
  const formattedTime = new Date(startTime).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const isFiveMin = reminderType === "5_minutes";

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: isFiveMin
      ? "🚨 Your One-to-One Session starts in 5 minutes"
      : "⏰ One-to-One Session Reminder (Tomorrow)",

    html: `
      <p>Hello <b>${firstName || "Participant"}</b>,</p>

      <p>
      ${
        isFiveMin
          ? `Your one-to-one session with <b>${mentorName}</b> is starting in <b>5 minutes</b>.`
          : `This is a reminder for your one-to-one session scheduled for tomorrow.`
      }
      </p>

      <p><b>🕒 Date & Time:</b> ${formattedTime} (IST)</p>

      <p>Please be ready on time 😊</p>

      <p>Best Regards,<br/>Team</p>
    `,
  });
};
