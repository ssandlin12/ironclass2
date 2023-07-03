const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, "Password is required."],
  },
  //   courses: {
  //     enrolled: [
  //       {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "Course",
  //       },
  //     ],
  //     taught: [
  //       {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "Course",
  //       },
  //     ],
  //   },
  //   createdDate: {
  //     type: Date,
  //     default: Date.now,
  //   },
  // },
  // {
  //   timestamps: true,
  // }
});

module.exports = mongoose.model("User", userSchema);
