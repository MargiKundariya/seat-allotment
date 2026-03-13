const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    default: "student"
  },

  otp: String,
  isVerified: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);