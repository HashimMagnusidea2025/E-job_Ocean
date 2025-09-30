
import LikeModel from "./likes.model.js";

export const LikeCreate = async (req, res) => {
    try {
        const { blogId, type } = req.body;
        const userId = req.user._id;

        // Check if user already liked
        const alreadyLiked = await LikeModel.findOne({ id: blogId, user: userId, type });
        if (alreadyLiked) {
            return res.json({ message: "Already liked" });
        }
        const existingDoc = await LikeModel.findOne({ id: blogId });
        const oldViewCount = existingDoc?.viewCount || 0;

        // Create new like (Count fix = 1)
        await LikeModel.create({
            id: blogId,
            user: userId,
            type,
            viewCount: oldViewCount,
        });

        /// Get updated total likes ///
        const totalCount = await LikeModel.countDocuments({ id: blogId, type });

        res.json({ message: `${type} liked successfully`, viewCount: oldViewCount, totalCount });
    } catch (err) {
        console.error("LikeCreate error:", err);
        res.status(500).json({ message: "Server error" });
    }
};




export const getLikeCount = async (req, res) => {
    try {
        const { id, type } = req.params;

        const totalCount = await LikeModel.countDocuments({ id, type });

        res.json({ blogId: id, type, totalCount });
        console.log("Total Likes:", totalCount);
    } catch (err) {
        console.error("getLikeCount error:", err);
        res.status(500).json({ message: "Server error" });
    }
};





export const incrementView = async (req, res) => {
    try {
        const { blogId } = req.params;

        let blogDoc = await LikeModel.findOne({ id: blogId, });

        if (!blogDoc) {

            blogDoc = await LikeModel.create({
                id: blogId,
                viewCount: 1,
            });
        } else {
            blogDoc.viewCount = (blogDoc.viewCount || 0) + 1;
            await blogDoc.save();
        }

        res.json({ blogId, views: blogDoc.viewCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getViewCount = async (req, res) => {
    try {
        const { blogId } = req.params;

        // blog ka document find karo
        const blogDoc = await LikeModel.findOne({ id: blogId });

        res.json({
            blogId,
            views: blogDoc?.viewCount || 0, // if null/undefined then 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

