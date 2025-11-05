import mongoose from 'mongoose';


const CommentSchema = mongoose.Schema({


    name: { type: String },
    email: { type: String },

    comment: {
        type: String,
        required: true
    },

    // id: { type: Number, required: true },
     // ✅ Dono type ke IDs handle karne ke liye
    id: { 
        type: mongoose.Schema.Types.Mixed, // ✅ Number ya String dono accept karega
        required: true 
    },

    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job-post"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // ✅ store users who liked this comment
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    type: {
        type: String,
        required: true
    },
    CommentCount: {
        type: Number
    },

    otp: { type: String }, // guest user  OTP
    otpVerified: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
})

const CommentModel = mongoose.model('Comment', CommentSchema);
export default CommentModel;
