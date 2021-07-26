const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const HousepostSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      //   required: true,
    },
    coordinates: {
      type: [Number],
      //   required: true,
    },
  },
  price: Number,
  description: String,
  city: String,
  configuration: String,
  zip: Number,
  facing: String,
  duration: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Housepost", HousepostSchema);
