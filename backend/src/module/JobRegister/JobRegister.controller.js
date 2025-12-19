import JobRegisterModel from "./JobRegister.model.js";
import generalSettingModel from "../../models/generalsettings.model.js";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import JobPostModel from "../jobPost/jobPost.model.js";
const logoUrl = `https://talent.ejobocean.com/upload/settings/1747379111_1739879134_ejob_oceanlogo.png`;


export const CreateJobRegisteration = async (req, res) => {

  try {
    const { jobId, firstName, lastName, email, mobile, country, state, city } = req.body;
    const resume = req.file ? req.file.path : null;

    console.log("📥 Received job application data:", {
      jobId, firstName, lastName, email, mobile, country, state, city, resume
    });

    if (!resume) return res.status(400).json({ success: false, message: "Resume is required" });

    const settings = await generalSettingModel.findOne();
    const companyName = settings?.companyName || "Your Company";
    const companyEmail = settings?.companyEmail || "your email";

    const existingRegistration = await JobRegisterModel.findOne({
      jobId,
      $or: [{ email }, { mobile }]
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job with this email or mobile."
      });
    }


    const job = await JobPostModel.findById(jobId)
      .populate("postedBy", "name email") // Populate job poster details
      .populate("jobTitle", "jobTitle");


    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    const newRegistration = new JobRegisterModel({
      jobId,
      firstName,
      lastName,
      email,
      mobile,
      country,
      state,
      city,
      resume
    });

    await newRegistration.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });


    // ✅ 1. Email to Applicant (Job Seeker)
    const applicantMailOptions = {
      from: `"${companyName}" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `Application Confirmation - ${job.jobTitle}`,
      html: `
                <body style="margin:0; padding:0; background-color:#E3F2FD; font-family: Arial, sans-serif;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="background-color:#E3F2FD;">
                        <tr>
                            <td align="center">
                                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px; margin:30px auto; background:#FFFFFF; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.1); overflow:hidden;">
                                    <tr>
                                        <td align="center" bgcolor="#CCE2F9" style="padding:20px;">
                                            <img src="${logoUrl}" alt="Company Logo" width="200" style="display:block; margin:auto;" />
                                            <h1 style="margin:10px 0 0; font-size:22px; font-weight:bold; color:#333333;">Job Application Confirmation</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:25px; font-size:16px; line-height:1.6; color:#333333; text-align:left;">
                                            <h3>Hi ${firstName} ${lastName},</h3>
                                            <p>Thank you for applying for the position: <strong>${job.jobTitle}</strong>.</p>
                                            <p>Your application has been successfully received and is under review.</p>
                                            <p>We will contact you soon if your profile matches our requirements.</p>
                                            <br/>
                                            <p><strong>Application Details:</strong></p>
                                            <ul>
                                                <li><strong>Job Title:</strong> ${job.jobTitle}</li>
                                                <li><strong>Applied On:</strong> ${new Date().toLocaleDateString()}</li>
                                                <li><strong>Application ID:</strong> ${newRegistration._id}</li>
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bgcolor="#F8F9FA" style="padding:20px; font-size:14px; color:#555555; text-align:center; border-top:1px solid #dddddd;">
                                            <p style="font-size:16px; color:#888; margin:0 0 15px;">Stay connected with us</p>
                                            <p style="margin:15px 0 5px;">If you have any questions, contact us at <a href="mailto:${companyEmail}" style="color:#007BFF; text-decoration:none; font-weight:bold;">${companyEmail}</a>.</p>
                                            <p style="margin:0;">&copy; ${new Date().getFullYear()} ${companyName} | All rights reserved.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
            `
    };

    // // ✅ 2. Email to Job Poster (Employer/Admin)
    // let employerMailOptions = null;
    // if (job.postedBy && job.postedBy.email) {

    //     employerMailOptions = {
    //         from: `"${companyName}" <${process.env.SMTP_EMAIL}>`,
    //         to: job.postedBy.email,
    //         subject: `New Application Received - ${job.jobTitle}`,
    //         html: `
    //             <body style="margin:0; padding:0; background-color:#f8f9fa; font-family: Arial, sans-serif;">
    //                 <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="background-color:#f8f9fa;">
    //                     <tr>
    //                         <td align="center">
    //                             <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px; margin:30px auto; background:#FFFFFF; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.1); overflow:hidden;">
    //                                 <tr>
    //                                     <td align="center" bgcolor="#4CAF50" style="padding:20px;">
    //                                         <img src="${logoUrl}" alt="Company Logo" width="200" style="display:block; margin:auto;" />
    //                                         <h1 style="margin:10px 0 0; font-size:22px; font-weight:bold; color:#FFFFFF;">New Job Application</h1>
    //                                     </td>
    //                                 </tr>
    //                                 <tr>
    //                                     <td style="padding:25px; font-size:16px; line-height:1.6; color:#333333; text-align:left;">
    //                                         <h3>Hello ${job.postedBy.name || 'Employer'},</h3>
    //                                         <p>You have received a new application for your job posting: <strong>${job.jobTitle}</strong>.</p>

    //                                         <p><strong>Applicant Details:</strong></p>
    //                                         <table style="width:100%; border-collapse: collapse; margin:15px 0;">
    //                                             <tr>
    //                                                 <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Name:</strong></td>
    //                                                 <td style="padding:8px; border:1px solid #ddd;">${firstName} ${lastName}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Email:</strong></td>
    //                                                 <td style="padding:8px; border:1px solid #ddd;">${email}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Mobile:</strong></td>
    //                                                 <td style="padding:8px; border:1px solid #ddd;">${mobile}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Location:</strong></td>
    //                                                 <td style="padding:8px; border:1px solid #ddd;">${city}, ${state}, ${country}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Applied On:</strong></td>
    //                                                 <td style="padding:8px; border:1px solid #ddd;">${new Date().toLocaleString()}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Application ID:</strong></td>
    //                                                 <td style="padding:8px; border:1px solid #ddd;">${newRegistration._id}</td>
    //                                             </tr>
    //                                             <tr>
    //                                                 <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Resume:</strong></td>
    //                                                 <td style="padding:8px; border:1px solid #ddd;">${resume._id}</td>
    //                                             </tr>
    //                                         </table>

    //                                         <p style="margin-top:20px;">Please login to your dashboard to review this application.</p>
    //                                     </td>
    //                                 </tr>
    //                                 <tr>
    //                                     <td bgcolor="#F8F9FA" style="padding:20px; font-size:14px; color:#555555; text-align:center; border-top:1px solid #dddddd;">
    //                                         <p style="margin:0;">This is an automated notification from ${companyName}.</p>
    //                                     </td>
    //                                 </tr>
    //                             </table>
    //                         </td>
    //                     </tr>
    //                 </table>
    //             </body>
    //         `
    //     };
    // }
    let employerMailOptions = null;
    if (job.postedBy && job.postedBy.email) {
      employerMailOptions = {
        from: `"${companyName}" <${process.env.SMTP_EMAIL}>`,
        to: job.postedBy.email,
        subject: `New Application Received -${job.jobTitle}`,
        html: `
            <body style="margin:0; padding:0; background-color:#f8f9fa; font-family: Arial, sans-serif;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="background-color:#f8f9fa;">
                    <tr>
                        <td align="center">
                            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px; margin:30px auto; background:#FFFFFF; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.1); overflow:hidden;">
                                <tr>
                                    <td align="center" bgcolor="#4CAF50" style="padding:20px;">
                                        <img src="${logoUrl}" alt="Company Logo" width="200" style="display:block; margin:auto;" />
                                        <h1 style="margin:10px 0 0; font-size:22px; font-weight:bold; color:#FFFFFF;">New Job Application</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:25px; font-size:16px; line-height:1.6; color:#333333; text-align:left;">
                                        <h3>Hello ${job.postedBy.name || 'Employer'},</h3>
                                        <p>You have received a new application for your job posting: <strong>${job.jobTitle}</strong>.</p>

                                        <p><strong>Applicant Details:</strong></p>
                                        <table style="width:100%; border-collapse: collapse; margin:15px 0;">
                                            <tr>
                                                <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Name:</strong></td>
                                                <td style="padding:8px; border:1px solid #ddd;">${firstName} ${lastName}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Email:</strong></td>
                                                <td style="padding:8px; border:1px solid #ddd;">${email}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Mobile:</strong></td>
                                                <td style="padding:8px; border:1px solid #ddd;">${mobile}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Location:</strong></td>
                                                <td style="padding:8px; border:1px solid #ddd;">${city}, ${state}, ${country}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px; border:1px solid #ddd; background:#f9f9f9;"><strong>Applied On:</strong></td>
                                                <td style="padding:8px; border:1px solid #ddd;">${new Date().toLocaleString()}</td>
                                            </tr>

                                        </table>

                                        <p style="margin-top:20px; color:#4CAF50; font-weight:bold;">
                                            📎 Resume file is attached with this email.
                                        </p>

                                        <p style="margin-top:20px;">Please login to your dashboard to review this application.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#F8F9FA" style="padding:20px; font-size:14px; color:#555555; text-align:center; border-top:1px solid #dddddd;">
                                        <p style="margin:0;">This is an automated notification from ${companyName}.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        `,
        // ✅ Resume file attachment
        attachments: [
          {
            filename: `Resume_${firstName}_${lastName}_${new Date().getTime()}.pdf`,
            path: resume, // This is the file path from multer
            contentType: 'application/pdf'
          }
        ]
      };
    }

    // Send emails
    try {
      // Send to applicant
      await transporter.sendMail(applicantMailOptions);
      console.log("Confirmation email sent to applicant:", email);

      // Send to job poster if available

      if (employerMailOptions) {

        await transporter.sendMail(employerMailOptions);
        console.log("Notification email sent to job poster:", job.postedBy.email);
      } else {
        console.log("No job poster email found for job:", jobId);
      }

    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Don't fail the registration if email fails
    }




    //     const mailOptions = {
    //       from: `"Job Portal" <${process.env.SMTP_EMAIL}>`,
    //       to: email, // send to user who applied
    //       subject: "Job Application Confirmation",
    //       html: `
    //   <body style="margin:0; padding:0; background-color:#E3F2FD; font-family: Arial, sans-serif;">
    //     <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="background-color:#E3F2FD;">
    //       <tr>
    //         <td align="center">

    //           <!-- Main Container -->
    //           <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:600px; margin:30px auto; background:#FFFFFF; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.1); overflow:hidden;">

    //             <!-- Header -->
    //             <tr>
    //               <td align="center" bgcolor="#CCE2F9" style="padding:20px;">
    //                 <img src="${logoUrl}" alt="Company Logo" width="200" style="display:block; margin:auto;" />
    //                 <h1 style="margin:10px 0 0; font-size:22px; font-weight:bold; color:#333333;">Job Application Confirmation</h1>
    //               </td>
    //             </tr>

    //             <!-- Content -->
    //             <tr>
    //               <td style="padding:25px; font-size:16px; line-height:1.6; color:#333333; text-align:left;">
    //                 <h3>Hi ${firstName},</h3>
    //                 <p>Thank you for applying for the job. Your application has been successfully received.</p>
    //                 <p>We will review your application and get back to you soon.</p>
    //                 <br/>
    //               </td>
    //             </tr>

    //             <!-- Footer -->
    //             <tr>
    //               <td bgcolor="#F8F9FA" style="padding:20px; font-size:14px; color:#555555; text-align:center; border-top:1px solid #dddddd;">
    //                 <p style="font-size:16px; color:#888; margin:0 0 15px;">Stay connected with us through our social media platforms.</p>
    //                 <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
    //                   <tr>
    //                     <td align="center" style="padding:5px;">
    //                       <a href="https://www.instagram.com/" target="_blank" style="background:#E4405F; padding:8px 12px; border-radius:6px; color:#fff; text-decoration:none;">Instagram</a>
    //                     </td>
    //                     <td align="center" style="padding:5px;">
    //                       <a href="https://www.facebook.com/" target="_blank" style="background:#1877F2; padding:8px 12px; border-radius:6px; color:#fff; text-decoration:none;">Facebook</a>
    //                     </td>
    //                     <td align="center" style="padding:5px;">
    //                       <a href="https://www.linkedin.com/" target="_blank" style="background:#0077B5; padding:8px 12px; border-radius:6px; color:#fff; text-decoration:none;">LinkedIn</a>
    //                     </td>
    //                     <td align="center" style="padding:5px;">
    //                       <a href="https://www.twitter.com/" target="_blank" style="background:#1DA1F2; padding:8px 12px; border-radius:6px; color:#fff; text-decoration:none;">Twitter</a>
    //                     </td>
    //                   </tr>
    //                 </table>
    //                 <p style="margin:15px 0 5px;">If you have any questions, contact us at <a href="mailto:${companyEmail}" style="color:#007BFF; text-decoration:none; font-weight:bold;">${companyEmail}</a>.</p>
    //                 <p style="margin:0;">&copy; ${new Date().getFullYear()} ${companyName} | All rights reserved.</p>
    //               </td>
    //             </tr>

    //           </table>
    //         </td>
    //       </tr>
    //     </table>
    //   </body>
    // `
    //     };

    //     transporter.sendMail(mailOptions, (err, info) => {
    //       if (err) {
    //         console.error("Error sending email:", err.message);
    //       } else {
    //         console.log("Email sent:", info.response);
    //       }
    //     });

    res.status(201).json({ success: true, registration: newRegistration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

//  Get all registrations

export const GetAllJobRegistrations = async (req, res) => {
  try {
    const registrations = await JobRegisterModel.find().populate("jobId", "jobTitle")

    res.status(200).json({ success: true, registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Get a single registration
export const GetJobRegistrationById = async (req, res) => {
  try {
    const registration = await JobRegisterModel.findById(req.params.id).populate("jobId", "jobTitle");
    if (!registration) return res.status(404).json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Update registration
export const UpdateJobRegistration = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, country, state, city } = req.body;
    const resume = req.file ? req.file.path : undefined;

    const updated = await JobRegisterModel.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, mobile, country, state, city, ...(resume && { resume }) },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Registration not found" });

    res.status(200).json({ success: true, registration: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Delete registration
export const DeleteJobRegistration = async (req, res) => {
  try {
    const deleted = await JobRegisterModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Registration not found" });

    res.status(200).json({ success: true, message: "Registration deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const GetRegistrationsByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;

    const registrations = await JobRegisterModel.find({ jobId })
      .populate("jobId", "jobTitle")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      registrations,
      count: registrations.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// Get job registrations by user email or mobile

// export const GetRegistrationsByUser = async (req, res) => {
//   try {
//     const { email, mobile } = req.query;

//     if (!email && !mobile) {
//       return res.status(400).json({
//         success: false,
//         message: "Email or mobile is required"
//       });
//     }

//     let query = {};
//     if (email) {
//       query.email = email;
//     } else if (mobile) {
//       query.mobile = mobile;
//     }

//     const registrations = await JobRegisterModel.find(query)
//       .populate({
//         path: "jobId",
//         select: "jobTitle companyId jobType jobShift skills description",
//         populate: {
//           path: "companyId",
//           select: "company.name company.employerLogo"
//         }
//       })
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       registrations,
//       count: registrations.length
//     });
//   } catch (err) {
//     console.error("Error fetching user registrations:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// JobRegister.controller.js - Updated GetRegistrationsByUser function
export const GetRegistrationsByUser = async (req, res) => {
  try {
    const { email, mobile } = req.query;

    if (!email && !mobile) {
      return res.status(400).json({
        success: false,
        message: "Email or mobile is required"
      });
    }

    let query = {};
    if (email) {
      query.email = email;
    } else if (mobile) {
      query.mobile = mobile;
    }

    const registrations = await JobRegisterModel.find(query)
      .populate({
        path: "jobId",
        select: "jobTitle companyId jobType jobShift skills description",
        populate: [
          {
            path: "companyId",
            select: "company.name company.employerLogo"
          },
          {
            path: "skills", // ✅ Skills ko populate karein
            select: "name" // Sirf name field chahiye
          },
          {
            path: "jobType", // ✅ JobType ko bhi populate karein
            select: "name"
          },
          {
            path: "jobShift", // ✅ JobShift ko bhi populate karein
            select: "name"
          }
        ]
      })
      .sort({ createdAt: -1 });

    console.log("Populated registrations:", JSON.stringify(registrations[0]?.jobId?.skills, null, 2));

    res.status(200).json({
      success: true,
      registrations,
      count: registrations.length
    });
  } catch (err) {
    console.error("Error fetching user registrations:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
