const Cutoff = require("../models/Cutoff");

exports.searchByRank = async (req, res) => {
  try {
    const {
      physics,
      chemistry,
      maths,
      gujcetMarks,
      category,
      collegeName,
      course
    } = req.body;

    let estimatedRank = null;
    let pcmPercent = null;
    let gujcetPercent = null;
    let finalMerit = null;

    // ✅ If marks are provided → calculate rank
    if (physics && chemistry && maths && gujcetMarks) {

      const phy = Number(physics);
      const chem = Number(chemistry);
      const math = Number(maths);
      const guj = Number(gujcetMarks);

      if (isNaN(phy) || isNaN(chem) || isNaN(math) || isNaN(guj)) {
        return res.status(400).json({
          message: "Invalid marks entered"
        });
      }

      const pcmTotal = phy + chem + math;

      if (pcmTotal > 300 || guj > 120) {
        return res.status(400).json({
          message: "Marks exceed maximum limit"
        });
      }

      pcmPercent = (pcmTotal / 300) * 100;
      gujcetPercent = (guj / 120) * 100;

      finalMerit = (pcmPercent * 0.5) + (gujcetPercent * 0.5);
      finalMerit = Math.min(100, Math.max(0, finalMerit));

      const N = 110395;

      estimatedRank = Math.max(
        1,
        Math.round(N - (finalMerit * N / 100))
      );
    }

    // ✅ Build filter dynamically
    const filter = {};

    // If rank exists → filter by rank range
    if (estimatedRank !== null) {
      filter.firstRank = { $lte: estimatedRank };
      filter.lastRank = { $gte: estimatedRank };
    }

    if (category) filter.category = category;
    if (collegeName) filter.collegeName = collegeName;
    if (course) filter.course = course;

    const colleges = await Cutoff.find(filter);

    res.json({
      success: true,
      pcmPercent,
      gujcetPercent,
      finalMerit,
      estimatedRank,
      count: colleges.length,
      data: colleges
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};