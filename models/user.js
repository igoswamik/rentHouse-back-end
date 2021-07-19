const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
  url: String,
  filename: String,
});
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: { type: number },
  photo: { ImageSchema },
});

// UserSchema.plugin(passportLocalMongoose); //its gonna add username and password to our schema and will automatically check for username to be unique and will give us some additional methods to useetc.

module.exports = mongoose.model("User", UserSchema);
