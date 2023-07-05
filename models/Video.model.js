/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    // unique: true,
  },
  videoId: {
    type: String,
    required: true,
    // unique: true,
  },
  thumbnail: {
    type: String,
    required: true,
    // unique: true,
  },

  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  //   //unique: true,
  // },
});

// videoSchema.index({ userId: 1, videoId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Video", videoSchema);
