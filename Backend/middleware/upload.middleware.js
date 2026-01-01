const multer = require("multer");

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPG/PNG allowed")); // ✅ RETURN
    }

    cb(null, true);
  },
});

module.exports = upload;