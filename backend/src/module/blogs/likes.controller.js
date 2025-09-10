
import LikeModel from "./likes.model.js";

export const LikeCreate = async (req, res) => {
    try {
        const { blogId, type } = req.body;
        const userId = req.user._id;


        const alreadyLiked = await LikeModel.findOne({ id: blogId, user: userId, type });
        if (alreadyLiked) {
            return res.json({ message: `Already liked`, Count: alreadyLiked.Count, viewCount: alreadyLiked.viewCount || 0 });
        }


        const lastLike = await LikeModel.findOne({ id: blogId, type }).sort({ Count: -1 });
        const newCount = lastLike ? lastLike.Count + 1 : 1;

        // Get existing doc for viewCount
        const existingDoc = await LikeModel.findOne({ id: blogId });
        const oldViewCount = existingDoc?.viewCount || 0;

        const like = await LikeModel.create({
            id: blogId,
            user: userId,
            type,
            Count: newCount,
            viewCount: oldViewCount, // carry forward
        });

        res.json({ message: `${type} liked successfully`, Count: newCount, viewCount: oldViewCount,  like });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getLikeCount = async (req, res) => {

    try {
        const { id, type } = req.params;

        const likes = await LikeModel.find({ id: id, type });
        const totalCount = likes.reduce((acc, curr) => acc + curr.Count, 0);
        res.json({ blogId: id, type, totalCount });


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}






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
      views: blogDoc?.viewCount || 0, // agar null/undefined hai to 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

