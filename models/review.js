const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  title: String,
  body: String,
  rate: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
