import SocialMediaIconModel from "./SocialMediaIcon.model.js";


// Get all social media icons
export const getSocialMediaIcons = async (req, res) => {
    try {
        const icons = await SocialMediaIconModel.find();
        res.status(200).json(icons);
    } catch (error) {
        res.status(500).json({ message: "Error fetching social media icons", error });
    }
};

// Create new social media icon
export const createSocialMediaIcons = async (req, res) => {
    try {
        const { name, link, status } = req.body;

        const newIcon = new SocialMediaIconModel({
            name,
            link,
            status,
        });

        await newIcon.save();
        res.status(201).json(newIcon);
    } catch (error) {
        res.status(500).json({ message: "Error creating social media icon", error });
    }
};

// Update social media links
export const updateSocialMediaIcons = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updated = await SocialMediaIconModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) return res.status(404).json({ message: "Social media links not found" });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error updating social media links", error });
    }
};

// Delete social media links
export const deleteSocialMediaIcons = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await SocialMediaIconModel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Social media links not found" });

        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting social media links", error });
    }
};


// Get only active social media icons
export const getActiveSocialMediaIcons = async (req, res) => {
    try {
        const icons = await SocialMediaIconModel.find({ status: "active"});

        res.status(200).json(icons);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching active social media icons",
            error,
        });
    }
};