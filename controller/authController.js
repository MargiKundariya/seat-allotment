const User = require("../models/User");
const nodemailer = require("nodemailer");

// 🔹 Put your gmail directly here
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "projecttiral7@gmail.com",
    pass: "baoqbubioszqrpjj"
  },
});


// ✅ Generate 6 Digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// 📌 Send OTP
exports.sendOtp = async (req, res) => {
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
    from: "yourgmail@gmail.com",
    to: email,
    subject: "Seat Allotment OTP",
    text: `Your 6-digit OTP is: ${otp}`
  });

  res.json({ message: "OTP sent successfully" });
};



// 📌 Verify OTP (No Expiry)
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isVerified = true;
  user.otp = null;

  await user.save();

  res.json({ message: "OTP verified successfully" });
};


// 📌 Register
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.isVerified) {
    return res.status(400).json({ message: "Verify OTP first" });
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.password = password;

  // 🔥 Role automatically set to student
  user.role = "student";

  await user.save();

  res.json({
    message: "Registration successful",
    role: user.role
  });
};



// 📌 Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ 
        message: "User not found, please register" 
      });
    }

    // ✅ Check role
    if (user.role !== role) {
      return res.status(400).json({
        message: "Invalid credtinals"
      });
    }

    // ⚠️ If using plain password (not recommended)
    if (user.password !== password) {
      return res.status(400).json({ 
        message: "Invalid credtinals" 
      });
    }

    // ✅ Send user data back
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔐 Check if OTP was verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify OTP first",
      });
    }

    // ✅ Update password
    user.password = newPassword;

    // Reset verification status
    user.isVerified = false;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};