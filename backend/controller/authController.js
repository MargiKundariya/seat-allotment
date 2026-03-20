const User = require("../models/User");
const nodemailer = require("nodemailer");

// ✅ Use environment variables (BEST)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 📌 Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = generateOTP();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
    }

    user.otp = otp;
    user.isVerified = false;
    await user.save();

    await transporter.sendMail({
      from: `"Seat Allotment" <${process.env.EMAIL_USER}>`, // ✅ FIXED
      to: email,
      subject: "Seat Allotment OTP",
      text: `Your 6-digit OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
