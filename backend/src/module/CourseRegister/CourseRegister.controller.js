import CourseRegisterModel from './CourseRegister.model.js';
import nodemailer from "nodemailer";

export const createCourseRegistration = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            mobile,
            pinCode,
            country,
            state,
            city,
            courseId,
            type = 'course',
            selectedPostOffice
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !mobile || !pinCode || !country || !state || !city || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Create new registration
        const newRegistration = new CourseRegisterModel({
            firstName,
            lastName,
            email,
            mobile,
            pinCode,
            country,
            state,
            city,
            courseId,
            type,
            selectedPostOffice
        });

        // Save to database
        const savedRegistration = await newRegistration.save();


        const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
              }
            });
        // Send confirmation email (optional)
        try {
            await transporter.sendMail({
                from: process.env.SMTP_EMAIL,
                to: email,
                subject: 'Course Registration Confirmation',
                html: `
          <h2>Thank you for registering!</h2>
          <p>Dear ${firstName} ${lastName},</p>
          <p>You have successfully registered for the course.</p>
          <p>Registration ID: ${savedRegistration._id}</p>
          <p>We will contact you soon with further details.</p>
          <br>
          <p>Best regards,<br>Team</p>
        `
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the registration if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            Registration: savedRegistration
        });

    } catch (error) {
        console.error('Course registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Optional: Get all registrations (for admin)
export const getAllCourseRegistrations = async (req, res) => {
    try {
        const registrations = await CourseRegisterModel.find()
            .populate('courseId')
            .sort({ _id: -1 });

        res.status(200).json({
            success: true,
            data: registrations
        });
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Optional: Get registration by ID
export const getCourseRegistrationById = async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await CourseRegisterModel.findById(id)
            .populate('courseId');

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.status(200).json({
            success: true,
            data: registration
        });
    } catch (error) {
        console.error('Get registration by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};