
import CommentModel from "./comment.model.js";
import { sendOTP } from "../../utils/mailer.js";
import mongoose from 'mongoose';





export const RequestOtp = async (req, res) => {


    try {
        const { name, email, comment, id, type } = req.body;

        if (!name || !email || !comment || !id || !type) {
            return res.status(400).json({ msg: "All fields are required (name, email, comment, id)" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newComment = new CommentModel({
            id: id,
            name,
            email,
            comment,
            otp,
            type
        });

        await newComment.save();
        await sendOTP(email, otp);
        res.status(200).json({
            msg: "OTP sent to your email. Please verify to post comment.",
            commentId: newComment._id
        })
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


export const VerifyOtp = async (req, res) => {

    try {

        const { commentId, otp } = req.body;

        const comment = await CommentModel.findById(commentId);

        if (!comment) return res.status(404).json({ msg: "Comment not found" });

        if (comment.otp !== otp) {
            return res.status(400).json({ msg: "Invalid OTP" })
        };

        comment.otpVerified = true;
        comment.otp = undefined;
        await comment.save();
        res.status(200).json({ msg: "OTP verified, comment posted successfully." });
    } catch (error) {
        res.status(500).json({ msg: err.message });
    }
}



export const PostComment = async (req, res) => {

    try {

        const { comment, id, type } = req.body;

        if (!req.user) return res.status(401).json({ msg: "Login required" });

        const newComment = new CommentModel({
            id: id,
            type,
            user: req.user._id,
            comment,
            otpVerified: true
        });

        await newComment.save();

        //  Get updated count  saving
        const updatedCount = await CommentModel.countDocuments({ id: id, type, otpVerified: true });

        res.status(201).json({
            msg: "Comment posted",
            comment: newComment,
            count: updatedCount,
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}



export const GetCommentsByBlog = async (req, res) => {

    try {
        const { id } = req.params;
        const { type } = req.query;
        console.log("=== GET COMMENTS DEBUG ===");
        console.log("Request params id:", id);
        console.log("Request query type:", type);
        console.log("id type:", typeof id);

           // ✅ Smart ID handling - dono Number aur String support karega
        let queryId;
        
        // Check if the ID is a valid number
        if (!isNaN(id) && id.trim() !== '') {
            queryId = Number(id); // Convert to number for blogs
        } else {
            queryId = id; // Keep as string for jobs
        }

        console.log("Final queryId:", queryId, "Type:", typeof queryId);
   // Database mein check karein kya hai
        const allComments = await CommentModel.find({ type: type }).limit(10);
        
         console.log(`First 10 ${type} comments in DB:`, allComments.map(c => ({ 
            id: c.id, 
            idType: typeof c.id,
            type: c.type 
        })));
        // const blogId = Number(id);
        const comments = await CommentModel.find({
          id: queryId,
            type,
            otpVerified: true
        })
            .populate("user", "name email") // agar user login hai
            .sort({ createdAt: -1 });

        const commentCount = await CommentModel.countDocuments({  id: queryId,  type, otpVerified: true });
       console.log("Found comments for query:", comments.length);
        console.log("Comments details:", comments.map(c => ({ id: c.id, type: c.type, comment: c.comment })));
        //  Add likedByUser flag
        const userId = req.user?._id?.toString();

        res.status(200).json({
            count: commentCount,
            comments: comments.map(c => ({
                ...c.toObject(),
                likesCount: c.likes.length,
                likedByUser: userId ? c.likes.includes(userId) : false
            }))
        });


    } catch (err) {
        res.status(500).json({ msg: err.message });
    }

}


    // export const LikeComment = async (req, res) => {


    //     try {
    //         if (!req.user) return res.status(401).json({ msg: "Login required" });

    //         const { commentId } = req.body;
    //         const comment = await CommentModel.findById(commentId);
    //         if (!comment) return res.status(404).json({ msg: "Comment not found" });

    //         const userId = req.user._id;

    //         // ✅ Sirf ek baar like allow
    //         if (!comment.likes.includes(userId)) {
    //             comment.likes.push(userId);
    //             await comment.save();
    //         }
    //         res.status(200).json({
    //             msg: "Like status updated",
    //             likesCount: comment.likes.length,
    //             likedByUser: comment.likes.includes(userId)
    //         });

    //     } catch (err) {
    //         res.status(500).json({ msg: err.message });
    //     }
    // }

export const LikeComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const comment = await CommentModel.findById(commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    // 🔹 Identify user (login or guest)
    let userIdentifier;
    if (req.user) {
      userIdentifier = req.user._id.toString(); // logged-in user
    } else {
      // Guest user — use IP or random anonymous ID
      userIdentifier = req.ip || "guest_" + Math.random().toString(36).substr(2, 9);
    }

    // 🔹 Agar pehle like nahi kiya hai to like add karo
    if (!comment.likes.includes(userIdentifier)) {
      comment.likes.push(userIdentifier);
      await comment.save();
    } else {
      // ✅ Toggle like — agar already liked, to unlike karo
      comment.likes = comment.likes.filter((id) => id !== userIdentifier);
      await comment.save();
    }

    res.status(200).json({
      msg: "Like status updated",
      likesCount: comment.likes.length,
      likedByUser: comment.likes.includes(userIdentifier),
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};




