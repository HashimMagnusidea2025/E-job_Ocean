import CompanyInformationModel from "../models/CompanyInformation.model.js";
import mongoose from 'mongoose';
export default class CompanyInformationController {
  static async CompanyInformationcreate(req, res) {
    try {
      const newCompany = new CompanyInformationModel(req.body);
      await newCompany.save();
      res.status(201).json({ success: true, data: newCompany });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async CompanyInformationgetAll(req, res) {
    try {
      const companies = await CompanyInformationModel.findOne();
      res.status(200).json({success: true, data: companies});
      console.log(companies);
      
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  static async CompanyInformationgetById(req, res) {
  try {
        const { id } = req.params;

        // Validate the ID format
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid company ID format'
            });
        }

        const company = await CompanyInformationModel.findById(id);
        console.log(company);
        
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        res.status(200).json({ success: true, data: company });
    
  } catch (err) {
    console.error("GET BY ID ERROR:", err); // log full error
    res.status(500).json({ success: false, message: err.message });
  }
}

static async CompanyInformationupdate(req, res) {
  try {
    console.log('Request body:', req.body); // Debug what's received

    // Handle both JSON and FormData cases
    let companyData, hrContactData;
    
    if (typeof req.body.company === 'string') {
      // FormData case (parsed strings)
      companyData = JSON.parse(req.body.company);
      hrContactData = JSON.parse(req.body.hrContact);
    } else {
      // Direct JSON case
      companyData = req.body.company || {};
      hrContactData = req.body.hrContact || {};
    }

    // Get _id from either top level or company object
    const _id = req.body._id || companyData._id;
    
    if (!_id) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing company ID (_id)" 
      });
    }

    const updateData = {
      company: companyData,
      hrContact: hrContactData
    };

    // Handle file upload if present
    if (req.file) {
      updateData.company.employerLogo = `/uploads/employerLogo/${req.file.filename}`;
    }

    const updated = await CompanyInformationModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: "Company not found" 
      });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
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
}
