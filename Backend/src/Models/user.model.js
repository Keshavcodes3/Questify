import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  level: {
    type: Number,
    default: 1
  },
  challenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  badges: {
    type: String,
    default: "",
    select: false

  },
  streak:{
    type:String,
    default:"0",
    select:false
  },
  xp: {
    type: Number,
    default: 0,
    select: false

  },
  lastActiveDay:{
    type:Date,
    default:Date.now().toString()
  },
  coins: {
    type: Number,
    default: 0,
    select: false

  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);