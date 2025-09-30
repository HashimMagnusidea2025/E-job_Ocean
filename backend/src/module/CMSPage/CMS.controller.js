import CMSPageModel from "./CMSPage.model.js";

export default class CMSPageController {
    // Create
    async CreateCMSPage(req, res) {
        try {
            const { name, status } = req.body;

            const existing = await CMSPageModel.findOne({ name });
            if (existing) return res.status(409).json({ message: "CMS-Page already exists" });

            const CMSPage = await CMSPageModel.create({ name, status });
            res.status(201).json(CMSPage);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Get all
    async getCMSPage(req, res) {
        try {
            const CMSPage = await CMSPageModel.find();
            res.json(CMSPage);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Update

    async UpdateCMSPage(req, res) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: "CMS-Page ID is required" });

            const { name, status } = req.body;

            const updated = await CMSPageModel.findByIdAndUpdate(
                id,
                { name, status },
                { new: true }
            );

            if (!updated) return res.status(404).json({ message: "CMS-Page not found" });

            res.status(200).json(updated);
        } catch (err) {
            res.status(500).json({ message: "Server Error" });
        }
    }


    // Delete
    async DeleteCMSPage(req, res) {
        try {
            const { id } = req.params;

            const deleted = await CMSPageModel.findByIdAndDelete(id);

            if (!deleted) {
                return res.status(404).json({ message: "CMS-Page not found" });
            }

            res.status(200).json({ message: "CMS-Page deleted successfully" });
        } catch (error) {
            console.error("Error deleting CMS-Page:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    // Toggle status only
    async ToggleCMSPage(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const updated = await CMSPageModel.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!updated) {
                return res.status(404).json({ message: "CMS-Page not found" });
            }

            res.status(200).json(updated);
        } catch (err) {
            res.status(500).json({ message: "Server Error" });
        }
    }
}
