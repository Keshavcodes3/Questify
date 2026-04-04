import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    completed: { type: Map, of: Boolean, default: {} }, 
    reward: {
        xp: Number,
        coins: Number,
        badge: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);