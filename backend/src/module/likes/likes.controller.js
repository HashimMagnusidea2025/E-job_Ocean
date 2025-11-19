
import LikeModel from "./likes.model.js";

export const LikeCreate = async (req, res) => {
    try {
        const { id, type } = req.body;
        const userId = req.user._id;

        // Check if user already liked
        const alreadyLiked = await LikeModel.findOne({ id: id, user: userId, type });
        if (alreadyLiked) {
            return res.json({ message: "Already liked" });
        }
        const existingDoc = await LikeModel.findOne({ id: id });
        const oldViewCount = existingDoc?.viewCount || 0;

        // Create new like (Count fix = 1)
        await LikeModel.create({
            id: id,
            user: userId,
            type,
            viewCount: oldViewCount,
        });

        /// Get updated total likes ///
        const totalCount = await LikeModel.countDocuments({ id: id, type });

        res.json({ message: `${type} liked successfully`, viewCount: oldViewCount, totalCount });
    } catch (err) {
        console.error("LikeCreate error:", err);
        res.status(500).json({ message: "Server error" });
    }
};




export const getLikeCount = async (req, res) => {
    try {
        const { id, type } = req.params;
        console.log("Fetching like count for:", { id, type }); // Debugging
        const totalCount = await LikeModel.countDocuments({ id: id, type });
        console.log("Total Likes found:", totalCount); // Debugging
        res.json({ id: id, type, totalCount });
        console.log("Total Likes:", totalCount);
    } catch (err) {
        console.error("getLikeCount error:", err);
        res.status(500).json({ message: "Server error" });
    }
};





export const incrementView = async (req, res) => {
    try {
        const { id } = req.params;
        // const { blogId } = req.params;
        const { type = "blogs" } = req.query;
        console.log("Incrementing view for:", { id, type });

        let blogDoc = await LikeModel.findOne({ id: id });

        if (!blogDoc) {

            blogDoc = await LikeModel.create({
                id: id,
                viewCount: 1,
                type: type
            });
        } else {
            blogDoc.viewCount = (blogDoc.viewCount || 0) + 1;
            await blogDoc.save();
        }

        res.json({ id, views: blogDoc.viewCount });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getViewCount = async (req, res) => {
    try {
        // const { blogId } = req.params;
        const { id } = req.params;
        const { type = "blogs" } = req.query; 

           console.log("Getting view count for:", { id, type });
        // blog ka document find karo
        const blogDoc = await LikeModel.findOne({  id: id });

        res.json({
            id,
            views: blogDoc?.viewCount || 0, // if null/undefined then 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

