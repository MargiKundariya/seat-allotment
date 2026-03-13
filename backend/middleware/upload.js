const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel"
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PDF or Excel files allowed"), false);
    }

    cb(null, true);
  }
});

module.exports = upload;