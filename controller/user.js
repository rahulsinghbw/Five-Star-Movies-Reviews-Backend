// const cryptpo = require('crypto');
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const EmailVerificationToken = require("../model/emailVerificationToken");
const PasswordResetToken = require("../model/PasswordResetToken");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");
const { match } = require("assert");
const { send } = require("process");

exports.createUser = async (req, res) => {
  // const name = req.body.name;
  const { name, email, password } = req.body;

  // Below method is used for finding the old users in the database

  const oldUser = await User.findOne({ email });

  if (oldUser) return sendError(res, "This email is already in use!");

  //Creating the new user
  const newUser = new User({ name, email, password });
  await newUser.save();

  // generate 6 digit otp
  let OTP = generateOTP();

  // store OTP inside DB
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  // send that otp to our user

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: newUser.email,
    subject: "Email verification",
    html: `
            <p>Your verification OTP </p>
            <h1>${OTP}</h1>
        `,
  });

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId)) return res.json({ error: "Invalid user!" });
  const user = await User.findById(userId);

  if (!user) return sendError(res, "user not found!", 404);

  if (user.isVerified) return sendError(res, "user is already verified!");

  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) return sendError(res, "token not found!");

  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return sendError(res, "Please submit a valid OTP!");

  user.isVerified = true;
  await user.save();

  // After verify the user we delete the token from inside the DB
  await EmailVerificationToken.findByIdAndDelete(token._id);

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Welcome Email",
    html: "<h1> Welcome to our app and thanks for choosing us </h1>",
  });
  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
      isVerified: user.isVerified,
      role : user.role,
    },
    message: "Your email is verified.",
  });
};

exports.resendEmailVerificationToken = async (req, res) => {
  const { userId } = req.body;
  console.log(userId);

  const user = await User.findById(userId);
  if (!user) return sendError(res, "user not found!");

  if (user.isVerified)
    return sendError(res, "This email id is already verified!");

  const alreadyHasToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (alreadyHasToken)
    return sendError(
      res,
      "Only after one hour you can request for another token!"
    );

  //Again generate 6 digit otp

  let OTP = generateOTP();

  // store OTP inside DB
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();
  // send that otp to our user

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Email verification",
    html: `
            <p>Your verification OTP </p>
            <h1>${OTP}</h1>
        `,
  });
  res.json({
    message: "New OTP has been sent to your registered email acoount!",
  });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return sendError(res, "email is missing!");

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "user not found!", 404);

  const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
  if (alreadyHasToken)
    return sendError(
      res,
      "Only after one hour you can request for another token!"
    );

  const token = await generateRandomByte();
  const newPasswordResetToken = await PasswordResetToken({
    owner: user._id,
    token,
  });
  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Reset Password Link",
    html: `
        <p>Click here to reset password</p>
        <a href='${resetPasswordUrl}'>Change Password</a>
    `,
  });

  res.json({ message: "Link is sent to your email!" });
};

exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);

  // Here we matching the new password from old one
  const matched = await user.comparePassword(newPassword);
  if (matched)
    return sendError(
      res,
      "The new password must be different from the old one!"
    );

  user.password = newPassword;
  await user.save();

  await PasswordResetToken.findByIdAndDelete(req.resetToken._id);

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Password Reset Successfully",
    html: `
        <p>Password Reset Successfully</p>
        <a >Now you can use new password.</a>
    `,
  });

  res.json("Password reset successfully, now you can use new password.");
};

exports.signIn = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "Email/Password mismatch!");

  const matched = await user.comparePassword(password);
  if (!matched) return sendError(res, "Email/Password mismatch!");

  const { _id, name, role, isVerified } = user;

  const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);

  res.json({
    user: { id: _id, name, email, role, token: jwtToken, isVerified },
  });
};
