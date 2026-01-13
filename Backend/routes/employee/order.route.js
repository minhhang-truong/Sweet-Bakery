const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/employee/order.controller");
const { authorize } = require('../../middleware/authorize.middleware');

// SỬA: authorize(2) -> authorize('staff')
router.post("/", verifyToken, authorize('staff'), controller.getAllOrders);

router.post("/detail", verifyToken, authorize('staff'), controller.getOrderDetail);

router.post("/create", verifyToken, authorize('staff'), controller.createOrder);

router.post("/update-status", verifyToken, authorize('staff'), controller.updateOrderStatus);

router.put("/:id/internal-note", verifyToken, authorize('staff'), controller.updateInternalNote);

module.exports = router;