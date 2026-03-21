const User = require("../models/User");
const nodemailer = require("nodemailer");
// ✅ Check ENV (prevents crash)
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Email credentials missing in ENV");
}
// ✅ Create transporter
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
// 📌 SEND OTP FUNCTION
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    // ❌ If email missing
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }
    // ✅ Generate OTP
    const otp = generateOTP();
    // ✅ Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }
    user.otp = otp;
    user.isVerified = false;
    await user.save();
    // 
    await transporter.sendMail({
      from: `"Seat Allotment" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Seat Allotment OTP",
      text: `Your OTP is: ${otp}`,
    });
    console.log("✅ OTP sent to:", email);
    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};
