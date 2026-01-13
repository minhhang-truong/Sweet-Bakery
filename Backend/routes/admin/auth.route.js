const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/admin/auth.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.post("/signin", controller.signin);

router.post("/logout", controller.logout);

// SỬA: authorize(3) -> authorize('admin')
router.get("/profile/:id", verifyToken, authorize('admin'), controller.getProfile);

router.put("/profile/:id", verifyToken, authorize('admin'), controller.updateProfile);

router.put("/change-password/:id", verifyToken, authorize('admin'), controller.changePassword);

module.exports = router;