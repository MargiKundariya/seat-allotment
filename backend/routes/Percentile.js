const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  uploadPcmFile,
  uploadGujcetFile,
} = require("../controller/percentileController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Separate APIs
router.post("/upload-pcm", upload.single("file"), uploadPcmFile);
router.post("/upload-gujcet", upload.single("file"), uploadGujcetFile);

module.exports = router;