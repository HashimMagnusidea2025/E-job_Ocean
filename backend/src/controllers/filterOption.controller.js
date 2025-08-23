// controllers/filterOption.controller.js
import FilterOption from "../models/filterOption.model.js";

export const insertDefaultFilterOptions = async (req, res) => {
    try {
        // Optional: clear previous values
        // await FilterOption.deleteMany({});

        const options = [
            { name: "Qualification" },
            { name: "Experience" },
            { name: "Profile" },
           
        ];

        const inserted = await FilterOption.insertMany(options);
        res.json({ message: "Options inserted successfully", data: inserted });
    } catch (err) {
        res.status(500).json({ message: "Failed to insert", error: err.message });
    }
};


export const getAllFilterOptions = async (req, res) => {

    try {
        const filterOption = await FilterOption.find();
        res.status(200).json({ data: filterOption })

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch filter options", error: error.message });
    }
}
