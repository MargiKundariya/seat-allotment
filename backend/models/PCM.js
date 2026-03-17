// models/PcmPercentile.js
const mongoose = require("mongoose");

const pcmSchema = new mongoose.Schema({
  marks: Number,
  percentile: Number,
});

module.exports = mongoose.model("PcmPercentile", pcmSchema);