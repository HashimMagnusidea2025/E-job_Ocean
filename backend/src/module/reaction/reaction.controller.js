import ReactionModel from './reaction.model.js';

export const addReaction = async (req, res) => {
    try {
        const { blogId, emoji } = req.body;
        const ipAddress = req.ip;

        if (!blogId || !emoji) {
            return res.status(400).json({ msg: "blogId and emoji are required" });
        }

        // Check if reaction already exists for this IP and blog
        let reaction = await ReactionModel.findOne({ blogId, ipAddress });

        if (reaction) {
            // Update the emoji
            reaction.emoji = emoji;
            reaction.updatedAt = new Date();
            await reaction.save();
            return res.status(200).json({ msg: "Reaction updated", reaction });
        } else {
            // Create new reaction
            const newReaction = new ReactionModel({
                blogId,
                emoji,
                ipAddress
            });
            await newReaction.save();
            return res.status(201).json({ msg: "Reaction added", reaction: newReaction });
        }
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: "Reaction already exists" });
        }
        res.status(500).json({ msg: err.message });
    }
};

export const getReactions = async (req, res) => {
    try {
        const { blogId } = req.params;

        let queryBlogId;
        if (!isNaN(blogId) && blogId.trim() !== '') {
            queryBlogId = Number(blogId);
        } else {
            queryBlogId = blogId;
        }

        const reactions = await ReactionModel.find({ blogId: queryBlogId });

        // Group by emoji and count
        const reactionCounts = {};
        reactions.forEach(r => {
            if (reactionCounts[r.emoji]) {
                reactionCounts[r.emoji]++;
            } else {
                reactionCounts[r.emoji] = 1;
            }
        });

        res.status(200).json({ reactions: reactionCounts });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};