const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  //Here we need owner parentMovie rating content
  // store the information about the user.

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parentMovie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  content: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Review", reviewSchema);
