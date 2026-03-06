const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  resetPassword
} = require("../controller/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/resetPassword", resetPassword);

module.exports = router;