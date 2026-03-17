// models/GujcetPercentile.js
const mongoose = require("mongoose");

const gujcetSchema = new mongoose.Schema({
  marks: Number,
  percentile: Number,
});

module.exports = mongoose.model("GujcetPercentile", gujcetSchema);