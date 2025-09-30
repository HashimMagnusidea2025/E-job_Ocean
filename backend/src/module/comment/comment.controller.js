
import CommentModel from "./comment.model.js";
import { sendOTP } from "../../utils/mailer.js";


export const RequestOtp = async (req, res) => {


    try {
        const { name, email, comment, id, type } = req.body;

        if (!name || !email || !comment || !id || !type) {
            return res.status(400).json({ msg: "All fields are required (name, email, comment, id)" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newComment = new CommentModel({
            id,
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
            id: Number(id), // <- ---  store blogId
            type,
            user: req.user._id,
            comment,
            otpVerified: true
        });

        await newComment.save();

        //  Get updated count  saving
        const updatedCount = await CommentModel.countDocuments({ id: Number(id), type, otpVerified: true });

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

        const blogId = Number(id);
        const comments = await CommentModel.find({
            id: blogId,
            type,
            otpVerified: true
        })
            .populate("user", "name email") // agar user login hai
            .sort({ createdAt: -1 });

        const commentCount = await CommentModel.countDocuments({ id: blogId, type, otpVerified: true });

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


export const LikeComment = async (req, res) => {


    try {
        if (!req.user) return res.status(401).json({ msg: "Login required" });

        const { commentId } = req.body;
        const comment = await CommentModel.findById(commentId);
        if (!comment) return res.status(404).json({ msg: "Comment not found" });

        const userId = req.user._id;

        // ✅ Sirf ek baar like allow
        if (!comment.likes.includes(userId)) {
            comment.likes.push(userId);
            await comment.save();
        }
        res.status(200).json({
            msg: "Like status updated",
            likesCount: comment.likes.length,
            likedByUser: comment.likes.includes(userId)
        });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}


