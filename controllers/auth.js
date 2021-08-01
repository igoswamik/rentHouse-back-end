const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
// Register user
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await new User({
      username,
      email,
      password,
    });
    res.status(200).json({ success: true, user: user });
    // sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    // Check that user exists by email
    const user = await User.findOne({ email }).select("+password"); //it will return a user with given email along with its password

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check that password match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    return res.status(200).json({ success: true, token: "akjkjakjskas" });
    // sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.forgotpassword = async (req, res, next) => {
  res.send("forgotpassword route");
};

exports.resetpassword = async (req, res, next) => {
  res.send("resetpassword route");
};
