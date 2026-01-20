const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const uploadFile = require("../services/storageService");


const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("File type now allowed"));
    }
    cb(null, true);
  },
});
// ab image kit ko initialize krna hai, or is api mai use krna hai.
router.post("/", authMiddleware, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const fileData = await uploadFile(req.file);

    res.status(200).json({
      fileData,
    });
  } catch (error) {
        next(error)
  }
});

module.exports = router;
