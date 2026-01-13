const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/admin/employee.controller");
const { authorize } = require('../../middleware/authorize.middleware');

// SỬA: authorize(3) -> authorize('admin')
router.get("/", verifyToken, authorize('admin'), controller.getEmployees);

router.post("/add", verifyToken, authorize('admin'), controller.addEmployee);

router.delete("/delete/:id", verifyToken, authorize('admin'), controller.deleteEmployee);

router.get("/details/:id", verifyToken, authorize('admin'), controller.getEmployeeDetails);

router.put("/edit", verifyToken, authorize('admin'), controller.editEmployee);

module.exports = router;