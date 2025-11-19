import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import roleModel from "../models/role.model.js";
import dotenv, { config } from 'dotenv';
import axios from "axios";

dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});



class AuthController {

  static async register(req, res) {
    try {
      const { firstName, lastName, email, password, phone, confirmPassword, role, roleID } = req.body;

      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      };

      const userExist = await UserModel.findOne({ email });
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }


      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);


      // Create new user
      const user = await UserModel.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role,
        roleID,

      });

      res.status(201).json({
        message: "User created",
        token: generateToken(user._id),
        user
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }


  static async MentorRegister(req, res) {


    try {
      const { firstName, lastName, email, phone, roleID, type } = req.body;
      const userExist = await UserModel.findOne({ email });
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = await UserModel.create({
        firstName,
        lastName,
        email,
        phone,
        roleID,
        Approved: "pending", // pending until admin approval
        type: "mentor"
      });
      res.status(201).json({
        success: true,
        message: "Mentor registered successfully. Awaiting admin approval.",
        user: newUser,
      });

    } catch (err) {
      console.error("Mentor register error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }


  static async getAllMentors(req, res) {
    try {
      const mentors = await UserModel.find({ Approved: { $in: ["pending", "Approved", "Rejected"] } })
        .populate("roleID")
        .sort({ createdAt: -1 });
      // ✅ Filter where role name is "Mentor"
      const mentorOnly = mentors.filter(
        (user) => user.roleID?.name?.toLowerCase() === "mentor"
      );
      res.status(200).json({
        success: true,
        data: mentorOnly
      });
    } catch (err) {
      console.error("Get Mentors error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // static async login(req, res) {
  //   try {
  //     const { email, password,role } = req.body;

  //     let user = await UserModel.findOne({ email }).populate({
  //       path: "roleID",
  //       populate: { path: "permissions" }
  //     });

  //     // 🔹 Handle Google login
  //   if (password === "google_oauth") {
  //     if (!user) {
  //       // find matching role document
  //       const defaultRole = await RoleModel.findOne({ name: role?.toLowerCase() || "seeker" });

  //       user = await UserModel.create({
  //         firstName: "Google",
  //         lastName: "User",
  //         email,
  //         password: "",
  //         status: "active",
  //         roleID: defaultRole?._id || null,
  //       });

  //       // populate role after creation
  //       user = await UserModel.findById(user._id).populate("roleID");
  //     }

  //     const token = generateToken(user._id);
  //     return res.json({ token, user });
  //   }

  //     if (!user) return res.status(401).json({ message: "Invalid email or password" });

  //     if (user.status !== "active") return res.status(403).json({ message: "Account not approved yet" });
  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

  //     const token = generateToken(user._id);
  //     res.json({ token, user });
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
  // }



  // static async approveMentor(req, res) {

  //   try {

  //     const { userId, password ,action} = req.body;

  //     const user = await UserModel.findById(userId);

  //     if (!user) return res.status(404).json({ message: "User not found" });

  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     user.password = hashedPassword;
  //     user.status = "active";
  //       user.Approved = "Approved"; // mark as approved
  //     await user.save();

  //     const mailOptions = {
  //       from: `"EJob Ocean" <${process.env.SMTP_EMAIL}>`,
  //       to: user.email,
  //       subject: "🎉 Your Mentor Account Approved",
  //       text: `
  //         Hello ${user.firstName},

  //             Your mentor account has been approved!

  //           Login Details:
  //           Email: ${user.email}
  //           Password: ${password}

  //         Best regards,
  //       EJob Ocean Team
  //        `,
  //     };
  //     try {
  //       await transporter.sendMail(mailOptions);
  //       console.log("✅ Registration email sent to", email);
  //     } catch (mailErr) {
  //       console.error(" Email sending error:", mailErr.message);
  //       // Email fail होने पर भी registration को fail मत करो
  //     }
  //   } catch (error) {

  //   }

  // }



  static async login(req, res) {
    try {
      const { email, password, role } = req.body;

      let user = await UserModel.findOne({ email }).populate({
        path: "roleID",
        populate: { path: "permissions" },
      });

      // 🔹 Handle Google login
      if (password === "google_oauth") {
        if (!user) {
          const defaultRole = await roleModel.findOne({
            name: role?.toLowerCase() || "seeker",
          });

          user = await UserModel.create({
            firstName: "Google",
            lastName: "User",
            email,
            phone,
            password: "",
            status: "active",
            roleID: defaultRole?._id || null,
          });

          user = await UserModel.findById(user._id).populate("roleID");
        }

        // 🚫 NEW CHECK for Mentor approval
        if (
          user.roleID?.name?.toLowerCase() === "mentor" &&
          user.Approved !== "Approved"
        ) {
          return res
            .status(403)
            .json({ message: "Your mentor account is pending admin approval." });
        }

        const token = generateToken(user._id);
        return res.json({ token, user });
      }

      // Normal login
      if (!user)
        return res.status(401).json({ message: "Invalid email or password" });

      // 🚫 NEW CHECK for mentor approval
      if (
        user.roleID?.name?.toLowerCase() === "mentor" &&
        user.Approved !== "Approved"
      ) {
        return res
          .status(403)
          .json({ message: "Your mentor account is pending admin approval." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid email or password" });

      const token = generateToken(user._id);
      res.json({ token, user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }



  static async approveMentor(req, res) {
    try {
      const { userId, password, action } = req.body;
      // action = "approve" or "reject"

      const user = await UserModel.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (action === "approve") {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.status = "active";
        user.Approved = "Approved";

        await user.save();

        const mailOptions = {
          from: `"EJob Ocean" <${process.env.SMTP_EMAIL}>`,
          to: user.email,
          subject: "🎉 Your Mentor Account Approved",
          text: `Hello ${user.firstName},\n\nYour mentor account has been approved!\n\nLogin Details:\nEmail: ${user.email}\nPassword: ${password}\n\nBest regards,\nEJob Ocean Team`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "Mentor approved successfully." });
      } else if (action === "reject") {
        user.Approved = "Rejected";
        await user.save();

        const mailOptions = {
          from: `"EJob Ocean" <${process.env.SMTP_EMAIL}>`,
          to: user.email,
          subject: "❌ Mentor Account Rejected",
          text: `Hello ${user.firstName},\n\nYour mentor account has been rejected.\n\nBest regards,\nEJob Ocean Team`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "Mentor rejected." });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }


  static async getMe(req, res) {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      res.json(req.user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }



  static async forgetPassword(req, res) {

    try {

      const { email } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User Not Found With This Email" })
      };

      const resetToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      const mailOptions = {
        from: `"EJob Ocean" <${process.env.SMTP_EMAIL}>`,
        to: user.email,
        subject: "🔐 Password Reset Request",
        html: `
          <p>Hello ${user.firstName},</p>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          <a href="${resetLink}" target="_blank">${resetLink}</a>
          <p>This link will expire in 15 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        `,
      }
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Password reset link sent to your email." });
    } catch (err) {
      console.error("Forgot password error:", err);
      res.status(500).json({ message: "Server error" });
    }

  }


  static async resetPassword(req, res) {


    try {

      const { token } = req.params;
      const { newPassword, confirmPassword } = req.body;


      if (newPassword !== confirmPassword) {
        return res.status(404).json({ message: "Passwords do not match" });


      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash and update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.json({ success: true, message: "Password reset successful" });
    } catch (err) {
      console.error("Reset password error:", err);
      res.status(400).json({ message: "Invalid or expired token" });
    }
  }


  // static async slugMentor(req,res) {

  //   try {
  //     const mentor = await UserModel.findOne({ slug: req.params.slug, type: "mentor" });
  //     if (!mentor) return res.status(404).json({ message: "Mentor not found" });
  //     res.json(mentor);
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }

  // }

  static async slugMentor(req, res) {
    try {
      const { slug } = req.params; // extract slug properly

      console.log("Fetching mentor with slug:", slug);

      const mentor = await UserModel.findOne({ slug, type: "mentor" });

      if (!mentor) {
        console.log("Mentor not found");
        return res.status(404).json({ message: "Mentor not found" });
      }

      console.log("Mentor found:", mentor.firstName, mentor.lastName);
      res.json(mentor);
    } catch (err) {
      console.error("Slug mentor error:", err);
      res.status(500).json({ message: err.message });
    }
  }




  // 📩 Send OTP to Email
  static async sendOtpEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });

      const user = await UserModel.findOne({ email }).populate("roleID");
      if (!user) return res.status(404).json({ message: "User not found" });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = otp;
      user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
      await user.save();

      const mailOptions = {
        from: `"EJob Ocean" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: "🔐 Your Login OTP",
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      };
      await transporter.sendMail(mailOptions);

      res.json({ success: true, message: "OTP sent to your email" });
    } catch (err) {
      console.error("Send Email OTP error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  // 📲 Send OTP to phone (via Twilio)
  // static async sendOtp(req, res) {
  //   try {
  //     const { phone } = req.body;
  //     if (!phone) return res.status(400).json({ message: "phone number required" });

  //     const user = await UserModel.findOne({ phone: phone }).populate("roleID");
  //     if (!user) return res.status(404).json({ message: "User not found" });

  //     const otp = Math.floor(100000 + Math.random() * 900000).toString();

  //     user.otp = otp;
  //     user.otpExpires = Date.now() + 5 * 60 * 1000;
  //     await user.save();

  //     await client.messages.create({
  //       from: process.env.TWILIO_PHONE_NUMBER,
  //       to: `+91${phone}`, // adjust country code
  //       body: `Your EJob Ocean OTP is ${otp}. It expires in 5 minutes.`,
  //     });

  //     res.json({ success: true, message: "OTP sent to your phone" });
  //   } catch (err) {
  //     console.error("Send phone OTP error:", err);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // }

//  static async sendOtp(req, res) {
//   try {
//     const { phone } = req.body;
//     if (!phone) return res.status(400).json({ message: "Phone number is required" });

//     const user = await UserModel.findOne({ phone }).populate("roleID");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     // Save OTP in DB
//     user.otp = otp;
//     user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins expiry
//     await user.save();

//     // ✅ SMS Text (required parameter)
//     const message = `Dear Admin, your OTP is ${otp}. Do not share it. - Star Agro`;

//     // Prepare POST data (including message)
//     const postData = {
//       authkey: "453039Aehzt6VtnMYS682d82c5P1",
//       mobiles: phone,
//       sender: "NSKFST",
//       route: "4",
//       country: "91",
//       DLT_TE_ID: "1207162399931698582",
//       message, // ✅ this was missing
//     };

//     // Send SMS
//     const { data } = await axios.post(
//       "http://control.bestsms.co.in/api/sendhttp.php",
//       null,
//       { params: postData }
//     );

//     console.log("📨 SMS API Response:", data);

//     if (data.toLowerCase().includes("error")) {
//       return res.status(400).json({ success: false, message: "SMS sending failed", response: data });
//     }

//     res.json({ success: true, message: "OTP sent successfully" });
//   } catch (err) {
//     console.error("Send SMS OTP error:", err.message);
//     res.status(500).json({ message: "Failed to send OTP", error: err.message });
//   }
// }


// 📲 Dummy OTP (No SMS)
static async sendOtp(req, res) {
  try {
    const { phone } = req.body;
    if (!phone)
      return res.status(400).json({ message: "Phone number is required" });

    const user = await UserModel.findOne({ phone }).populate("roleID");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB
    
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    console.log("📌 Dummy OTP:", otp);

    return res.json({
      success: true,
      message: "Dummy OTP generated (no SMS sent)",
      otp, // 👉 remove this in production
    });
  } catch (err) {
    console.error("Dummy OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
}



  // ✅ Verify OTP (works for email or phone)
  // static async verifyOtp(req, res) {
  //   try {
  //     const { email, phone, otp } = req.body;
  //     const query = email ? { email } : { phone: phone };
  //     const user = await UserModel.findOne(query).populate("roleID");

  //     if (!user) return res.status(404).json({ message: "User not found" });
  //     if (!user.otp || user.otp !== otp)
  //       return res.status(400).json({ message: "Invalid OTP" });
  //     if (Date.now() > user.otpExpires)
  //       return res.status(400).json({ message: "OTP expired" });

  //     // clear OTP after use
  //     user.otp = null;
  //     user.otpExpires = null;
  //     await user.save();

  //     const token = generateToken(user._id);
  //     res.json({ success: true, token, user });
  //   } catch (err) {
  //     console.error("Verify OTP error:", err);
  //     res.status(500).json({ message: "Server error" });
  //   }
  // }



  // ✅ Verify OTP for email or phone login
static async verifyOtp(req, res) {
  try {
    const { email, phone, otp } = req.body;

    let user;

    if (email) user = await UserModel.findOne({ email }).populate("roleID");
    if (phone) user = await UserModel.findOne({ phone }).populate("roleID");

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    // Login success
    const token = generateToken(user._id);

    // clear otp after success
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.json({
      success: true,
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}



}

export default AuthController;
