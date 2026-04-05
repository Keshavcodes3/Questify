import mongoose from "mongoose";
const leaderboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalXP: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
});

const LeaderBoardModel = mongoose.model('Leaderboard', leaderboardSchema);
export default LeaderBoardModel

