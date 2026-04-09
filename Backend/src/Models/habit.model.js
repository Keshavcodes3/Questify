import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['positive', 'negative', 'daily'], required: true },
    completed: {
        days: [String],
    }, lastCompletedAt: {
        type: Date
    },
    duration: {
        type: Number,
        default: 0
    },

    streak: { type: Number, default: 0 },
    xpReward: { type: Number, default: 10 },
    coinReward: { type: Number, default: 5 },
}, { timestamps: true });

export default mongoose.model('Habit', habitSchema);