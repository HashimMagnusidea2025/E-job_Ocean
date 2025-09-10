import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

export const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Your OTP for Comment Verification",
        text: `Your OTP is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
};
