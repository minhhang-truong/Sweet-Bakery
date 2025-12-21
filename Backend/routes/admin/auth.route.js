const express = require('express');
const router = express.Router();
const verifyToken = require('../../middleware/auth.middleware');

const controller = require("../../controller/admin/auth.controller");
const { authorize } = require('../../middleware/authorize.middleware');

router.post("/signin", controller.signin);

module.exports = router;