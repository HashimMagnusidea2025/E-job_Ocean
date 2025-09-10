import LocationModel from "../models/location.model.js";



export const createLocation = async (req, res) => {

    try {
        const location = await LocationModel.create(req.body);
        res.status(201).json({ success: true, data: location });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


// Get all locations
export const getAllLocation = async (req, res) => {

    try {

        const location= await LocationModel.find();
        res.status(200).json({ success: true,  location })
        
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}



// getLocationById //

export const getLocationById = async (req, res) => {
  try {
    const location = await LocationModel.findOne({ id: parseInt(req.params.id) });

    if (!location) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }

    res.status(200).json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// update location //
export const updateLocation = async (req, res) => {
    try {
        const location = await LocationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!location) return res.status(404).json({ success: false, massege: "Country not found" })

        res.status(200).json({ success: true, data:location });

        console.log(location);
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
};


// delete Location //
export const deteleLocation = async (req, res) => {
    
    const location = await LocationModel.findByIdAndDelete(req.params.id);
    try {
        if (!location) return res.status(404).json({ success: false, message: "Country not found" });
        res.status(200).json({ success: true, message: "Country deleted" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}