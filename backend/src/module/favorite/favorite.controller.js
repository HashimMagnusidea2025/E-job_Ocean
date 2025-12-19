import FavoriteModel from "./favorite.model.js";

//  Toggle favorite 
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobId, type } = req.body;

    if (!jobId || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID and type are required" });
    }

   
    const existing = await FavoriteModel.findOne({ user: userId, jobId, type });

    if (existing) {
     
      await FavoriteModel.deleteOne({ _id: existing._id });
      return res.status(200).json({
        success: true,
        favorited: false,
        message: "Removed from favorites",
      });
    }

  
    const favorite = await FavoriteModel.create({ user: userId, jobId, type });
    return res.status(201).json({
      success: true,
      favorited: true,
      message: "Added to favorites",
      favorite,
    });
  } catch (err) {
    console.error("toggleFavorite error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//  Get all favorites 
export const getAllFavorites = async (req, res) => {
  try {
    const favorites = await FavoriteModel.find()
      .populate("user")
      .populate({
        path: "jobId",
        populate: {
          path: "companyId",
        
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: favorites });
  } catch (err) {
    console.error("getAllFavorites error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//  Get logged-in user's favorites
export const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const favorites = await FavoriteModel.find({ user: userId })
      .populate("user")
      .populate({
        path: "jobId",
        populate: {
          path: "companyId",
         
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: favorites });
  } catch (err) {
    console.error("getMyFavorites error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//  Delete favorite by ID
export const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await FavoriteModel.findById(id);

    if (!favorite) {
      return res
        .status(404)
        .json({ success: false, message: "Favorite not found" });
    }

    await favorite.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Favorite deleted successfully" });
  } catch (err) {
    console.error("deleteFavorite error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
