import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    xpReward: { type: Number, default: 10 },
    coinReward: { type: Number, default: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);