import CompanyInformationModel from "../models/CompanyInformation.model.js";
import mongoose from 'mongoose';
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";




export default class CompanyInformationController {

  static async CompanyInformationcreate(req, res) {
    try {
      let userId;

      //  Case 1: Agar login user mila (protect middleware se)
      if (req.user?.id) {
        userId = req.user.id;
      }

      //  Case 2: Agar body me user pass kiya gaya hai
      if (req.body.user) {
        userId = req.body.user;
      }

      if (!userId) {
        return res.status(400).json({ success: false, message: "User is required" });
      }

      // ✅ Parse JSON fields (from FormData)
      const company = JSON.parse(req.body.company);
      const hrContact = JSON.parse(req.body.hrContact);

      // ✅ Add logo if uploaded
      if (req.file) {
        company.employerLogo = `/uploads/employerLogo/${req.file.filename}`;
      }

      // ✅ Create company record
      const newCompany = new CompanyInformationModel({
        user: userId,   // 👈 yaha dono handle ho gaya
        company,
        hrContact,
      });

      await newCompany.save();

      // ✅ Link company to User table bhi karna ho to:
      await UserModel.findByIdAndUpdate(userId, { companyId: newCompany._id });

      res.status(201).json({ success: true, data: newCompany });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }


  static async CompanyInformationgetAll(req, res) {
    try {
      const companies = await CompanyInformationModel.find()
        .populate("user", "firstName lastName email");

      res.status(200).json({ success: true, data: companies });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }




  static async CompanyInformationgetById(req, res) {
    try {
      const { id } = req.params;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid company ID format",
        });
      }

      const company = await CompanyInformationModel.findById(id)
        .populate("user", "firstname lastname email");

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      res.status(200).json({ success: true, data: company });
    } catch (err) {
      console.error("GET BY ID ERROR:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }


  static async getCompanyByUserId(req, res) {
    try {
      const userId = req.user.id;

      const company = await CompanyInformationModel.findOne({ user: userId })
        .populate("user", "firstName lastName email");

      if (!company) {
        return res.status(404).json({ success: false, message: "Company not found" });
      }

    

      res.status(200).json({ success: true, data: company });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCompanyByUserId(req, res) {
    try {
      const userId = req.user.id; //  token middleware se ayega

      const company = await CompanyInformationModel.findOne({ user: userId })
        .populate("user", "firstName lastName email")



      if (!company) {

        return res.status(404).json({ success: false, message: "Company not found" });
      }

      res.status(200).json({ success: true, data: company });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }






  static async CompanyInformationupdate(req, res) {
    try {
      let companyData, hrContactData, userId;

      // ✅ Handle form-data (stringify kiya hua)
      if (typeof req.body.company === "string") {
        companyData = JSON.parse(req.body.company);
        hrContactData = JSON.parse(req.body.hrContact);
        userId = req.body.user; // sirf string ID (no JSON.parse)
      } else {
        // ✅ Handle raw JSON body (Postman, API client)
        companyData = req.body.company || {};
        hrContactData = req.body.hrContact || {};
        userId = req.body.user || null;
      }

      const _id = req.params.id || req.user?.companyId;
      if (!_id) {
        return res.status(400).json({ success: false, message: "Missing company ID" });
      }

      // Update data prepare
      const updateData = { company: companyData, hrContact: hrContactData };
      // Get existing company data to preserve logo if not updated
      const existingCompany = await CompanyInformationModel.findById(_id);
      if (!existingCompany) {
        return res.status(404).json({ success: false, message: "Company not found" });
      }

      if (req.file) {
        // New logo uploaded
        updateData.company.employerLogo = `/uploads/employerLogo/${req.file.filename}`;
      } else if (req.body.existingLogo) {
        // Preserve existing logo if no new file uploaded
        updateData.company.employerLogo = req.body.existingLogo;
      } else {
        // Keep the existing logo from database
        updateData.company.employerLogo = existingCompany.company.employerLogo;
      }

      // ✅ Update Company
      const updated = await CompanyInformationModel.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, message: "Company not found" });
      }

      if (userId) {
        let parsedUserData;
        try {

          parsedUserData = typeof req.body.userData === "string"
            ? JSON.parse(req.body.userData)
            : req.body.userData;
        } catch (err) {
          parsedUserData = null;
        }

        if (parsedUserData) {
          const user = await UserModel.findById(userId);
          if (!user) return res.status(404).json({ success: false, message: "User not found" });

          const updateUserData = {
            firstName: parsedUserData.firstName || user.firstName,
            lastName: parsedUserData.lastName || user.lastName,
            email: parsedUserData.email || user.email,
          };

          // ✅ Agar password change karna ho
          if (parsedUserData.currentPassword && parsedUserData.password) {
            const isMatch = await bcrypt.compare(parsedUserData.currentPassword, user.password);
            if (!isMatch) {
              return res.status(400).json({ success: false, message: "Current password incorrect" });
            }

            const passwordRegex =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(parsedUserData.password)) {
              return res.status(400).json({
                success: false,
                message:
                  "Password must be strong (8+ chars, upper, lower, number, special char).",
              });
            }

            const salt = await bcrypt.genSalt(10);
            updateUserData.password = await bcrypt.hash(parsedUserData.password, salt);
          }

          await UserModel.findByIdAndUpdate(
            userId,
            updateUserData,
            { new: true, runValidators: true }
          );
        }
      }


      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error("Update error:", err);
      res.status(400).json({ success: false, message: err.message });
    }
  }





  static async CompanyInformationdelete(req, res) {
    try {
      const deleted = await CompanyInformationModel.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Company not found' });
      res.status(200).json({ success: true, message: 'Company deleted' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }



  static async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const company = await CompanyInformationModel.findById(id);

      if (!company) {
        return res.status(404).json({ success: false, message: "Company not found" });
      }

      company.status = company.status === "active" ? "inactive" : "active";
      await company.save();

      res.status(200).json({ success: true, status: company.status });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }


  static async getCompanyLogoByUserId(req, res) {
    try {
      const userId = req.user.id;
      const company = await CompanyInformationModel.findOne({ user: userId });

      if (!company) {
        return res.status(200).json({ // Change from 404 to 200
          success: true,
          logo: null,
          message: "Company not found for this user"
        });
      }

      const logo = company.company?.employerLogo || null;

      res.status(200).json({
        success: true,
        logo
      });

    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }






}



