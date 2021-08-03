const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// Register user
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await new User({
      username,
      email,
      password,
    });
    user.save();
    // res.status(200).json({ success: true, token: "3rfefwer23r3dwe" });
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Login User
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

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

//send email to reset password
exports.forgotpassword = async (req, res, next) => {
  // res.send("forgotpassword route");
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Email could not be sent", 404));
    }
    const resetToken = user.getResetPasswordToken(); //will created a reset token using method defined in User model
    await user.save(); // then save the newly created field.

    // Create reset url to email to provided email
    const resetUrl = `http://localhost:3000//passwordreset/${resetToken}`; //here this local host part is refering to our frontend we cam save front end Url in .env and use here

    // HTML Message
    const message = `
    <h1>You have requested a password reset</h1>
    <p>Please make a put request to the following link:</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "rentHouse password reset request",
        text: message,
      });

      return res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {
      user.resetpasswordToken = undefined;
      user.resetpasswordExpire = undefined;
      await user.save();
      return next(new ErrorResponse("Email could not be sent", 404));
    }
  } catch (error) {
    next(error);
  }
};

exports.resetpassword = async (req, res, next) => {
  const resetpasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetpasswordToken,
      resetpasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save();

    return res.status(201).json({
      success: true,
      data: "password reset success",
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ success: true, token, id: user._id });
};
