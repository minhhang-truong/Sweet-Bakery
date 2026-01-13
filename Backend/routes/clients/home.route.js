const express = require('express');
const router = express.Router();

const controller = require("../../controller/clients/home.controller");
const verifyToken = require('../../middleware/auth.middleware'); // Sửa import middleware
const { authorize } = require('../../middleware/authorize.middleware');

// SỬA: authorize(1) -> authorize('customer')
router.get("/", verifyToken, authorize('customer'), controller.index);

module.exports = router;