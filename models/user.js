const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const UserSchema = new Schema({
  username: { type: String, required: [true, "please provide a username"] },
  email: {
    type: String,
    required: [true, "please provide an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "please add a password"],
    minlength: 6,
    select: false,
  },
  resetpasswordToken: String,
  resetpasswordExpire: Date,
  contact: { type: Number },
  photo: { ImageSchema },
});

UserSchema.pre("save", async function (next) {
  //thanks to mongoose, here we are hashing password before it gets saved
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// UserSchema.plugin(passportLocalMongoose); //its gonna add username and password to our schema and will automatically check for username to be unique and will give us some additional methods to useetc.

module.exports = mongoose.model("User", UserSchema);
