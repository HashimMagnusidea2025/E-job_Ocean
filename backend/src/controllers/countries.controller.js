import CountryModel from "../models/countries.models.js";


// Create a new country
export const createCountry = async (req, res) => {

    try {
        const country = await CountryModel.create(req.body);
        res.status(201).json({ success: true, data: country });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

// Get all Country
export const getAllCountry = async (req, res) => {

    try {

        const country = await CountryModel.find();
        res.status(200).json({ success: true,  country })
       
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}

export const getCountryById = async (req, res) => {
  try {
    const country = await CountryModel.findOne({ id: parseInt(req.params.id) });

    if (!country) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }

    res.status(200).json({ success: true, data: country });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


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