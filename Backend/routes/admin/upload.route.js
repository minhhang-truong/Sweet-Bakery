const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload.middleware");
const controller = require("../../controller/admin/upload.controller");
const verifyToken = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/authorize.middleware");

// SỬA: authorize(3) -> authorize('admin')
router.post("/avatar", verifyToken, authorize('admin'), upload.single("image"), controller.uploadAvatar);

// Lưu ý: Đảm bảo controller upload có hàm uploadProductImage nhé (lúc nãy file bạn gửi chỉ thấy uploadAvatar)
router.post("/product", verifyToken, authorize('admin'), upload.single("image"), controller.uploadProductImage);

module.exports = router;