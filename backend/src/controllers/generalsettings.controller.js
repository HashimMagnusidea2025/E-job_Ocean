
import generalSettingModel from "../models/generalsettings.model.js";

export const getGeneralSettings = async (req, res) => {

    try {
        const setting = await generalSettingModel.findOne();
        res.json(setting)
       


    } catch (error) {
        res.status(500).json({ message: "Failed to fetch settings", error });
    }
}

export const updateGeneralSettings = async (req, res) => {

    try {
        const data = req.body;

        if (req.files) {
            if (req.files.logo) {
                data.logo = `/uploads/${req.files.logo[0].filename}`;
            }
            if (req.files.faviconIcon) {

                data.faviconIcon = `/uploads/${req.files.faviconIcon[0].filename}`;
            }
        }

        const updatedSettings = await generalSettingModel.findOneAndUpdate({}, data, {

            new: true,
            upsert: true
        });

        res.status(200).json(updatedSettings)

    } catch (error) {

        res.status(500).json({ message: "Failed to update settings", error });
    }

}