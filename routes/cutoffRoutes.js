const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  addCutoffFile,
  addCutoffManual,
  getAllCutoffs
} = require("../controller/cutoffController");

router.post("/add-cutoff-file", upload.single("file"), addCutoffFile);
router.post("/add-cutoff-manual", addCutoffManual);

router.get("/display", getAllCutoffs);

module.exports = router;