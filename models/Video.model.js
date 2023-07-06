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


});



module.exports = mongoose.model("Video", videoSchema);
