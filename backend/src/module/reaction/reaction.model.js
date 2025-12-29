import mongoose from 'mongoose';

const ReactionSchema = mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    emoji: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Ensure one reaction per IP per blog
ReactionSchema.index({ blogId: 1, ipAddress: 1 }, { unique: true });

const ReactionModel = mongoose.model('Reaction', ReactionSchema);
export default ReactionModel;