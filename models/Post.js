import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  post: {
    type: String,
    required: true,
  },
  name: { type: String },
  like: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
});

module.exports = mongoose.model("post", postSchema);
