import PostOfficeModel from "./PostOffice.model.js";

// Get all post offices
export const getAllPostOffices = async (req, res) => {
  try {
    const offices = await PostOfficeModel.find();
    res.status(200).json(offices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};


// Get by pincode
export const getByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    const offices = await PostOfficeModel.find({ pincode });
    res.status(200).json(offices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
};


// Search by office name
export const searchByName = async (req, res) => {
  try {
    const { name } = req.query;
    const offices = await PostOfficeModel.find({
      officename: { $regex: name, $options: "i" }
    });
    res.status(200).json(offices);
  } catch (error) {
    res.status(500).json({ message: "Error searching offices", error });
  }
};


export const getDetailsByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    const office = await PostOfficeModel.findOne({ pincode });

    if (!office) {
      return res.status(404).json({ message: "Pincode not found" });
    }

    res.status(200).json({
      country: office.statename || "India",  // static if dataset is only for India
      state: office.statename,
      district: office.Districtname,
      taluk: office.Taluk,
      city: office.officename,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pincode details", error });
  }
};