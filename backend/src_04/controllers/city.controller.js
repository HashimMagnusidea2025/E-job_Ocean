import City from "../models/city.model.js";

// Get all cities
export const getAllCities = async (req, res) => {
    try {
        const cities = await City.find();
        res.status(200).json({ success: true, data: cities });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get city by ID (custom id field, not _id)
// export const getCityById = async (req, res) => {
//     try {
//         const city = await City.findOne({ id: parseInt(req.params.id) });
//         if (!city) {
//             return res.status(404).json({ success: false, message: "City not found" });
//         }
//         res.status(200).json({ success: true, data: city });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// Create a new city
export const createCity = async (req, res) => {
    try {
        const city = new City(req.body);
        await city.save();
        res.status(201).json({ success: true, data: city });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update city by id
export const updateCity = async (req, res) => {
    try {
        const city = await City.findOneAndUpdate(
            { id: parseInt(req.params.id) },
            req.body,
            { new: true }
        );
        if (!city) {
            return res.status(404).json({ success: false, message: "City not found" });
        }
        res.status(200).json({ success: true, data: city });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete city by id
export const deleteCity = async (req, res) => {
    try {
        const city = await City.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!city) {
            return res.status(404).json({ success: false, message: "City not found" });
        }
        res.status(200).json({ success: true, message: "City deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCityById = async (req, res) => {
  try {
    const city = await City.findOne({ id: req.params.id }); // String ID
    if (!city) {
      return res.status(404).json({ success: false, message: "City not found" });
    }
    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCitiesByState = async (req, res) => {
  try {
    const { stateId } = req.params;
    
    // Since state_id in City schema is String, no conversion needed
    const cities = await City.find({ state_id: stateId });
    
    if (!cities || cities.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No cities found for this state" 
      });
    }
    
    res.status(200).json({ success: true, data: cities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// export const getCitiesByState = async (req, res) => {
//     try {
//         const { stateId } = req.params;
//         const cities = await City.find({ state_id: stateId });

//         // 👈 match string with string
//         res.status(200).json({ success: true, data: cities });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// };
