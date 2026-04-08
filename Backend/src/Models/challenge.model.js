import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        progress: {
            type: Number,
            default: 0,
        },
        joinedAt: {
            type: Date,
            default: Date.now(),
        },
        rank: {
            type: Number,
            default: 0,
        }
    }],
    completed: { type: Map, of: Boolean, default: {} },
    reward: {
        xp: Number,
        coins: Number,
    },
    ChallengesCount: {
        type: Number,
        default: 0,
        select: false
    },

}, { timestamps: true });


const challengeModel = mongoose.model('Challenge', challengeSchema);

export default challengeModel

