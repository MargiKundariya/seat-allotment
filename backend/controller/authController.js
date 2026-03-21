const User = require("../models/User");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ message: "Email config missing" });
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
      from: `"Seat Allotment" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Seat Allotment OTP",
      text: `Your OTP is: ${otp}`,
    });

    console.log("✅ OTP sent to:", email);

    return res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};
