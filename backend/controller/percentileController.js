const XLSX = require("xlsx");
const PcmPercentile = require("../models/PCM");
const GujcetPercentile = require("../models/GUJCET");

exports.uploadPcmFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PCM file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const cleanedData = data.map((row) => {
      const normalized = {};

      Object.keys(row).forEach((key) => {
        const newKey = key.toLowerCase().replace(/\s+/g, "");
        normalized[newKey] = row[key];
      });

      return {
  marks: parseFloat(
    normalized["marks"] || 
    normalized["pcm"] || 
    normalized["pcmmarks"]
  ),
  percentile: parseFloat(
    normalized["percentile"] || 
    normalized["percent"]
  ),
};
    }).filter(item => !isNaN(item.marks) && !isNaN(item.percentile));

    await PcmPercentile.deleteMany(); // optional (replace old data)
    await PcmPercentile.insertMany(cleanedData);

    res.status(201).json({
      message: "PCM Percentile uploaded",
      total: cleanedData.length,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadGujcetFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No GUJCET file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const cleanedData = data.map((row) => {
      const normalized = {};

      Object.keys(row).forEach((key) => {
        const newKey = key.toLowerCase().replace(/\s+/g, "");
        normalized[newKey] = row[key];
      });
      return {
  marks: parseFloat(
    normalized["marks"] || 
    normalized["pcm"] || 
    normalized["pcmmarks"]
  ),
  percentile: parseFloat(
    normalized["percentile"] || 
    normalized["percent"]
  ),
}
      
    }).filter(item => !isNaN(item.marks) && !isNaN(item.percentile));

    await GujcetPercentile.deleteMany(); // optional
    await GujcetPercentile.insertMany(cleanedData);

    res.status(201).json({
      message: "GUJCET Percentile uploaded",
      total: cleanedData.length,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};