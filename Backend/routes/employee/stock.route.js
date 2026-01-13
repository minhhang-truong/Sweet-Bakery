const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/employee/product.controller");
const { authorize } = require('../../middleware/authorize.middleware');

// SỬA: authorize(2) -> authorize('staff')
router.get("/", verifyToken, authorize('staff'), controller.getStock);

module.exports = router;