const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/admin/employee.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.get("/", verifyToken, authorize(3), controller.getEmployees);

router.post("/add", verifyToken, authorize(3), controller.addEmployee);

router.delete("/delete", verifyToken, authorize(3), controller.deleteEmployee);

module.exports = router;