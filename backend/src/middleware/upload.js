const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const PDF_MIME_TYPE = "application/pdf";
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.pdf`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_SIZE },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (file.mimetype === PDF_MIME_TYPE && ext === ".pdf") {
      return cb(null, true);
    }
    return cb(new Error("Only PDF files up to 5MB are allowed"));
  },
});

const handleUploadError = (err, req, res, next) => {
  if (!err) return next();

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Resume file must be 5MB or smaller"
        : "Invalid file upload";
    return res.status(400).json({ message });
  }

  return res.status(400).json({
    message: err.message || "Only PDF files up to 5MB are allowed",
  });
};

upload.handleUploadError = handleUploadError;
upload.uploadDir = uploadDir;
upload.MAX_UPLOAD_SIZE = MAX_UPLOAD_SIZE;

module.exports = upload;
