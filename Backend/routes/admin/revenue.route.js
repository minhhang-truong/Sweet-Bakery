const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/admin/revenue.controller");
const { authorize } = require('../../middleware/authorize.middleware');

// SỬA: authorize(3) -> authorize('admin')
router.get("/", verifyToken, authorize('admin'), controller.getRevenueOrders);

router.get("/weekly", verifyToken, authorize('admin'), controller.getWeeklyRevenue);

module.exports = router;