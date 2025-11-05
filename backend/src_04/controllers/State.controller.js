import Statemodel from "../models/State.model.js";


// Create a new State
export const createState = async (req, res) => {

    try {
        const state = await Statemodel.create(req.body);
        res.status(201).json({ success: true, data: state });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Get all State

export const getAllState = async (req, res) => {
    try {
        const state = await Statemodel.find();
        res.status(200).json({ success: true,  state })
       
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}


export const getStatesByCountryId = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Convert to number since country_id is Number in schema
    const countryId = parseInt(id);
    
    const states = await Statemodel.find({ country_id: countryId });
    
    if (!states || states.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No states found for this country" 
      });
    }
    
    res.status(200).json({ success: true, data: states });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStateById = async (req, res) => {
  try {
    const state = await Statemodel.findOne({ id: parseInt(req.params.id) });
    if (!state) {
      return res.status(404).json({ success: false, message: "State not found" });
    }
    res.status(200).json({ success: true, data: state });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// export const getStateById = async (req, res) => {
//   try {
//     const stateId = parseInt(req.params.id); // "4008" => 4008 (number)
//     const state = await Statemodel.findOne({ id: stateId });

//     if (!state) {
//       return res.status(404).json({ success: false, message: "State not found" });
//     }

//     res.status(200).json({ success: true, data: state });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// export const getStatesByCountryId = async (req, res) => {
//   try {
//     const states = await Statemodel.find({ country_id: parseInt(req.params.id) });

//     if (!states || states.length === 0) {
//       return res.status(404).json({ success: false, message: "No states found for this country" });
//     }

//     res.status(200).json({ success: true, data: states });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// export const updateCountry = async (req, res) => {
//     try {
//         const country = CountryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!country) return res.status(404).json({ success: false, massege: "Country not found" })

//         res.status(200).json({ success: true, data, country });

//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message })
//     }
// };


// export const deteleConutry = async (req, res) => {
    
//     const conuntry = await CountryModel.findByIdAndDelete(req.params.id);
//     try {

//         if (!conuntry) return res.status(404).json({ success: false, message: "Country not found" });

//         res.status(200).json({ success: true, message: "Country deleted" });

//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }

// }