const mongoose = require("mongoose");

const cutoffSchema = new mongoose.Schema({
  collegeName: String,
  course: String,
  category: String,
  firstRank: Number,
  lastRank: Number,
  quota: String
}, { timestamps: true });

module.exports = mongoose.model("Cutoff", cutoffSchema);