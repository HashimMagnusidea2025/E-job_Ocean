
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

        const { comment, id, type, name, email } = req.body;

        if (!comment || !id || !type) {
            return res.status(400).json({ msg: "Comment, id, and type are required" });
        }

        const newComment = new CommentModel({
            id: id,
            type,
            comment,
            otpVerified: true
        });

        if (req.user) {
            // Logged-in user
            newComment.user = req.user._id;
        } else {
            // Anonymous user
            if (!name || !email) {
                return res.status(400).json({ msg: "Name and email are required for anonymous comments" });
            }
            newComment.name = name;
            newComment.email = email;
        }

        await newComment.save();


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

        let queryId;

        if (!isNaN(id) && id.trim() !== '') {
            queryId = Number(id);
        } else {
            queryId = id;
        }

        const allComments = await CommentModel.find({ type: type }).limit(10);

        const comments = await CommentModel.find({
            id: queryId,
            type,
            otpVerified: true
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        const commentCount = await CommentModel.countDocuments({ id: queryId, type, otpVerified: true });

        res.status(200).json({
            count: commentCount,
            comments: comments.map(c => ({
                ...c.toObject(),
                likesCount: c.likes.length,
                likedByUser: false
            }))
        });


    } catch (err) {
        res.status(500).json({ msg: err.message });
    }

}


export const LikeComment = async (req, res) => {
    try {
        const { commentId } = req.body;

        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        let identifier;

        // ✅ Case 1: Logged-in user
        if (req.user) {
            identifier = req.user._id.toString();
        }
        // ✅ Case 2: Guest user (IP based)
        else {
            identifier = req.ip;
        }
      

        // ❌ Already liked → block
        if (comment.likes.includes(identifier)) {
            return res.status(400).json({
                msg: "Already liked",
                likesCount: comment.likes.length,
                likedByUser: true
            });
        }

        // ✅ First time like
        comment.likes.push(identifier);
        await comment.save();

        return res.status(200).json({
            msg: "Liked successfully",
            likesCount: comment.likes.length,
            likedByUser: true
        });

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


