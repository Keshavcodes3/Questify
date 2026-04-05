import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number, default: 25 }, // in minutes
    completed: { type: Boolean, default: false },
    points: { type: Number, default: 5 }, // earned for completing session
});

const sessionModel=mongoose.model('focus',sessionSchema)