import Contactmodel from "./contact.model.js";
import nodemailer from "nodemailer";
import generalSettingModel from "../../models/generalsettings.model.js";
import axios from "axios";


export const createContact = async (req, res) => {

    try {
        const { fullName, contactNumber, email, message, captchaToken } = req.body;


        if (!fullName || !contactNumber || !email || !message) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (!captchaToken) {
            return res.status(400).json({ message: "Captcha verification required" });
        }

        // ✅ Step 1: Check if CAPTCHA token exists
        if (!captchaToken) {
            return res.status(400).json({ message: "Captcha verification required" });
        }

        // ✅ Step 2: Verify CAPTCHA with Google
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
        const { data: captchaRes } = await axios.post(
            verifyUrl,
            new URLSearchParams({
                secret: process.env.CAPTCHA_SECRET_KEY, // from your .env
                response: captchaToken, // from frontend
            }),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            }
        );


        if (!captchaRes.success) {
            return res.status(400).json({ message: "Captcha verification failed" });
        }
        const newContact = await Contactmodel.create({
            fullName,
            contactNumber,
            email,
            message
        })

        const settings = await generalSettingModel.findOne();
        const companyEmail = settings?.companyEmail;


        if (companyEmail) {
            // ✅ Configure mail transporter (using your Gmail or SMTP)
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.SMTP_EMAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            // ✅ Email content
            const mailOptions = {
                from: `"Ejobocean Contact Form" <${process.env.SMTP_USER}>`,
                to: companyEmail,
                subject: "New Contact Form Submission",
                html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Contact Number:</strong> ${contactNumber}</p>
          <p><strong>Message:</strong><br/> ${message}</p>
          <hr/>
          <small>This message was sent from the website contact form.</small>
        `,
            };

            // ✅ Send email
            await transporter.sendMail(mailOptions);
        }

        res.status(201).json({
            message: "Contact form submitted successfully",
            contact: newContact
        }
        )
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getAllContact = async (req, res) => {

    try {

        const contacts = await Contactmodel.find().sort({ createdAt: -1 });
        res.status(200).json(contacts)
    } catch (error) {
        res.status(500).json({ message: "Error Fetchig Contacts" })
    }
}



export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Contact ID is required" });
        }

        const deletedContact = await Contactmodel.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.status(200).json({
            message: "Contact deleted successfully",
            contact: deletedContact,
        });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ message: "Server error while deleting contact" });
    }
};
