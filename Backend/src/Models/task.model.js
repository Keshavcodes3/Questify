import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    xpReward: { type: Number, default: 10,select:false },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    coinReward: { type: Number, default: 5,select:false },
}, { timestamps: true });

const taskModel= mongoose.model('Task', taskSchema);

export default taskModel
