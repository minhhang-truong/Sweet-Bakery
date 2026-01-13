const express = require('express');
const router = express.Router();

const controller = require("../../controller/clients/order.controller");
const verifyToken = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/authorize.middleware');

// SỬA: authorize(1) -> authorize('customer')
router.post("/", verifyToken, authorize('customer'), controller.saveOrder);

router.get("/history/:id", verifyToken, authorize('customer'), controller.orderHistory);

router.get("/track/:id", verifyToken, authorize('customer'), controller.trackOrder);

module.exports = router;