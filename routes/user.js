// Routers are Post, Get, delete, put
const express = require("express");

const {
  userValidator,
  validate,
  validatePassword,
  signInValidator,
} = require("../middleware/validator");
const { isValidPassResetToken } = require("../middleware/user");
const {
  createUser,
  signIn,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
} = require("../controller/user");
const { sendError } = require("../utils/helper");
const { isAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/sign-in", signInValidator, validate, signIn);
router.post("/create", userValidator, validate, createUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);

router.post(
  "/verify-pass-reset-token",
  isValidPassResetToken,
  sendResetPasswordTokenStatus
);

router.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPassResetToken,
  resetPassword
);

// router.post('/verify-pass-reset-token',isValidPassResetToken,(req,res) => {
//         // req.resetToken; // we can use like that if we want
//         res.json({valid: true});
// });

router.get("/is-auth", isAuth, (req, res) => {
  const { user } = req;

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    },
  });
});

module.exports = router;
