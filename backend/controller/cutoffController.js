const XLSX = require("xlsx");
const Cutoff = require("../models/Cutoff");

// Normalize header
const normalizeHeader = (header) =>
  header.toString().trim().replace(/\s+/g, "").toLowerCase();

exports.addCutoffFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert sheet to JSON
    const rawData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (!rawData.length) {
      return res.status(400).json({ message: "Excel file is empty" });
    }

 const cleanedData = rawData
  .map((row, index) => {
    const normalizedRow = {};

    Object.keys(row).forEach((key) => {
      const newKey = key.toString().trim().replace(/\s+/g, "").toLowerCase();
      normalizedRow[newKey] = row[key];
    });

    // 🔥 Support both "course" and "coursename"
    const collegeName = normalizedRow["collegename"]?.toString().trim();
    const course =
      normalizedRow["course"]?.toString().trim() ||
      normalizedRow["coursename"]?.toString().trim();

    const category = normalizedRow["category"]?.toString().trim();
    const quota = normalizedRow["quota"]?.toString().trim();

    const firstRank = parseFloat(
      normalizedRow["firstrank"]?.toString().replace(/,/g, "")
    );

    const lastRank = parseFloat(
      normalizedRow["lastrank"]?.toString().replace(/,/g, "")
    );

    return {
      collegeName,
      course,
      category,
      quota,
      firstRank,
      lastRank,
    };
  })
  .filter(
    (item) =>
      item.collegeName &&
      item.course &&
      !isNaN(item.firstRank) &&
      !isNaN(item.lastRank)
  );

    if (!cleanedData.length) {
      return res.status(400).json({
        message: "No valid data found in Excel file",
      });
    }

    await Cutoff.insertMany(cleanedData);

    return res.status(201).json({
      message: "File uploaded successfully",
      totalInserted: cleanedData.length,
    });
  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      message: error.message || "Server error",
    });
  }
};
exports.addCutoffManual = async (req, res) => {
  try {
    const { collegeName, course, category, firstRank, lastRank, quota } = req.body;

    if (!collegeName && !course && !firstRank && !lastRank) {
      return res.status(400).json({
        message: "Please enter details",
      });
    }

    await Cutoff.create({
      collegeName,
      course,
      category,
      firstRank,
      lastRank,
      quota,
    });

    res.status(201).json({ message: "Manual cutoff added" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get All Cutoffs
exports.getAllCutoffs = async (req, res) => {
  try {
    const { collegeName, course, category, quota } = req.query;

    const filter = {};

    if (collegeName) {
      filter.collegeName = new RegExp(collegeName, "i");
    }

    if (course) {
      filter.course = new RegExp(course, "i");
    }

    if (category) {
      filter.category = category;
    }

    if (quota) {
      filter.quota = quota;
    }

    const cutoffs = await Cutoff.find(filter).sort({ collegeName: 1 });

    res.status(200).json({
      success: true,
      count: cutoffs.length,
      data: cutoffs,
    });

  } catch (error) {
    console.error("Fetch Cutoff Error:", error);
    res.status(500).json({
      message: "Server error while fetching cutoffs",
    });
  }
};