import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  status: {
    type: String,
    required: true,
  },
  interests: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  github: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("profile", profileSchema);
