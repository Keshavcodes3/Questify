import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String }, // URL or icon name
  xpReward: { type: Number, default: 0 }, // extra XP when unlocked
});


const badgeModel=new mongoose.Schema("badge",badgeSchema)

export default badgeModel