import mongoose from 'mongoose';


const CommentSchema = mongoose.Schema({


    name: { type: String },
    email: { type: String },

    comment: {
        type: String,
        required: true
    },

    // id: { type: Number, required: true },
   
    id: { 
        type: mongoose.Schema.Types.Mixed, 
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
    
    likes: [mongoose.Schema.Types.Mixed],

    type: {
        type: String,
        required: true
    },
    CommentCount: {
        type: Number
    },

    otp: { type: String }, 
    otpVerified: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
})

const CommentModel = mongoose.model('Comment', CommentSchema);
export default CommentModel;
